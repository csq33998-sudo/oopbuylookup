const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const BASE = "https://streetstyle.maisonlooks.com";
const SHOP_PATH = "/en/s/StreetStyle";

const SOURCES = [
  { url: `${BASE}${SHOP_PATH}`, fallbackCategory: "other" },
  { url: `${BASE}${SHOP_PATH}/c/shoes`, fallbackCategory: "shoes" },
  { url: `${BASE}${SHOP_PATH}/c/jackets`, fallbackCategory: "jackets" },
  { url: `${BASE}${SHOP_PATH}/c/tops`, fallbackCategory: "hoodies" },
  { url: `${BASE}${SHOP_PATH}/c/t-shirts`, fallbackCategory: "t-shirts" },
  { url: `${BASE}${SHOP_PATH}/c/bottoms`, fallbackCategory: "pants" },
  { url: `${BASE}${SHOP_PATH}/c/accessories`, fallbackCategory: "accessories" },
  { url: `${BASE}${SHOP_PATH}/c/headwear`, fallbackCategory: "headwear" },
  { url: `${BASE}${SHOP_PATH}/c/electronics`, fallbackCategory: "electronics" },
  { url: `${BASE}${SHOP_PATH}/c/beauty`, fallbackCategory: "perfume" },
];

function fetchText(url) {
  const ps = [
    "$ProgressPreference='SilentlyContinue'",
    "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12",
    `$r=Invoke-WebRequest -Uri '${url}' -UseBasicParsing -Headers @{ 'User-Agent'='Mozilla/5.0'; 'Accept'='text/html,application/xhtml+xml' }`,
    "$r.Content",
  ].join("; ");

  return execFileSync("powershell.exe", ["-NoProfile", "-Command", ps], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

function decodeNextFlight(html) {
  const chunks = [];
  const re = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)<\/script>/g;
  let match;
  while ((match = re.exec(html))) {
    try {
      chunks.push(JSON.parse(`"${match[1]}"`));
    } catch {
      // Ignore non-data chunks that cannot be decoded cleanly.
    }
  }
  return chunks.join("\n");
}

function findMatchingBracket(text, openIndex) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = openIndex; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "[") {
      depth += 1;
    } else if (ch === "]") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function extractItems(decodedFlight) {
  const key = '"initialData":{"items":';
  const items = [];
  let cursor = 0;

  while (cursor < decodedFlight.length) {
    const keyIndex = decodedFlight.indexOf(key, cursor);
    if (keyIndex === -1) break;

    const arrayStart = decodedFlight.indexOf("[", keyIndex + key.length);
    const arrayEnd = findMatchingBracket(decodedFlight, arrayStart);
    if (arrayStart === -1 || arrayEnd === -1) {
      cursor = keyIndex + key.length;
      continue;
    }

    const rawArray = decodedFlight.slice(arrayStart, arrayEnd + 1);
    try {
      const parsed = JSON.parse(rawArray);
      items.push(...parsed);
    } catch (error) {
      console.warn(`Could not parse item array near index ${keyIndex}: ${error.message}`);
    }

    cursor = arrayEnd + 1;
  }

  return items;
}

function categoryFor(item, fallbackCategory) {
  const primary = item.primaryCategory || {};
  const name = String(primary.name || "").toLowerCase();
  const slug = String(primary.slug || "").toLowerCase();
  const slot = String(primary.tryOnSlot || "").toLowerCase();

  if (slot === "shoes" || slug.includes("sneaker") || slug.includes("shoe")) return "shoes";
  if (slot === "outerwear" || slug.includes("jacket") || slug.includes("parka") || name.includes("jacket")) return "jackets";
  if (slug.includes("underwear") || name.includes("underwear") || name.includes("briefs")) return "other";
  if (
    slug.includes("hoodie") ||
    slug.includes("sweatshirt") ||
    slug.includes("sweater") ||
    slug.includes("knit") ||
    name.includes("hoodie") ||
    name.includes("sweatshirt") ||
    name.includes("sweater")
  ) {
    return "hoodies";
  }
  if (slug.includes("shirt") || slug.includes("blouse") || name.includes("shirt") || name.includes("blouse")) return "t-shirts";
  if (slug.includes("t-shirt") || slug.includes("tees") || name.includes("t-shirt") || name.includes("tee")) return "t-shirts";
  if (slot === "bottoms" || slug.includes("pants") || slug.includes("shorts") || name.includes("pants")) return "pants";
  if (slot === "bags" || slug.includes("bag") || name.includes("bag")) return "bags";
  if (slug.includes("headwear") || slug.includes("hat") || slug.includes("cap") || name.includes("beanie")) return "headwear";
  if (slug.includes("electronics") || name.includes("electronics")) return "electronics";
  if (slug.includes("beauty") || slug.includes("fragrance") || name.includes("perfume")) return "perfume";
  if (slug.includes("jersey") || name.includes("jersey")) return "jersey";
  if (slot === "tops") return "hoodies";
  if (slug.includes("accessories") || name.includes("accessories")) return "accessories";

  return fallbackCategory || "other";
}

function productUrl(slug) {
  return `${BASE}/en/p/${slug}`;
}

function toProduct(item, id, fallbackCategory, sourceListUrl) {
  let category = categoryFor(item, fallbackCategory);
  const title = String(item.title || "").toLowerCase();
  if (title.includes("underwear") || title.includes("briefs")) {
    category = "other";
  }
  const brand = item.brand && item.brand.canonicalName ? item.brand.canonicalName : "";
  const details = [
    brand,
    item.primaryCategory && item.primaryCategory.name,
    item.colorMain,
    item.material,
  ].filter(Boolean);

  return {
    id,
    name: item.title,
    category,
    price: Number(item.price) || 0,
    options: item.images && item.images.length ? item.images.length + 1 : 1,
    image: item.imageUrl,
    href: productUrl(item.slug),
    sourceListUrl,
    brand,
    sourceId: item.weidianId || "",
    description: item.description || "",
    meta: details.join(" / "),
  };
}

async function main() {
  const seen = new Set();
  const products = [];

  for (const source of SOURCES) {
    console.log(`Fetching ${source.url}`);
    const html = fetchText(source.url);
    const decoded = decodeNextFlight(html);
    const items = extractItems(decoded);
    console.log(`  found ${items.length} products`);

    for (const item of items) {
      if (!item || !item.id || !item.title || !item.slug || !item.imageUrl) continue;
      if (!Number(item.price)) continue;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      products.push(toProduct(item, products.length + 1, source.fallbackCategory, source.url));
    }
  }

  const outPath = path.join(__dirname, "..", "products-data.json");
  fs.writeFileSync(outPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  console.log(`Wrote ${products.length} products to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
