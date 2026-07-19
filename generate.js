const fs = require("fs");
const path = require("path");

/* ========== CONFIG - edit before deploy ========== */
const INVITE = "V5N3GJS25";
const DOMAIN = "https://oopbuylookup.com";
const SITE_NAME = "OopBuy Spreadsheet";
const ASSET_VERSION = "20260719-top";
const AFFILIATE = `https://oopbuy.com/register?inviteCode=${INVITE}`;
const DISCORD = "";
const EMAIL = "help@oopbuylookup.com";
const OPEN_IN_NEW_TAB = true;
const VIEW_PRODUCTS_URL = "https://streetstyle.maisonlooks.com/en/s/StreetStyle";
const STREETSTYLE_BASE = "https://streetstyle.maisonlooks.com";
const STREETSTYLE_HOME = "https://streetstyle.maisonlooks.com/";
const STREETSTYLE_SHOP = "StreetStyle";
const CNY_PER_USD = 6.7784;
/* Slugs on oopbuylookup that differ from MaisonLooks category paths (invalid slugs 404 in their SPA). */
const STREETSTYLE_CATEGORY_SLUGS = {
  shoes: "shoes",
  clothing: "clothing",
  jackets: "jackets",
  hoodies: "tops",
  "t-shirts": "t-shirts",
  pants: "bottoms",
  bags: "accessories",
  headwear: "headwear",
  accessories: "accessories",
  electronics: "electronics",
  perfume: "beauty",
  jersey: "tops",
  other: null,
};
/* ================================================= */

function newTabAttrs() {
  return OPEN_IN_NEW_TAB ? ' target="_blank" rel="noopener noreferrer"' : "";
}

function externalCategoryAttrs() {
  return ' target="_blank" rel="noopener noreferrer"';
}

function streetstyleCategoryUrl(slug) {
  const mapped =
    Object.prototype.hasOwnProperty.call(STREETSTYLE_CATEGORY_SLUGS, slug)
      ? STREETSTYLE_CATEGORY_SLUGS[slug]
      : slug;
  if (mapped === null) {
    return `${STREETSTYLE_BASE}/en/s/${STREETSTYLE_SHOP}`;
  }
  const categorySlug = mapped ?? slug;
  return `${STREETSTYLE_BASE}/en/s/${STREETSTYLE_SHOP}/c/${categorySlug}`;
}

function homeBtn(prefix = "", text = "Sign Up on OopBuy ->") {
  return `<a href="${AFFILIATE}" class="btn btn-primary"${newTabAttrs()}>${text}</a>`;
}

function homeAnchor(prefix = "", label = "Home") {
  return `<a href="/" class="link-home" data-same-tab="true">${label}</a>`;
}

function dropdownBtn(label, activeSuffix = "") {
  return `<button class="nav-dropdown-btn${activeSuffix}" aria-expanded="false">${label}<span class="nav-chevron" aria-hidden="true"></span></button>`;
}

const languages = [
  { code: "en", label: "English", flag: "US" },
  { code: "zh-CN", label: "Chinese", flag: "CN" },
  { code: "pl", label: "Polski", flag: "PL" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "fr", label: "French", flag: "FR" },
  { code: "it", label: "Italiano", flag: "IT" },
  { code: "pt", label: "Portuguese", flag: "PT" },
  { code: "es", label: "Spanish", flag: "ES" },
  { code: "nl", label: "Nederlands", flag: "NL" },
  { code: "da", label: "Dansk", flag: "DK" },
  { code: "sv", label: "Svenska", flag: "SE" },
  { code: "ar", label: "Arabic", flag: "SA" },
  { code: "cs", label: "Czech", flag: "CZ" },
];

function languageDropdown() {
  return `<div class="nav-dropdown nav-language notranslate" translate="no">
          <button class="nav-dropdown-btn nav-language-btn" aria-expanded="false" aria-label="Select language"><span class="language-globe" aria-hidden="true">O</span><span class="language-current">Language</span><span class="nav-chevron" aria-hidden="true"></span></button>
          <div class="nav-dropdown-menu nav-language-menu">
            ${languages.map((lang) => `<button type="button" class="language-option" data-lang="${lang.code}"><span class="language-flag">${lang.flag}</span><span>${lang.label}</span></button>`).join("\n            ")}
          </div>
        </div>`;
}

const mainCategories = [
  { slug: "shoes", name: "Sneakers", icon: "SH", group: "products" },
  { slug: "clothing", name: "Clothing", icon: "CL", group: "products", isGroup: true },
  { slug: "bags", name: "Bags", icon: "BG", group: "products" },
  { slug: "accessories", name: "Accessories", icon: "AC", group: "products" },
  { slug: "electronics", name: "Electronics", icon: "EL", group: "products" },
];

const allCategories = [
  { slug: "shoes", name: "Shoes", icon: "SH", desc: "Browse sneakers, running shoes, and streetwear footwear in the OopBuy Spreadsheet from trusted sellers." },
  { slug: "jackets", name: "Jackets", icon: "JK", desc: "Find puffer jackets, windbreakers, and designer outerwear in the OopBuy Spreadsheet with QC-reviewed listings." },
  { slug: "hoodies", name: "Hoodies", icon: "HD", iconImg: "icons/hoodie.svg", desc: "Discover hoodies and crewnecks curated in the OopBuy Spreadsheet from verified OopBuy sellers." },
  { slug: "t-shirts", name: "T-Shirts", icon: "TS", desc: "Explore graphic tees and streetwear tops listed in the OopBuy Spreadsheet with trusted seller links." },
  { slug: "pants", name: "Pants", icon: "PT", desc: "Shop pants, joggers, and shorts from the OopBuy Spreadsheet with daily updated finds." },
  { slug: "bags", name: "Bags", icon: "BG", desc: "Browse backpacks, crossbody bags, and luxury-inspired styles in the OopBuy Spreadsheet." },
  { slug: "headwear", name: "Headwear", icon: "HW", desc: "Find caps, beanies, and hats in the OopBuy Spreadsheet from verified sellers." },
  { slug: "accessories", name: "Accessories", icon: "AC", desc: "Watches, belts, jewelry, and more - organized in the OopBuy Spreadsheet." },
  { slug: "electronics", name: "Electronics", icon: "EL", desc: "Discover gadgets and tech accessories in the OopBuy Spreadsheet with community-verified listings." },
  { slug: "perfume", name: "Perfume", icon: "PF", desc: "Browse fragrance finds in the OopBuy Spreadsheet from trusted OopBuy sellers." },
  { slug: "jersey", name: "Jersey", icon: "JS", desc: "Football, basketball, and sports jerseys curated in the OopBuy Spreadsheet." },
  { slug: "other", name: "Other", icon: "OT", desc: "Miscellaneous trending finds and unique items from the OopBuy Spreadsheet." },
];

const clothingSlugs = ["jackets", "hoodies", "t-shirts", "pants"];

const categoryIcons = {
  shoes: "SH",
  jackets: "JK",
  hoodies: "HD",
  "t-shirts": "TS",
  pants: "PT",
  bags: "BG",
  headwear: "HW",
  accessories: "AC",
  electronics: "EL",
  perfume: "PF",
  jersey: "JS",
  other: "OT",
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function productImage(name, category) {
  const icon = categoryIcons[category] || "OT";
  const label = escapeXml(String(name).slice(0, 22));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <circle cx="200" cy="168" r="56" fill="rgba(255,255,255,0.08)"/>
  <text x="200" y="188" text-anchor="middle" font-size="64">${icon}</text>
  <text x="200" y="268" text-anchor="middle" fill="#cbd5e1" font-size="15" font-family="system-ui,-apple-system,sans-serif">${label}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function product(id, name, category, price, options, image) {
  return {
    id,
    name,
    category,
    price,
    options,
    image: image || productImage(name, category),
  };
}

const oopbuyProducts = require("./products-data.json");

const guides = [
  { slug: "how-to-buy", navLabel: "How to Buy", title: "How to Buy on OopBuy", excerpt: "Official-style OopBuy buying guide covering product links, options, payment, warehouse QC, parcel submission, and tracking.", icon: "BUY" },
  { slug: "shipping", navLabel: "Shipping Guide", title: "OopBuy Shipping Guide", excerpt: "Explore Oopbuy shipping logistics with this comprehensive guide on lines, costs, and delivery times.", icon: "SHIP" },
  { slug: "declaration", navLabel: "Declaration Guide", title: "How to Declare on OopBuy", excerpt: "Get a detailed guide on how to correctly declare items on Oopbuy for smooth customs clearance.", icon: "DEC" },
  { slug: "qc-photos", navLabel: "QC Photos Guide", title: "QC Photos Guide", excerpt: "Learn how to review quality control photos at the OopBuy warehouse before shipping.", icon: "QC" },
  { slug: "coupons", navLabel: "Coupons Guide", title: "All You Need to Know About Coupons", excerpt: "What is a Coupon on Oopbuy? A coupon is a promotional tool to save on orders and shipping.", icon: "SAVE" },
  { slug: "what-is-oopbuy", navLabel: "What is OopBuy?", title: "What is OopBuy?", excerpt: "Oopbuy is a Chinese shopping agent renowned for its quality, affordability, and extensive selection.", icon: "INFO" },
];

const homeGuideSlugs = ["declaration", "shipping", "what-is-oopbuy", "coupons"];

const homeGuideDetails = {
  declaration: {
    kicker: "Customs Guide",
    excerpt:
      "Learn how to set a realistic parcel declaration, avoid common customs mistakes, and keep your OopBuy shipment moving smoothly from warehouse to delivery.",
  },
  shipping: {
    kicker: "Shipping Routes",
    excerpt:
      "Compare shipping lines, delivery speed, parcel weight, and risk level before you ship. This guide helps you choose the route that fits your budget and timeline.",
  },
  "what-is-oopbuy": {
    kicker: "Beginner Basics",
    excerpt:
      "New to OopBuy? Start here for a clear breakdown of how the agent works, how the spreadsheet fits into buying, and what to check before placing your first order.",
  },
  coupons: {
    kicker: "Savings Tips",
    excerpt:
      "Understand how OopBuy coupons work, where discounts apply, and how to combine sign-up rewards with smarter shipping choices to reduce your total cost.",
  },
};

const blogPosts = [
  {
    tag: "Guide",
    title: "The Complete OOPBUY Spreadsheet Guide for 2026",
    excerpt:
      "A researched starting point based on OopBuy's live proxy-shopping flow: pay for goods first, wait for warehouse receipt and QC photos, then submit the international parcel.",
    readTime: "8 min read",
    href: "guides/how-to-buy.html",
    cta: "Read guide",
    referenceHref: "https://oopbuylist.com/oopbuy-3",
    referenceCta: "Reference workflow article",
  },
  {
    tag: "Jackets",
    title: "Top Jackets Spreadsheet",
    excerpt:
      "Outerwear belongs to the MaisonLooks official category tree, which sits inside a shop page showing 67,127 total product results at the time checked.",
    readTime: "5 min read",
    href: streetstyleCategoryUrl("jackets"),
    cta: "Browse jackets",
    external: true,
    referenceHref: "https://oopbuylist.com/oopbuy-7",
    referenceCta: "Reference viral-products article",
  },
  {
    tag: "Sneakers",
    title: "Sneaker Finds",
    excerpt:
      "Sneakers are listed under the MaisonLooks shoes category tree; examples on the official shop page include Air Jordan, Air Force 1, Air Max, and Shox TL listings with CNY prices.",
    readTime: "6 min read",
    href: streetstyleCategoryUrl("shoes"),
    cta: "Browse sneakers",
    external: true,
    referenceHref: "https://oopbuylist.com/oopbuy-8",
    referenceCta: "Reference trending-products article",
  },
  {
    tag: "Accessories",
    title: "Accessories Finds",
    excerpt:
      "The MaisonLooks accessories category showed 10,273 results when checked, including jewelry, watches, belts, socks, scarves, ties, headwear, and bags.",
    readTime: "4 min read",
    href: streetstyleCategoryUrl("accessories"),
    cta: "Browse accessories",
    external: true,
    referenceHref: "https://oopbuylist.com/oopbuy-7",
    referenceCta: "Reference category article",
  },
  {
    tag: "Hoodies",
    title: "Hoodies & Sweaters Spreadsheet",
    excerpt:
      "Tops and clothing appear as first-level browse paths on MaisonLooks; OopBuy's QC step is where buyers should verify labels, colors, sizing tags, and visible defects before shipping.",
    readTime: "5 min read",
    href: streetstyleCategoryUrl("hoodies"),
    cta: "Browse hoodies",
    external: true,
    referenceHref: "https://oopbuylist.com/oopbuy-5",
    referenceCta: "Reference winning-products article",
  },
  {
    tag: "Pants",
    title: "Pants & Shorts Finds",
    excerpt:
      "Bottoms are part of the MaisonLooks category tree, and the live OopBuy flow separates seller-to-warehouse delivery from warehouse-to-address international shipping.",
    readTime: "5 min read",
    href: streetstyleCategoryUrl("pants"),
    cta: "Browse pants",
    external: true,
    referenceHref: "https://oopbuylist.com/oopbuy-6",
    referenceCta: "Reference shopper-confidence article",
  },
];

function seoClosingBlock(slug, prefix = "") {
  const guideHref = `${prefix}guides/shipping.html`;
  const qcHref = `${prefix}guides/qc-photos.html`;
  const spreadsheetHref = `${prefix}spreadsheet.html`;
  const compareHref = `${prefix}compare.html`;
  const copy = {
    "how-to-buy": {
      h: "Final OopBuy Buying Checklist",
      p: `Use the <a href="${spreadsheetHref}" class="text-link">OopBuy spreadsheet</a> to compare OopBuy finds, open live source links, review <a href="${qcHref}" class="text-link">QC photos</a>, and follow the <a href="${guideHref}" class="text-link">shipping checklist</a> before paying for international delivery. This keeps product discovery, warehouse inspection, and parcel submission connected in one workflow.`,
    },
    shipping: {
      h: "Shipping Checklist for Spreadsheet Finds",
      p: `Before submitting a parcel, save this OopBuy shipping checklist: verify QC photos, source links, item categories, destination restrictions, declaration value, insurance, and route price. The best OopBuy finds are still only worth shipping when the live listing, warehouse photos, and final parcel cost all make sense together.`,
    },
    declaration: {
      h: "Declaration Notes for OopBuy Finds",
      p: `When a product comes from an OopBuy spreadsheet or other OopBuy finds list, check the source links and QC photos before declaring the parcel. Your shipping checklist should match the actual item categories, weight, destination rules, and declared value so the package profile looks consistent.`,
    },
    "qc-photos": {
      h: "QC Photos Before Shipping",
      p: `For better OopBuy finds, compare the live source links with warehouse QC photos before adding the item to your shipping checklist. If the color, size tag, material, or visible finish does not match the product page, resolve it before the item is packed for international shipping.`,
    },
    coupons: {
      h: "Coupons and Shipping Checklist",
      p: `Coupons work best after you already know which OopBuy finds are worth shipping. Build the parcel from source links you trust, review QC photos, then use the shipping checklist to compare route price, coupon eligibility, insurance, and final cost before checkout.`,
    },
    "what-is-oopbuy": {
      h: "How the Spreadsheet Fits",
      p: `The practical flow is simple: start with an OopBuy spreadsheet, shortlist OopBuy finds, open the source links, purchase through OopBuy, inspect QC photos, then complete a shipping checklist before international delivery. That is the search path this site is built to support.`,
    },
    spreadsheet: {
      h: "How to Use These OopBuy Finds",
      p: `Treat this OopBuy spreadsheet as the start of research, not the final decision. Open each product source link, compare options and seller details, wait for warehouse QC photos, then use the shipping checklist before submitting a parcel. That workflow gives Google and shoppers a clear reason to connect this page with OopBuy finds, QC photos, source links, and shipping preparation.`,
    },
    blog: {
      h: "Long-Tail Topics Covered Here",
      p: `These OopBuy spreadsheet articles are organized around real shopper intent: finding OopBuy finds, checking source links, reviewing QC photos, and using a shipping checklist before a haul leaves the warehouse. Use the guides, product categories, and comparison pages together when planning a complete order.`,
    },
    compare: {
      h: "Compare With Source Links",
      p: `Each comparison should be read with live source links, current shipping details, QC photos, and a shipping checklist in mind. Agent pages change over time, so verify fees, payment methods, warehouse workflow, and parcel routes before choosing where to buy OopBuy finds.`,
    },
    qc: {
      h: "QC Photos and Shipping Checklist",
      p: `Use this page after you shortlist OopBuy finds from the spreadsheet. Open the source links, compare them with warehouse QC photos, and keep a shipping checklist for route restrictions, declaration value, insurance, and final parcel cost before submitting the haul.`,
    },
  };
  const block = copy[slug];
  if (!block) return "";
  return `        <h2>${block.h}</h2>\n        <p>${block.p}</p>`;
}

const oopbuyListReferences = [
  {
    title: "Oopbuy Spreadsheet to Discover Trending Products Fast",
    href: "https://oopbuylist.com/oopbuy-8",
    date: "2026-07-03",
  },
  {
    title: "Oopbuy Spreadsheet Strategy for Finding Viral Products",
    href: "https://oopbuylist.com/oopbuy-7",
    date: "2026-07-03",
  },
  {
    title: "Find Winning Products with Oopbuy Spreadsheet",
    href: "https://oopbuylist.com/oopbuy-5",
    date: "2026-07-03",
  },
  {
    title: "Why Every Dropshipper Needs Oopbuy Spreadsheet",
    href: "https://oopbuylist.com/oopbuy-6",
    date: "2026-07-03",
  },
  {
    title: "Oopbuy Spreadsheet 2026: The Ultimate E-Commerce Optimization Tool",
    href: "https://oopbuylist.com/oopbuy-1",
    date: "2026-06-25",
  },
  {
    title: "Oopbuy Spreadsheet Workflow for Efficient Product Research",
    href: "https://oopbuylist.com/oopbuy-3",
    date: "2026-06-25",
  },
  {
    title: "Advanced Oopbuy Spreadsheet Techniques for Scaling E-Commerce",
    href: "https://oopbuylist.com/oopbuy-4",
    date: "2026-06-25",
  },
  {
    title: "Beginner's Guide to Oopbuy Spreadsheet for Online Sellers",
    href: "https://oopbuylist.com/oopbuy-2",
    date: "2026-06-25",
  },
];

const comparisons = [
  {
    slug: "kakobuy",
    name: "KakoBuy",
    title: "OopBuy vs KakoBuy",
    nav: true,
    sourceHref: "https://oopbuy-spreadsheet.com/articles/oopbuy-vs-kakobuy",
    summary: "Pricing, shipping, QC photos, customer support, payment methods, warehouse processing, and platform UX.",
    sourceAngle: "The reference article frames this as a value comparison between two active Chinese shopping agents.",
  },
  {
    slug: "litbuy",
    name: "LitBuy",
    title: "OopBuy vs LitBuy",
    nav: true,
    sourceHref: "https://oopbuy-spreadsheet.com/articles/oopbuy-vs-litbuy",
    summary: "Track record, trust, service fees, shipping-line depth, QC consistency, support channels, and payment coverage.",
    sourceAngle: "The reference article focuses on the risk of choosing a newer agent with less long-term buyer history.",
  },
  {
    slug: "hipobuy",
    name: "Hipobuy",
    title: "OopBuy vs Hipobuy",
    nav: true,
    sourceHref: "https://oopbuy-spreadsheet.com/articles/oopbuy-vs-hipobuy",
    summary: "Reliability, introductory pricing, carrier access, QC-photo maturity, support experience, and dispute handling.",
    sourceAngle: "The reference article positions Hipobuy as a new entrant and compares it against OopBuy's longer operating record.",
  },
  {
    slug: "cnfans",
    name: "CNFans",
    title: "OopBuy vs CNFans",
    nav: true,
    sourceHref: "https://oopbuy-spreadsheet.com/articles/oopbuy-vs-cnfans",
    summary: "Safety, operational stability, data-security concerns, shipping reliability, QC predictability, and support response.",
    sourceAngle: "The reference article centers the comparison on platform safety and reliability risk.",
  },
  {
    slug: "acbuy",
    name: "AcBuy",
    title: "OopBuy vs AcBuy",
    sourceHref: "https://oopbuy-spreadsheet.com/articles/oopbuy-vs-acbuy",
    summary: "Service fees, shipping-network age, QC-photo quality, support speed, payment options, and mobile usability.",
    sourceAngle: "The reference article describes AcBuy as an older agent and compares it with newer OopBuy workflow features.",
  },
  {
    slug: "joyagoo",
    name: "Joyagoo",
    title: "OopBuy vs Joyagoo",
    sourceHref: "https://oopbuy-spreadsheet.com/articles/oopbuy-vs-joyagoo",
    summary: "Legacy-agent trust, fee structure, route availability, warehouse processing, QC turnaround, and interface quality.",
    sourceAngle: "The reference article treats Joyagoo as a legacy platform that has not modernized its buyer experience.",
  },
  {
    slug: "mulebuy",
    name: "MuleBuy",
    title: "OopBuy vs MuleBuy",
    sourceHref: "https://oopbuy-spreadsheet.com/articles/oopbuy-vs-mulebuy",
    summary: "High-fee risk, limited shipping choices, slower support, inconsistent QC photos, and outdated warehouse UX.",
    sourceAngle: "The reference article compares MuleBuy against OopBuy on cost, support, QC, and platform usability.",
  },
  {
    slug: "usfans",
    name: "USFans",
    title: "OopBuy vs USFans",
    sourceHref: "https://oopbuy-spreadsheet.com/articles/oopbuy-vs-usfans",
    summary: "New-agent risk, lack of public track record, limited carrier relationships, support capacity, and dispute processes.",
    sourceAngle: "The reference article focuses on USFans being too new to judge against an agent with more operating history.",
  },
];

const siteHost = DOMAIN.replace(/^https?:\/\//, "");

const faqs = [
  { q: "What is Oopbuy?", a: "Oopbuy is a renowned Chinese shopping service known for its quality, affordability, and extensive selection. Connecting international customers with Chinese fashion sellers, Oopbuy aims to provide a seamless and secure shopping experience. The Oopbuy spreadsheet further enhances this by organizing and simplifying the shopping process." },
  { q: `What is ${siteHost}?`, a: `${siteHost} is a dedicated platform designed to make using the Oopbuy spreadsheet easy and efficient. It provides access to a vast selection of high-quality products, along with useful articles and the latest updates related to Oopbuy and its spreadsheets.` },
  { q: "Why should I opt for a website spreadsheet over a traditional one?", a: "Our OopBuy Spreadsheet website offers a streamlined, mobile-optimized experience for browsing Oopbuy spreadsheets. Unlike traditional spreadsheets, our platform pre-screens products to ensure quality and provides a more user-friendly interface. This makes finding the best items through the OopBuy spreadsheet quicker and easier." },
  { q: "How can I get additional support?", a: `For extra help with the Oopbuy spreadsheet or other queries, contact us at ${EMAIL}. We can help with spreadsheet questions, seller checks, and product suggestions.` },
  { q: "How do I place an order with Oopbuy?", a: "Using the Oopbuy spreadsheet to place an order is simple. Browse the spreadsheet for products, click the image link to go directly to the product page on Oopbuy, select size and color options, add items to your cart, fill in the details, and complete payment. OopBuy supports PayPal and balance top-up. Track your order through stages like Process Pending, Purchased, and Seller Send. Once items arrive at the warehouse, review QC photos and choose your shipping method." },
  { q: "Can you help me find a specific product?", a: `Absolutely. Send the product name or reference image to ${EMAIL}, and we can review it for a future OopBuy spreadsheet update.` },
  { q: "Why should I use Oopbuy instead of other shipping agents?", a: "OopBuy stands out among shopping agents thanks to competitive shipping rates, a user-friendly interface, reliable quality check photos, and responsive customer service. Their platform supports multiple payment methods including PayPal, and they offer generous coupon bundles for new users. Combined with our OopBuy spreadsheet that pre-screens products for quality, you get a seamless and trustworthy shopping experience." },
  { q: "What is an OopBuy spreadsheet?", a: `An OopBuy spreadsheet is a curated list of the best products available through the OopBuy shopping agent. Our OopBuy spreadsheet at ${siteHost} is a curated and regularly updated version, featuring over 100 featured items from trusted sellers. We organize products by category and update the spreadsheet daily with new high quality finds.` },
];

function rel(prefix) {
  return prefix || "";
}

function promoBar(prefix = "") {
  const p = rel(prefix);
  return `  <div class="promo-bar">
    <div class="container promo-inner">
      <span>Special OopBuy Offer: <strong>CNY 3,000 Coupon Bundle</strong> + 15% Off Shipping</span>
      <a href="${AFFILIATE}" class="promo-link"${newTabAttrs()}>Redeem Now -&gt;</a>
    </div>
  </div>`;
}

function siteLogo(prefix = "") {
  const p = rel(prefix);
  return `      <a href="/" class="logo logo--brand link-home" data-same-tab="true">
        <span class="logo-wordmark" aria-label="${SITE_NAME}">
          <span class="logo-line logo-line-top">
            <img src="${p}images/logo/oopbuy-mark.png" alt="oopbuy spreadsheet 2026" class="logo-icon" width="46" height="44">
            <span class="logo-name">opBuy</span>
          </span>
          <span class="logo-line logo-line-bottom">Spreadsheet</span>
        </span>
      </a>`;
}

function nav(current, prefix = "") {
  const p = rel(prefix);
  const cp = `${p}categories/`;
  const activeSuffix = (id) => (current === id ? " active" : "");
  const activeAttr = (id) => (current === id ? ' class="active"' : "");
  const linkClass = (base, id) => ` class="${base}${activeSuffix(id)}"`;

  const spreadsheetLinks = mainCategories
    .map((c) => {
      if (c.isGroup) return `<a href="${streetstyleCategoryUrl("clothing")}"${externalCategoryAttrs()}>Clothing</a>`;
      return `<a href="${streetstyleCategoryUrl(c.slug)}"${externalCategoryAttrs()}>${c.name}</a>`;
    })
    .join("\n            ");

  const compareLinks = comparisons
    .filter((c) => c.nav)
    .map((c) => `<a href="${p}compare/vs-${c.slug}.html">vs ${c.name}</a>`)
    .join("\n            ");

  const spreadsheetActive = current === "spreadsheet" || current.startsWith("cat-") ? " active" : "";
  const guidesActive = current === "guides" || current.startsWith("guide-") ? " active" : "";
  const compareActive = current.startsWith("compare-") ? " active" : "";

  return `${promoBar(prefix)}
  <header class="site-header site-header--merged">
    <div class="container header-inner">
      ${siteLogo(prefix)}

      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>

      <nav class="site-nav" id="siteNav">
        <a href="/"${linkClass("link-home", "home")} data-same-tab="true">Home</a>
        <div class="nav-dropdown">
          ${dropdownBtn("Spreadsheet", spreadsheetActive)}
          <div class="nav-dropdown-menu nav-dropdown-menu--wide">
            <a href="${VIEW_PRODUCTS_URL}"${externalCategoryAttrs()}${activeAttr("spreadsheet")}>All Products</a>
            ${spreadsheetLinks}
          </div>
        </div>
        <div class="nav-dropdown">
          ${dropdownBtn("Guides", guidesActive)}
          <div class="nav-dropdown-menu">
            ${guides.filter((g) => g.slug !== "what-is-oopbuy").map((g) => `<a href="${p}guides/${g.slug}.html"${activeAttr(`guide-${g.slug}`)}>${g.navLabel}</a>`).join("\n            ")}
            <a href="${p}guides.html"${activeAttr("guides")}>View All Guides</a>
          </div>
        </div>
        <div class="nav-dropdown">
          ${dropdownBtn("Compare", compareActive)}
          <div class="nav-dropdown-menu">
            ${compareLinks}
            <a href="${p}compare.html"${activeAttr("compare")}>View All Comparisons</a>
          </div>
        </div>
        <a href="${p}qc.html"${activeAttr("qc")}>QC</a>
        <a href="${p}deals.html"${activeAttr("deals")}>Deals</a>
        <a href="${p}review.html"${activeAttr("review")}>Review</a>
        <a href="${p}blog.html"${activeAttr("blog")}>Blog</a>
        <a href="${p}about.html"${activeAttr("about")}>About</a>
        ${languageDropdown()}
        <a href="${AFFILIATE}" class="btn btn-nav-signup" target="_blank" rel="noopener noreferrer">Sign Up Free</a>
      </nav>
    </div>
  </header>`;
}

function footer(prefix = "") {
  const p = rel(prefix);
  const discordLink = DISCORD
    ? `          <li><a href="${DISCORD}" target="_blank" rel="noopener noreferrer">Discord</a></li>`
    : "";
  return `  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <h4>Products</h4>
        <ul>
          <li><a href="${VIEW_PRODUCTS_URL}"${externalCategoryAttrs()}>All Products</a></li>
          <li><a href="${streetstyleCategoryUrl("shoes")}"${externalCategoryAttrs()}>Sneakers</a></li>
          <li><a href="${streetstyleCategoryUrl("clothing")}"${externalCategoryAttrs()}>Clothing</a></li>
          <li><a href="${streetstyleCategoryUrl("bags")}"${externalCategoryAttrs()}>Bags</a></li>
          <li><a href="${streetstyleCategoryUrl("accessories")}"${externalCategoryAttrs()}>Accessories</a></li>
          <li><a href="${streetstyleCategoryUrl("electronics")}"${externalCategoryAttrs()}>Electronics</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Guides</h4>
        <ul>
          ${guides.filter((g) => ["how-to-buy", "shipping", "declaration", "qc-photos", "coupons"].includes(g.slug)).map((g) => `<li><a href="${p}guides/${g.slug}.html">${g.navLabel}</a></li>`).join("\n          ")}
        </ul>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <ul>
          <li><a href="${p}review.html">OopBuy Review</a></li>
          <li><a href="${p}blog.html">Blog</a></li>
          <li><a href="${p}spreadsheet.html">Best Finds 2026</a></li>
          <li><a href="${p}qc.html">QC Navigation</a></li>
          <li><a href="${p}deals.html">Deals &amp; Coupons</a></li>
          <li><a href="${p}compare.html">Compare Agents</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="${p}about.html">About Us</a></li>
          <li><a href="${p}contact.html">Contact</a></li>
${discordLink}
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p class="footer-copy">&copy; 2026 ${DOMAIN.replace("https://", "")}</p>
      <p class="footer-disclaimer">
        This website operates solely as an informational platform and does not conduct commercial transactions.
        We have no formal association with OopBuy or its brand. Contact <a href="mailto:${EMAIL}">${EMAIL}</a> for inquiries.
      </p>
    </div>
  </footer>`;
}

function head(title, description, urlPath, prefix = "", extraHead = "") {
  const p = rel(prefix);
  const url = `${DOMAIN}${urlPath === "/" ? "/" : urlPath}`;
  const ogImage = `${DOMAIN}/images/favicon.png`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="oopbuy spreadsheet, oopbuy sheet, oopbuy finds, QC photos, source links, shipping checklist, oopbuy guide, oopbuy trusted sellers, oopbuy 2026">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:image" content="${ogImage}">

  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">

  <link rel="icon" href="${p}images/favicon.png" type="image/png" sizes="32x32">
  <link rel="shortcut icon" href="${p}images/favicon.png">
  <link rel="stylesheet" href="${p}style.css">${extraHead ? `\n${extraHead}` : ""}
</head>
<body>`;
}

function pageEnd(prefix = "", extraScripts = "", beforeMainScripts = "") {
  const p = rel(prefix);
  return `
  <div id="google_translate_element" class="translate-mount notranslate" translate="no"></div>
  <script src="${p}config.js"></script>${beforeMainScripts}
  <script src="${p}main.js?v=${ASSET_VERSION}"></script>${extraScripts}
</body>
</html>
`;
}

function heroShell(content) {
  return `  <div class="hero-shell">\n${content}\n  </div>`;
}

function ctaBlock(text = "Browse Spreadsheet ->", secondary = false) {
  const cls = secondary ? "btn btn-secondary btn-lg" : "btn btn-primary btn-lg";
  const href = secondary ? AFFILIATE : "spreadsheet.html";
  return `<a href="${href}" class="${cls}"${newTabAttrs()}>${text}</a>`;
}

function signupCta() {
  return `    <section class="section signup-cta">
      <div class="container signup-grid">
        <div class="signup-content">
          <h2>New to OopBuy?<br>Get started with CNY 3,000 in coupons.</h2>
          <p>Sign up and unlock your coupon bundle + 15% off shipping on your first order. Use the coupon bundle before your first shipment.</p>
          <div class="signup-steps">
            <div class="signup-step"><span class="step-circle">1</span><span>Click Sign Up</span></div>
            <div class="signup-step"><span class="step-circle">2</span><span>Enter Your Email</span></div>
            <div class="signup-step"><span class="step-circle">3</span><span>Get Your Coupons</span></div>
          </div>
          <p class="signup-note">Takes less than 30 seconds</p>
          <a href="${AFFILIATE}" class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">Sign Up Free</a>
        </div>
      </div>
    </section>`;
}

function faqSection() {
  return `    <section class="section faq" id="faq">
      <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-subtitle">Everything you need to know about using OopBuy and our spreadsheet.</p>
        <div class="faq-list">
${faqs.map((f) => `          <details class="faq-item">
            <summary class="faq-trigger"><span class="faq-question">${f.q}</span><span class="faq-chevron" aria-hidden="true"></span></summary>
            <div class="faq-panel"><p>${f.a}</p></div>
          </details>`).join("\n")}
        </div>
      </div>
    </section>`;
}

function aboutSeoBlock() {
  return `    <section class="section about-seo">
      <div class="container">
        <p class="section-label">About Our Spreadsheet</p>
        <h2 class="section-title section-title-left">A Large OopBuy Spreadsheet Built to Help You Shop Smarter</h2>
        <div class="seo-content">
          <p>Searching for a dependable <strong>OopBuy Spreadsheet</strong>? This site brings together a hand-picked <strong>OopBuy Spreadsheet 2026</strong> with ${productCountLabel} quality listings from MaisonLooks StreetStyle  - grouped into clear sections for shoes, apparel, bags, accessories, and other popular picks.</p>
          <p>We work to keep one of the most complete OopBuy lists available by refreshing entries every day and adding standout products as they appear. Before a link goes live, our team checks seller track record and listing quality so you see fewer risky options and more <strong>trusted OopBuy finds</strong>.</p>
          <p>Shop by category: <a href="${streetstyleCategoryUrl("shoes")}" class="text-link"${externalCategoryAttrs()}>Sneakers</a>, <a href="${streetstyleCategoryUrl("clothing")}" class="text-link"${externalCategoryAttrs()}>Clothing</a>, <a href="${streetstyleCategoryUrl("bags")}" class="text-link"${externalCategoryAttrs()}>Bags</a>, <a href="${streetstyleCategoryUrl("accessories")}" class="text-link"${externalCategoryAttrs()}>Accessories</a>, and <a href="${streetstyleCategoryUrl("electronics")}" class="text-link"${externalCategoryAttrs()}>Electronics</a>. New to the platform? Start with our guides on <a href="guides/what-is-oopbuy.html" class="text-link">What is OopBuy</a>, <a href="guides/shipping.html" class="text-link">Shipping</a>, and <a href="guides/coupons.html" class="text-link">Coupons</a>.</p>
          <p>Choosing between shopping agents? See side-by-side write-ups: <a href="compare/vs-litbuy.html" class="text-link">OopBuy vs LitBuy</a>, <a href="compare/vs-hipobuy.html" class="text-link">OopBuy vs Hipobuy</a>, and <a href="compare/vs-kakobuy.html" class="text-link">OopBuy vs KakoBuy</a>.</p>
        </div>
      </div>
    </section>`;
}

const homeCategoryGridOrder = [
  ["shoes", "Shoes"],
  ["t-shirts", "T-shirts"],
  ["hoodies", "Hoodies"],
  ["jackets", "Jackets"],
  ["pants", "Pants/Shorts"],
  ["bags", "Bags"],
  ["jersey", "Jersey"],
  ["headwear", "Headwear"],
  ["accessories", "Accessories"],
  ["electronics", "Electronics"],
  ["perfume", "Perfume"],
  ["other", "Other Stuff"],
];

const categoryVectorIcons = {
  shoes: '<svg viewBox="0 0 64 64" role="img"><path fill="#60a5fa" stroke="#1e3a8a" d="M10 42c8 3 15 2 22-2l7-4 9 6c4 3 8 4 13 4v6H11c-4 0-6-2-6-5 0-2 2-4 5-5Z"/><path fill="#bfdbfe" stroke="#1e3a8a" d="M21 31c5 2 10 1 15-2l6 5-9 5c-7 4-15 4-23 1l3-8c2-3 5-4 8-1Z"/><path fill="#f8fafc" stroke="#1e3a8a" d="M40 34l6-5 9 11-7 2-8-8Z"/></svg>',
  "t-shirts": '<svg viewBox="0 0 64 64" role="img"><path fill="#34d399" stroke="#065f46" d="M23 10h18l5 6 10 4-6 13-7-3v24H21V30l-7 3-6-13 10-4 5-6Z"/><path fill="none" stroke="#065f46" d="M24 10c2 5 5 8 8 8s6-3 8-8"/></svg>',
  hoodies: '<svg viewBox="0 0 64 64" role="img"><path fill="#818cf8" stroke="#312e81" d="M22 18c1-8 6-12 10-12s9 4 10 12l8 7v29H14V25l8-7Z"/><path fill="none" stroke="#312e81" d="M22 20c3 4 6 6 10 6s7-2 10-6"/><path fill="#c7d2fe" stroke="#312e81" d="M24 54V39h16v15"/><path fill="none" stroke="#312e81" d="M25 22v11M39 22v11"/></svg>',
  jackets: '<svg viewBox="0 0 64 64" role="img"><path fill="#f97316" stroke="#7c2d12" d="M23 10h18l9 8 5 36H39l-7-17-7 17H9l5-36 9-8Z"/><path fill="none" stroke="#7c2d12" d="M23 10v44M41 10v44"/><path fill="none" stroke="#fff7ed" d="M28 16h8M19 35h8M37 35h8"/></svg>',
  pants: '<svg viewBox="0 0 64 64" role="img"><path fill="#38bdf8" stroke="#075985" d="M20 8h24l4 48H35l-3-29-3 29H16l4-48Z"/><path fill="none" stroke="#075985" d="M20 18h24"/><path fill="none" stroke="#075985" d="M32 9v18"/></svg>',
  bags: '<svg viewBox="0 0 64 64" role="img"><path fill="#a78bfa" stroke="#4c1d95" d="M13 24h38l4 30H9l4-30Z"/><path fill="none" stroke="#4c1d95" d="M23 24v-5c0-6 4-10 9-10s9 4 9 10v5"/><path fill="none" stroke="#ede9fe" d="M22 36h20"/></svg>',
  jersey: '<svg viewBox="0 0 64 64" role="img"><path fill="#ef4444" stroke="#7f1d1d" d="M22 10h20l5 7 9 5-6 13-7-3v22H21V32l-7 3-6-13 9-5 5-7Z"/><path fill="none" stroke="#fee2e2" d="M27 24h10v20"/><path fill="none" stroke="#fee2e2" d="M27 44h18"/></svg>',
  headwear: '<svg viewBox="0 0 64 64" role="img"><path fill="#facc15" stroke="#713f12" d="M12 39c2-12 10-20 22-20 10 0 17 6 18 18l7 3c-8 4-17 6-27 6-8 0-15-2-20-7Z"/><path fill="none" stroke="#713f12" d="M34 19V9"/><path fill="none" stroke="#713f12" d="M26 10h16"/><path fill="none" stroke="#fefce8" d="M16 39c11 3 23 3 36-2"/></svg>',
  accessories: '<svg viewBox="0 0 64 64" role="img"><circle fill="#f9a8d4" stroke="#831843" cx="24" cy="32" r="12"/><circle fill="#f0abfc" stroke="#831843" cx="40" cy="32" r="12"/><path fill="none" stroke="#831843" d="M12 32H6M58 32h-6"/><path fill="none" stroke="#831843" d="M21 47l-5 8M43 47l5 8"/></svg>',
  electronics: '<svg viewBox="0 0 64 64" role="img"><rect fill="#22d3ee" stroke="#164e63" x="18" y="6" width="28" height="52" rx="5"/><path fill="none" stroke="#164e63" d="M27 12h10"/><path fill="none" stroke="#164e63" d="M28 51h8"/><path fill="#cffafe" stroke="#164e63" d="M22 18h20v27H22z"/></svg>',
  perfume: '<svg viewBox="0 0 64 64" role="img"><path fill="#fda4af" stroke="#881337" d="M25 8h14v10H25z"/><path fill="#fb7185" stroke="#881337" d="M22 18h20l6 9v27H16V27l6-9Z"/><path fill="none" stroke="#ffe4e6" d="M23 35h18"/><path fill="none" stroke="#ffe4e6" d="M25 44h14"/></svg>',
  other: '<svg viewBox="0 0 64 64" role="img"><path fill="#c084fc" stroke="#581c87" d="M12 24h40v30H12z"/><path fill="none" stroke="#581c87" d="M32 24v30"/><path fill="#fde68a" stroke="#581c87" d="M10 17h44v8H10z"/><path fill="none" stroke="#581c87" d="M22 17c-4-7 7-11 10 0 3-11 14-7 10 0"/></svg>',
};

function renderCategoryIcon(cat, prefix = "", { wrapperClass = "category-icon", ariaHidden = false } = {}) {
  const p = rel(prefix);
  const aria = ariaHidden ? ' aria-hidden="true"' : "";
  if (categoryVectorIcons[cat.slug]) {
    return `<span class="${wrapperClass} category-vector-icon"${aria}>${categoryVectorIcons[cat.slug]}</span>`;
  }
  if (cat.iconImg) {
    return `<span class="${wrapperClass} category-icon-img"${aria}><img src="${p}images/${cat.iconImg}" alt="" width="32" height="32"></span>`;
  }
  return `<span class="${wrapperClass}"${aria}>${cat.icon}</span>`;
}

function homeCategoryGrid(prefix = "") {
  const p = rel(prefix);
  const cards = homeCategoryGridOrder
    .map(([slug, label]) => {
      const cat = allCategories.find((c) => c.slug === slug);
      const iconHtml = cat
        ? renderCategoryIcon(cat, prefix, { wrapperClass: "category-sheet-icon", ariaHidden: true })
        : `<span class="category-sheet-icon" aria-hidden="true">OK</span>`;
      return `          <a href="${streetstyleCategoryUrl(slug)}" class="category-sheet-card"${externalCategoryAttrs()}>
            ${iconHtml}
            <span class="category-sheet-name">${label}</span>
          </a>`;
    })
    .join("\n");

  return `        <div class="category-sheet-grid">
${cards}
        </div>`;
}

function categoryCards(prefix = "", linkTarget = "streetstyle") {
  const p = rel(prefix);
  const cats = linkTarget === "main" ? mainCategories.filter((c) => !c.isGroup) : allCategories;

  return cats
    .map((c) => {
      const href =
        linkTarget === "affiliate"
          ? AFFILIATE
          : linkTarget === "local"
            ? `${p}categories/${c.slug}.html`
            : streetstyleCategoryUrl(c.slug);
      const ext =
        linkTarget === "affiliate" || linkTarget === "streetstyle" ? externalCategoryAttrs() : "";
      return `          <a href="${href}" class="category-card"${ext}>
            ${renderCategoryIcon(c, prefix)}
            <span class="category-name">${c.name}</span>
          </a>`;
    })
    .join("\n");
}

function declarationGuideImage(prefix = "", imgClass = "guide-hero-img") {
  const p = rel(prefix);
  return `<figure class="guide-image-wrap">
    <div class="guide-image-photo">
      <img src="${p}images/guides/declaration.png" alt="How to declare on OopBuy and avoid customs seizure  - oopbuy spreadsheet" class="${imgClass}" width="288" height="170" loading="lazy">
      <div class="guide-image-desk-label" aria-hidden="true">
        <span>How to Declare<br>on OopBuy</span>
        <span>Important: Avoid Seizure</span>
      </div>
    </div>
  </figure>`;
}

function shippingGuideImage(prefix = "", imgClass = "guide-hero-img") {
  const p = rel(prefix);
  return `<figure class="guide-image-wrap guide-image-wrap--shipping">
    <div class="guide-image-photo">
      <img src="${p}images/guides/shipping.png" alt="Choose the correct shipping company and route on OopBuy  - oopbuy spreadsheet" class="${imgClass}" width="288" height="170" loading="lazy">
      <div class="guide-image-shipping-label" aria-hidden="true">
        <span>Which Shipping Company<br>to Choose on OopBuy</span>
        <span>Choose the Correct Shipping Route</span>
      </div>
    </div>
  </figure>`;
}

function whatIsOopbuyGuideImage(prefix = "", imgClass = "guide-hero-img") {
  const p = rel(prefix);
  return `<figure class="guide-image-wrap guide-image-wrap--oopbuy">
    <div class="guide-image-photo">
      <img src="${p}images/guides/what-is-oopbuy.png" alt="What is OopBuy shopping agent  - oopbuy spreadsheet" class="${imgClass}" width="288" height="170" loading="lazy">
      <div class="guide-image-oopbuy-label" aria-hidden="true">
        <span>oop</span>
      </div>
    </div>
  </figure>`;
}

function couponsGuideImage(prefix = "", imgClass = "guide-hero-img") {
  const p = rel(prefix);
  return `<figure class="guide-image-wrap guide-image-wrap--coupons">
    <div class="guide-image-photo">
      <img src="${p}images/guides/coupons.png" alt="How to get coupons on OopBuy  - oopbuy spreadsheet" class="${imgClass}" width="288" height="170" loading="lazy">
      <div class="guide-image-coupons-label" aria-hidden="true">
        <span>How to Get<br>Coupons</span>
      </div>
    </div>
  </figure>`;
}

function guideCardVisual(g, prefix = "") {
  if (g.slug === "declaration") {
    return declarationGuideImage(prefix, "guide-card-img");
  }
  if (g.slug === "shipping") {
    return shippingGuideImage(prefix, "guide-card-img");
  }
  if (g.slug === "what-is-oopbuy") {
    return whatIsOopbuyGuideImage(prefix, "guide-card-img");
  }
  if (g.slug === "coupons") {
    return couponsGuideImage(prefix, "guide-card-img");
  }
  return `<span class="guide-icon">${g.icon}</span>`;
}

function guideHeroVisual(g, prefix = "") {
  if (g.slug === "declaration") {
    return declarationGuideImage(prefix, "guide-hero-img");
  }
  if (g.slug === "shipping") {
    return shippingGuideImage(prefix, "guide-hero-img");
  }
  if (g.slug === "what-is-oopbuy") {
    return whatIsOopbuyGuideImage(prefix, "guide-hero-img");
  }
  if (g.slug === "coupons") {
    return couponsGuideImage(prefix, "guide-hero-img");
  }
  return `<span class="page-hero-icon">${g.icon}</span>`;
}

function guideCards(prefix = "", slugs = homeGuideSlugs) {
  const p = rel(prefix);
  return slugs
    .map((slug) => guides.find((g) => g.slug === slug))
    .filter(Boolean)
    .map(
      (g) => `          <a href="${p}guides/${g.slug}.html" class="guide-card${g.slug === "declaration" ? " guide-card--featured" : ""}">
            ${guideCardVisual(g, prefix)}
            ${homeGuideDetails[g.slug] ? `<span class="guide-card-kicker">${homeGuideDetails[g.slug].kicker}</span>` : ""}
            <h3>${g.title}</h3>
            <p>${homeGuideDetails[g.slug]?.excerpt || g.excerpt}</p>
            <span class="text-link">Read more -&gt;</span>
          </a>`
    )
    .join("\n");
}

function faqJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return `  <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function siteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: DOMAIN,
        description:
          "Browse a curated OopBuy Spreadsheet with curated finds from trusted sellers, updated daily.",
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: DOMAIN,
        email: EMAIL,
      },
    ],
  };
  return `  <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function breadcrumbJsonLd(items) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return `  <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function itemListJsonLd(products) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "OopBuy Spreadsheet Products",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: product.href || `${DOMAIN}/spreadsheet.html?category=${product.category}`,
    })),
  };
  return `  <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderProductCard(product) {
  const name = escapeHtml(product.name);
  const category = escapeHtml(product.category);
  const dataName = escapeHtml(product.name.toLowerCase());
  const href = escapeHtml(product.href || AFFILIATE);
  const meta = escapeHtml(product.meta || product.brand || "MaisonLooks product");
  const usdPrice = Number(product.price) / CNY_PER_USD;
  return `          <a href="${href}" class="product-card" target="_blank" rel="noopener noreferrer" data-name="${dataName}" data-category="${category}">
            <img src="${product.image}" alt="${name} - OopBuy Spreadsheet" class="product-image" loading="lazy" width="400" height="400">
            <div class="product-body">
              <div class="product-options">${meta}</div>
              <h3 class="product-name">${name}</h3>
              <div class="product-price">$${usdPrice.toFixed(2)}</div>
            </div>
          </a>`;
}

function renderProductGrid(products) {
  return products.map((product) => renderProductCard(product)).join("\n");
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

const root = __dirname;
const productCountLabel = `${oopbuyProducts.length}+`;
const priceValues = oopbuyProducts.map((p) => Number(p.price)).filter((price) => Number.isFinite(price) && price > 0);
const productPriceMinUsd = Math.min(...priceValues) / CNY_PER_USD;
const productPriceMaxUsd = Math.max(...priceValues) / CNY_PER_USD;
const qcCategoryCounts = allCategories
  .map((cat) => ({
    ...cat,
    count: oopbuyProducts.filter((product) => product.category === cat.slug).length,
  }))
  .filter((cat) => cat.count > 0)
  .sort((a, b) => b.count - a.count);
const qcSourceLinks = [
  {
    label: "OopBuy product detail page",
    href: "https://oopbuy.com/pages/goods/details?channel=1688&id=812613580913",
    note: "Used for the official OopBuy buying-flow and warehouse/QC context.",
  },
  {
    label: "OopBuy homepage",
    href: "https://oopbuy.com/",
    note: "Used for public platform service positioning, support, and agent workflow context.",
  },
  {
    label: "MaisonLooks StreetStyle products",
    href: VIEW_PRODUCTS_URL,
    note: `Used for this site's ${productCountLabel} product sample and category coverage.`,
  },
  {
    label: "OopBuy QC photos guide",
    href: "guides/qc-photos.html",
    note: "Used as the existing site reference for shopper-side QC review steps.",
  },
];
const oopbuyQcFacts = [
  { value: "90 days", label: "Free warehouse storage advertised on OopBuy product pages" },
  { value: "CNY 1", label: "Optional custom photo service price shown on OopBuy product pages" },
];

/* ========== INDEX ========== */
writeFile(
  path.join(root, "index.html"),
  `${head(
    "OopBuy Spreadsheet 2026  - Best Finds & Trusted Sellers",
    `Browse a curated OopBuy Spreadsheet with ${productCountLabel} high quality finds from MaisonLooks StreetStyle. Updated daily with shoes, clothing, bags, accessories and more.`,
    "/",
    "",
    `${siteJsonLd()}\n${faqJsonLd()}`
  )}
${heroShell(`${nav("home")}
    <section class="hero">
      <div class="container hero-inner">
        <p class="hero-badge">Updated Daily - 2026</p>
        <h1>Best OopBuy<br><span class="hero-title-accent">Spreadsheet</span></h1>
        <p class="hero-desc">
          Browse a curated <strong>OopBuy Spreadsheet</strong> with ${productCountLabel} high quality finds from MaisonLooks StreetStyle.
          Updated daily with the best OopBuy products  - shoes, clothing, accessories and more.
        </p>
        <form class="hero-search-form" action="https://streetstyle.maisonlooks.com/en/search" method="get" target="_blank" rel="noopener noreferrer">
          <input type="search" name="q" class="hero-search-input" placeholder="Search products..." aria-label="Search products on StreetStyle">
          <button type="submit" class="btn btn-primary hero-search-btn">Search</button>
        </form>
        <div class="hero-stats">
          <div class="hero-stat"><span class="hero-stat-num hero-stat-num--count" data-target="${oopbuyProducts.length}" data-format="number">0+</span><span class="hero-stat-label">Products</span></div>
          <div class="hero-stat"><span class="hero-stat-num">Daily</span><span class="hero-stat-label">Updated</span></div>
          <div class="hero-stat"><span class="hero-stat-num hero-stat-num--count" data-target="200" data-format="k">0k+</span><span class="hero-stat-label">Shoppers</span></div>
        </div>
        <div class="trust-badges">
          <span class="trust-badge"><span class="trust-badge-icon" aria-hidden="true">OK</span>Verified sellers only</span>
          <span class="trust-badge"><span class="trust-badge-icon" aria-hidden="true">OK</span>QC photos reviewed</span>
          <span class="trust-badge"><span class="trust-badge-icon" aria-hidden="true">OK</span>Daily updates</span>
          <span class="trust-badge"><span class="trust-badge-icon" aria-hidden="true">OK</span>Free to browse</span>
        </div>
      </div>
    </section>`)}
  <main>
    <section class="section categories categories--home-sheet">
      <div class="container">
        <h2 class="section-title">Browse Categories</h2>
${homeCategoryGrid()}
      </div>
    </section>

    <section class="section cta">
      <div class="container cta-inner">
        <h2>Ready to find the best deals?</h2>
        <p>Browse ${productCountLabel} curated products from MaisonLooks StreetStyle. Free to use, updated daily.</p>
        <div class="cta-actions">
          <a href="spreadsheet.html" class="btn btn-primary btn-lg">Browse Spreadsheet</a>
          <a href="${STREETSTYLE_HOME}" class="btn btn-secondary btn-lg" target="_blank" rel="noopener noreferrer">Browse StreetStyle</a>
        </div>
      </div>
    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <section class="section guides-preview">
      <div class="container">
        <h2 class="section-title">Latest Guides</h2>
        <p class="section-subtitle">Step-by-step tutorials to help you shop smarter on OopBuy.</p>
        <div class="guide-grid">
${guideCards()}
        </div>
        <div class="section-action">
          <a href="guides.html" class="btn btn-secondary">View All Guides -&gt;</a>
        </div>
      </div>
    </section>

${signupCta()}
${aboutSeoBlock()}
${faqSection()}
  </main>
${footer()}${pageEnd()}`
);

/* ========== SPREADSHEET ========== */
writeFile(
  path.join(root, "spreadsheet.html"),
  `${head(
    `OopBuy Spreadsheet 2026 - Browse ${productCountLabel} Best Finds`,
    `Browse curated OopBuy finds online. ${productCountLabel} MaisonLooks StreetStyle products with search, filters, images, source links, QC photos, and shipping checklist notes.`,
    "/spreadsheet.html",
    "",
    `${siteJsonLd()}\n${itemListJsonLd(oopbuyProducts)}`
  )}
${heroShell(`${nav("spreadsheet")}
    <section class="page-hero page-hero-compact">
      <div class="container">
        <h1>Browse the Curated OopBuy Spreadsheet 2026</h1>
        <p class="page-hero-desc">Over ${oopbuyProducts.length} featured MaisonLooks StreetStyle products with real images, prices, and source links. Search and filter OopBuy finds before checking QC photos and planning shipping.</p>
      </div>
    </section>`)}
  <main>
    <section class="section spreadsheet-section">
      <div class="container">
        <div class="spreadsheet-toolbar">
          <input type="search" id="productSearch" class="search-input" placeholder="Search products..." aria-label="Search products">
          <select id="categoryFilter" class="filter-select" aria-label="Filter by category">
            <option value="">All Categories</option>
            ${allCategories.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("\n            ")}
          </select>
          <select id="sortFilter" class="filter-select" aria-label="Sort products">
            <option value="default">Default Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
        <p class="results-count" id="resultsCount">Showing ${oopbuyProducts.length} product${oopbuyProducts.length !== 1 ? "s" : ""}</p>
        <div class="product-grid" id="productGrid">
${renderProductGrid(oopbuyProducts)}
        </div>
        <div class="empty-state" id="emptyState" hidden>
          <p>No products match your search. Try a different keyword or category.</p>
        </div>
      </div>
    </section>

    <section class="section cta">
      <div class="container cta-inner">
        <h2>Can't find what you need?</h2>
        <p>Send us the product name or reference image and we can review it for a future OopBuy Spreadsheet update.</p>
        <a href="mailto:${EMAIL}" class="btn btn-primary btn-lg">Contact Us</a>
      </div>
    </section>
    <section class="section">
      <div class="container content-block">
${seoClosingBlock("spreadsheet")}
      </div>
    </section>
  </main>
${footer()}${pageEnd("", "", '\n  <script src="products.js"></script>')}`
);

/* ========== CATEGORIES INDEX ========== */
writeFile(
  path.join(root, "categories.html"),
  `${head(
    "All Categories | OopBuy Spreadsheet",
    "Browse all OopBuy Spreadsheet categories  - sneakers, clothing, bags, electronics, and more from trusted sellers.",
    "/categories.html",
    "",
    breadcrumbJsonLd([
      { name: "Home", url: `${DOMAIN}/` },
      { name: "Categories", url: `${DOMAIN}/categories.html` },
    ])
  )}
${heroShell(`${nav("categories")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / Categories</p>
        <h1>All Categories</h1>
        <p class="page-hero-desc">Browse every category in the OopBuy Spreadsheet. Each section includes verified links from trusted OopBuy sellers.</p>
      </div>
    </section>`)}
  <main>
    <section class="section categories" id="clothing">
      <div class="container">
        <h2 class="section-title">Clothing</h2>
        <div class="category-grid">
${clothingSlugs.map((slug) => {
  const c = allCategories.find((x) => x.slug === slug);
  return `          <a href="${streetstyleCategoryUrl(c.slug)}" class="category-card"${externalCategoryAttrs()}>
            ${renderCategoryIcon(c)}
            <span class="category-name">${c.name}</span>
          </a>`;
}).join("\n")}
        </div>
      </div>
    </section>
    <section class="section categories">
      <div class="container">
        <h2 class="section-title">All Product Categories</h2>
        <div class="category-grid">
${categoryCards()}
        </div>
      </div>
    </section>
    <section class="section cta">
      <div class="container cta-inner">
        <h2>Browse the Full Spreadsheet</h2>
        <p>Search and filter ${productCountLabel} products from MaisonLooks StreetStyle with real images, prices, and product links.</p>
        <a href="spreadsheet.html" class="btn btn-primary btn-lg">Open Spreadsheet -&gt;</a>
      </div>
    </section>
  </main>
${footer()}${pageEnd()}`
);

/* ========== GUIDES INDEX ========== */
writeFile(
  path.join(root, "guides.html"),
  `${head(
    "OopBuy Guides | How to Buy, Ship & Save",
    "Complete OopBuy guides  - how to buy, shipping, customs declaration, QC photos, and coupons for the OopBuy Spreadsheet.",
    "/guides.html",
    "",
    breadcrumbJsonLd([
      { name: "Home", url: `${DOMAIN}/` },
      { name: "Guides", url: `${DOMAIN}/guides.html` },
    ])
  )}
${heroShell(`${nav("guides")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / Guides</p>
        <h1>OopBuy Guides</h1>
        <p class="page-hero-desc">OopBuy Spreadsheet guides for finding OopBuy finds, checking source links, reviewing QC photos, and using a shipping checklist before delivery.</p>
      </div>
    </section>`)}
  <main>
    <section class="section guides-preview">
      <div class="container">
        <div class="guide-grid">
${guides.map((g) => `          <a href="guides/${g.slug}.html" class="guide-card${g.slug === "declaration" ? " guide-card--featured" : ""}">
            ${guideCardVisual(g)}
            <h3>${g.title}</h3>
            <p>${g.excerpt}</p>
            <span class="text-link">Read more -&gt;</span>
          </a>`).join("\n")}
        </div>
      </div>
    </section>
${signupCta()}
  </main>
${footer()}${pageEnd()}`
);

/* ========== INDIVIDUAL GUIDES ========== */
const guideContent = {
  "how-to-buy": {
    title: "How to Buy on OopBuy",
    sections: [
      { h: "Step 1: Find a Product Link", p: "Start from the OopBuy Spreadsheet or another trusted marketplace source. Open the item you want, review the seller, price, photos, size chart, and recent feedback, then copy the original product link if you are not already on OopBuy." },
      { h: "Step 2: Paste the Link into OopBuy", p: "Paste the Taobao, Weidian, 1688, or other supported product link into the OopBuy search bar. OopBuy will load the item page so you can choose the correct color, size, version, quantity, and any seller notes before adding it to your cart." },
      { h: "Step 3: Submit and Pay for the Item Order", p: "Check the product options carefully, then submit the order and pay the item cost plus any domestic shipping shown by the seller. After payment, the order normally moves through statuses such as processing, purchased, seller shipped, and warehouse received." },
      { h: "Step 4: Wait for Warehouse Arrival", p: "OopBuy purchases from the seller on your behalf and receives the product at its warehouse. Domestic delivery time depends on the seller and local courier, so do not submit an international parcel until the item is marked as received and the warehouse photos are available." },
      { h: "Step 5: Review QC Photos", p: "After warehouse arrival, check the QC photos for color, size tag, logo placement, stitching, defects, stains, missing parts, and packaging condition. If something is wrong, request a return or exchange before the item is packed for international shipping." },
      { h: "Step 6: Submit Your Parcel", p: "When all items are ready, select the products you want to ship together, confirm your address, choose packaging options, and compare shipping lines. Pay attention to route restrictions, estimated delivery time, volumetric weight, insurance, and whether the route is suitable for your item type." },
      { h: "Step 7: Declare and Pay International Shipping", p: "Enter a simple, realistic customs declaration that matches the parcel contents, then apply any available coupons before paying international shipping. New users should also check their OopBuy coupon wallet before checkout so eligible shipping discounts are not missed." },
      { h: "Step 8: Track Delivery and Handle After-Sales", p: "After dispatch, follow the tracking updates from OopBuy and the destination carrier. Tracking can pause during export, airline handoff, or customs. If a parcel is delayed, returned, damaged, or missing items, contact OopBuy support with the order number, parcel number, QC photos, and tracking details." },
    ],
  },
  shipping: {
    title: "OopBuy Shipping Guide",
    sections: [
      { h: "OopBuy Shipping Basics", p: "After your items arrive at the OopBuy warehouse, you can combine them into one parcel and choose an international shipping line. The best option depends on your destination country, parcel weight, item type, delivery expectations, and budget." },
      { h: "Why Tracking May Not Update", p: "Tracking can stay quiet for several days after a parcel is marked as shipped. This usually happens while the parcel is waiting for carrier scanning, export processing, airline handoff, or customs movement. Check again periodically instead of resubmitting the same question right away." },
      { h: "When Customs Causes Delays", p: "If a parcel reaches domestic customs and stops updating, it may simply be waiting for inspection. Returned parcels usually involve sensitive goods, route restrictions, declaration problems, or local import checks. Choosing the right route and declaration reduces this risk." },
      { h: "Recommended Routes by Region", p: "For the UK, Royal Mail-style or UK tax-friendly routes are usually practical. For many EU countries, tariff-free DHL-style lines are often preferred. USA buyers often choose stable air routes, while Australia and New Zealand buyers commonly compare EMS-style options. For Asia and the Middle East, prioritize routes with insurance and clear declaration rules." },
      { h: "How to Lower Shipping Cost", p: "Consolidate items into one parcel when possible, remove unnecessary packaging, compare actual and volumetric weight, and avoid oversized boxes. Heavy shoes, jackets, and boxed accessories can increase shipping cost quickly, so plan your haul before submitting." },
      { h: "Final Shipping Checklist", p: "Before paying for shipping, review QC photos, confirm your address, check route restrictions, choose a realistic declaration, and decide whether insurance is worth it. A little preparation before submission can prevent most shipping problems later." },
    ],
  },
  declaration: {
    title: "How to Declare on OopBuy",
    sections: [
      { h: "What is Declaration?", p: "Declaration is the parcel information used by customs to understand what you are importing and what value you are declaring. A clear declaration helps customs process your package and lowers the chance of avoidable delays." },
      { h: "Why Accurate Declaration Matters", p: "A declaration that looks unrealistic can create problems. Very low values on large parcels, branded item descriptions, or mismatched quantities may increase inspection risk. The goal is to keep the declaration simple, believable, and consistent with the parcel." },
      { h: "Country Rules Are Different", p: "Declaration expectations vary by country. Some regions have higher tax thresholds, while others inspect certain item types more closely. Before shipping, check your local import rules and choose a shipping line that matches your country." },
      { h: "Simple Item Names Work Best", p: "Use broad item names such as shoes, hoodie, pants, jacket, bag, accessories, or electronics. Avoid unnecessary brand names or detailed product descriptions unless the shipping line specifically requires more detail." },
      { h: "Extra Declaration Tips", p: "If your parcel is close to a local tax threshold, avoid declaring right at the limit. Watches and sensitive accessories are often better shipped separately. Large mixed hauls should be split when the value, weight, or item mix looks risky." },
      { h: "Before You Submit", p: "Check parcel weight, item categories, destination rules, and the shipping route before confirming. A good declaration will not guarantee customs clearance, but it gives your parcel a cleaner and more consistent profile." },
    ],
  },
  "qc-photos": {
    title: "QC Photos Guide",
    sections: [
      { h: "What are QC Photos?", p: "Quality Control photos are taken at the OopBuy warehouse when your items arrive. They show the actual product you received  - use them to verify quality before shipping." },
      { h: "How to Review QC", p: "Check stitching, logos, colors, and overall build quality against reference photos. Compare with QC photos in our OopBuy Spreadsheet listings." },
      { h: "Exchange or Return", p: "If QC reveals issues, request an exchange or return through OopBuy before submitting your international shipment. Act quickly  - warehouse storage has time limits." },
    ],
  },
  coupons: {
    title: "All About OopBuy Coupons",
    sections: [
      { h: "What is an OopBuy Coupon?", p: "An OopBuy coupon is a discount you can apply to eligible purchases, service fees, or shipping payments depending on the coupon type. Some coupons reduce a fixed amount, while others work only after a minimum spend." },
      { h: "Where to Find Coupons", p: "Coupons usually appear in the wallet or coupon area of your OopBuy account. New users may receive a bundle after registration, and active promotions can also appear during seasonal campaigns or on our Deals page." },
      { h: "How to Get New Coupons", p: "The easiest way to start is by creating an OopBuy account through the invite link and checking your coupon wallet after signup. For later orders, review active promotions before you pay for products or submit international shipping." },
      { h: "Coupon Terms and Expiration", p: "Always check expiration dates, minimum spend, eligible order type, and whether the coupon applies to product payment or shipping. If a coupon does not appear at checkout, the order probably does not meet one of those requirements." },
      { h: "How to Use Coupons Effectively", p: "Save larger shipping coupons for bigger parcels, use product coupons when the minimum spend is already met, and avoid splitting orders in a way that makes you lose eligibility. Planning the order around coupon rules can produce better savings." },
      { h: "Before You Checkout", p: "Review your available coupon list, compare route prices, and check the final total before paying. A coupon is only useful when it actually lowers the complete cost of the haul, not just one line item." },
    ],
  },
  "what-is-oopbuy": {
    title: "What is OopBuy?",
    sections: [
      { h: "Understanding OopBuy", p: "OopBuy is a shopping agent that helps international buyers purchase products from Chinese sellers and marketplaces. Instead of dealing with each seller directly, you order through OopBuy and let the agent handle payment, warehouse receiving, inspection, and international shipping." },
      { h: "Does OopBuy Sell Products Directly?", p: "OopBuy mainly works as an intermediary. It helps you buy from sellers on platforms such as Taobao, Weidian, 1688, and similar marketplaces, then stores the items in a warehouse until you are ready to ship them." },
      { h: "What Can You Order?", p: "Most shoppers use OopBuy for clothing, sneakers, bags, accessories, electronics, and other Chinese marketplace finds. Product quality still depends on the seller, so checking listings and QC photos remains important." },
      { h: "How the Order Process Works", p: "You paste or open a product link, choose item options, pay through OopBuy, and wait for the seller to ship to the warehouse. Once the item arrives, OopBuy takes QC photos so you can inspect it before international shipping." },
      { h: "Why the Spreadsheet Helps", p: "The OopBuy Spreadsheet saves time by organizing popular finds and trusted seller links into clear categories. It helps beginners avoid random searching and gives experienced buyers a faster way to compare products." },
      { h: "Why Buyers Choose OopBuy", p: "OopBuy is useful for buyers who want QC photos, parcel consolidation, multiple shipping lines, coupon opportunities, and a more guided buying process. It is especially helpful when you are building a haul from several different sellers." },
    ],
  },
};

for (const [slug, content] of Object.entries(guideContent)) {
  const guide = guides.find((g) => g.slug === slug);
  writeFile(
    path.join(root, "guides", `${slug}.html`),
    `${head(
      `${content.title} | OopBuy Spreadsheet Guide`,
      `${guide.excerpt}`,
      `/guides/${slug}.html`,
      "../",
      breadcrumbJsonLd([
        { name: "Home", url: `${DOMAIN}/` },
        { name: "Guides", url: `${DOMAIN}/guides.html` },
        { name: content.title, url: `${DOMAIN}/guides/${slug}.html` },
      ])
    )}
${heroShell(`${nav(`guide-${slug}`, "../")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor("../")} / <a href="../guides.html">Guides</a> / ${content.title}</p>
        ${guideHeroVisual(guide, "../")}
        <h1>${content.title}</h1>
        <p class="page-hero-desc">${guide.excerpt}</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container content-block">
${content.sections.map((s) => `        <h2>${s.h}</h2>\n        <p>${s.p}</p>`).join("\n\n")}
${seoClosingBlock(slug, "../")}
        ${homeBtn("../")}
      </div>
    </section>
${signupCta().replace(/    /g, "")}
  </main>
${footer("../")}${pageEnd("../")}`
  );
}

/* ========== COMPARE PAGES ========== */
writeFile(
  path.join(root, "compare.html"),
  `${head(
    "Compare Shopping Agents | OopBuy Spreadsheet",
    "Compare OopBuy vs KakoBuy, LitBuy, Hipobuy, CNFans, AcBuy, Joyagoo, MuleBuy, and USFans with source links and practical buying notes.",
    "/compare.html"
  )}
${heroShell(`${nav("compare")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / Compare</p>
        <h1>Compare Shopping Agents</h1>
        <p class="page-hero-desc">A dedicated compare route modeled after the reference compare page, with each comparison module linked to its corresponding source article.</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container">
        <p class="section-label">Compare Route</p>
        <h2 class="section-title section-title-left">OopBuy Agent Comparisons</h2>
        <div class="compare-grid">
${comparisons.map((c) => `          <article class="compare-card">
            <h3>${c.title}</h3>
            <p>${c.summary}</p>
            <p>${c.sourceAngle}</p>
            <div class="compare-card-actions">
              <a href="compare/vs-${c.slug}.html" class="text-link">Read our comparison -&gt;</a>
              <a href="${c.sourceHref}" class="text-link" target="_blank" rel="noopener noreferrer">Source article</a>
            </div>
          </article>`).join("\n")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container content-block">
        <h2>Source Links Captured From the Reference Compare Page</h2>
        <p>The reference route at <a href="https://oopbuy-spreadsheet.com/compare" class="text-link" target="_blank" rel="noopener noreferrer">oopbuy-spreadsheet.com/compare</a> exposes these comparison modules. The links below are retained for audit and future content refreshes.</p>
        <ul class="check-list">
          ${comparisons.map((c) => `<li><a href="${c.sourceHref}" class="text-link" target="_blank" rel="noopener noreferrer">${c.title}</a> - ${c.summary}</li>`).join("\n          ")}
        </ul>
${seoClosingBlock("compare")}
      </div>
    </section>
  </main>
${footer()}${pageEnd()}`
);

for (const comp of comparisons) {
  writeFile(
    path.join(root, "compare", `vs-${comp.slug}.html`),
    `${head(
      `${comp.title} | OopBuy Spreadsheet`,
      `${comp.title} - comparison of fees, shipping, QC photos, support, trust signals, source links, and platform workflow with the source article linked for reference.`,
      `/compare/vs-${comp.slug}.html`,
      "../"
    )}
${heroShell(`${nav(`compare-${comp.slug}`, "../")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor("../")} / <a href="../compare.html">Compare</a> / ${comp.title}</p>
        <h1>${comp.title}</h1>
        <p class="page-hero-desc">A researched comparison module with source links, QC photos notes, shipping checklist context, and the corresponding reference article link captured from oopbuy-spreadsheet.com.</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container content-block">
        <h2>Reference Article</h2>
        <p>Source captured from the reference compare page: <a href="${comp.sourceHref}" class="text-link" target="_blank" rel="noopener noreferrer">${comp.title}</a>.</p>
        <p>${comp.sourceAngle}</p>
        <h2>Quick Comparison</h2>
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead><tr><th>Feature</th><th>OopBuy</th><th>${comp.name}</th></tr></thead>
            <tbody>
              <tr><td>Shipping Rates</td><td>Competitive, multiple lines</td><td>Varies by region</td></tr>
              <tr><td>QC Photos</td><td>Free, detailed</td><td>Available</td></tr>
              <tr><td>PayPal Support</td><td>Yes</td><td>Varies</td></tr>
              <tr><td>New User Coupons</td><td>CNY 3,000 bundle + 15% shipping</td><td>Varies</td></tr>
              <tr><td>Interface</td><td>Modern, mobile-friendly</td><td>Standard</td></tr>
              <tr><td>Customer Service</td><td>Responsive</td><td>Varies</td></tr>
            </tbody>
          </table>
        </div>
        <h2>What to Check Before Choosing</h2>
        <p>Use the source article and live source links as a topic map, then verify the platform details before placing an order. For ${comp.name}, the main areas to compare are: ${comp.summary.toLowerCase()}</p>
        <ul class="check-list">
          <li>Check current service fees and whether any coupon or shipping discount changes the total cost</li>
          <li>Compare shipping-line availability for your destination, not just headline prices</li>
          <li>Review QC photo detail, warehouse processing speed, and return or exchange rules before shipping</li>
          <li>Confirm payment methods, support response channels, and dispute handling for expensive parcels</li>
        </ul>
        <h2>Why We Recommend OopBuy</h2>
        <p>For most international buyers using an <strong>OopBuy Spreadsheet</strong>, OopBuy offers the best balance of shipping cost, QC quality, and ease of use. Combined with our curated spreadsheet of ${productCountLabel} sourced finds, you get a smoother shopping experience from discovery to delivery.</p>
        <p>That said, ${comp.name} may suit specific use cases. We encourage comparing both before committing  - and browsing our OopBuy Spreadsheet regardless of which agent you choose.</p>
${seoClosingBlock("compare", "../")}
        <div class="hero-actions" style="margin-top:24px">
          <a href="${AFFILIATE}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Try OopBuy Free -&gt;</a>
          <a href="../spreadsheet.html" class="btn btn-secondary">Browse Spreadsheet</a>
          <a href="${comp.sourceHref}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Open Source Article</a>
        </div>
      </div>
    </section>
  </main>
${footer("../")}${pageEnd("../")}`
  );
}

/* ========== QC ========== */
writeFile(
  path.join(root, "qc.html"),
  `${head(
    "OopBuy QC Navigation | QC Photos, Warehouse Checks & Product Review",
    `Use this OopBuy QC navigation page to review warehouse QC photos, category checklists, and ${productCountLabel} StreetStyle product data before shipping.`,
    "/qc.html",
    "",
    breadcrumbJsonLd([
      { name: "Home", url: `${DOMAIN}/` },
      { name: "QC", url: `${DOMAIN}/qc.html` },
    ])
  )}
${heroShell(`${nav("qc")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / QC</p>
        <h1>OopBuy QC Navigation</h1>
        <p class="page-hero-desc">A practical route for checking OopBuy warehouse photos, product details, and StreetStyle spreadsheet finds before you ship a haul.</p>
      </div>
    </section>`)}
  <main>
    <section class="section blog-feature">
      <div class="container blog-feature-grid">
        <article class="blog-feature-card">
          <span class="blog-tag">QC Workflow</span>
          <h2>Check the product before international shipping.</h2>
          <p>OopBuy works as a China shopping agent: the seller sends the item to the OopBuy warehouse first, then the buyer reviews warehouse QC photos before submitting an international parcel. This page turns that checkpoint into a route you can use while browsing the spreadsheet.</p>
          <a href="guides/qc-photos.html" class="btn btn-primary">Read QC Photos Guide</a>
        </article>
        <aside class="blog-side-panel">
          <h3>QC Data Snapshot</h3>
          <a href="${VIEW_PRODUCTS_URL}"${externalCategoryAttrs()}>${productCountLabel} StreetStyle products used on this site</a>
          <a href="${streetstyleCategoryUrl(qcCategoryCounts[0].slug)}"${externalCategoryAttrs()}>Largest sampled category: ${qcCategoryCounts[0].name} (${qcCategoryCounts[0].count} products)</a>
          <a href="${AFFILIATE}" target="_blank" rel="noopener noreferrer">OopBuy advertises warehouse QC as part of the agent workflow</a>
          <a href="spreadsheet.html">Spreadsheet prices shown in USD from CNY source data</a>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="section-label">QC Numbers</p>
        <h2 class="section-title section-title-left">Facts Used for This QC Route</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-number">${productCountLabel}</span>
            <span class="stat-label">Products currently rendered from MaisonLooks StreetStyle data</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">${qcCategoryCounts.length}</span>
            <span class="stat-label">Product categories with active sampled items</span>
          </div>
          ${oopbuyQcFacts.map((fact) => `<div class="stat-card">
            <span class="stat-number">${fact.value}</span>
            <span class="stat-label">${fact.label}</span>
          </div>`).join("\n          ")}
          <div class="stat-card">
            <span class="stat-number">$${productPriceMinUsd.toFixed(2)}</span>
            <span class="stat-label">Lowest sampled product price after USD conversion</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">$${productPriceMaxUsd.toFixed(2)}</span>
            <span class="stat-label">Highest sampled product price after USD conversion</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container content-block">
        <h2>How to Use QC Before Shipping</h2>
        <p>Start with the live product page, then compare it against warehouse photos after the item arrives. For apparel and footwear, the QC pass should focus on shape, color, labels, stitching, size tags, visible defects, and whether the item matches the option you selected.</p>
        <p>OopBuy's agent model is useful because international shipping happens after the warehouse step. That gives you a checkpoint to reject a bad item, request a return or exchange where possible, or ask for clearer photos before building a parcel.</p>
        <ul class="check-list">
          <li>Confirm product name, color, size, material notes, seller source, and source price before purchase</li>
          <li>After warehouse arrival, compare QC photos against the seller images and selected options</li>
          <li>For expensive items, request clearer angle photos before submitting the parcel</li>
          <li>Do not ship until the visible flaws, sizing risk, and parcel value declaration are acceptable</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="section-label">Category QC</p>
        <h2 class="section-title section-title-left">QC Focus by Spreadsheet Category</h2>
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead><tr><th>Category</th><th>Sample Count</th><th>QC Focus</th></tr></thead>
            <tbody>
              ${qcCategoryCounts.map((cat) => `<tr><td><a href="${streetstyleCategoryUrl(cat.slug)}" class="text-link" target="_blank" rel="noopener noreferrer">${cat.name}</a></td><td>${cat.count}</td><td>${cat.slug === "shoes" ? "Toe shape, sole texture, stitching, box label, color match, and size tag." : cat.slug === "bags" ? "Hardware color, zipper alignment, logo placement, strap stitching, and interior label." : cat.slug === "electronics" ? "Model number, accessory count, shell condition, ports, and package label." : cat.slug === "perfume" ? "Bottle shape, cap fit, label alignment, batch code visibility, and packaging condition." : cat.slug === "headwear" ? "Panel shape, embroidery, brim curve, inner tag, and color match." : cat.slug === "accessories" ? "Metal finish, engraving, clasp quality, length, and packaging details." : "Fabric color, print placement, tags, stitching, measurements, and visible defects."}</td></tr>`).join("\n              ")}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container content-block">
        <h2>Source Links and Audit Trail</h2>
        <p>This QC route is based on live platform checks plus this site's local StreetStyle product dataset. Treat all numbers as a publishing snapshot and recheck the source pages before making dated claims.</p>
        <ul class="check-list">
          ${qcSourceLinks.map((source) => `<li><a href="${source.href}" class="text-link" target="_blank" rel="noopener noreferrer">${source.label}</a> - ${source.note}</li>`).join("\n          ")}
        </ul>
${seoClosingBlock("qc")}
        <div class="hero-actions" style="margin-top:24px">
          <a href="spreadsheet.html" class="btn btn-primary">Browse Spreadsheet</a>
          <a href="${STREETSTYLE_HOME}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Browse StreetStyle</a>
        </div>
      </div>
    </section>
  </main>
${footer()}${pageEnd()}`
);

/* ========== DEALS, REVIEW, ABOUT, CONTACT ========== */
writeFile(
  path.join(root, "deals.html"),
  `${head(
    "OopBuy Deals & Coupons 2026 | OopBuy Spreadsheet",
    "Latest OopBuy coupon codes, deals, and promotions. Get CNY 3,000 coupon bundle + 15% off shipping for new users.",
    "/deals.html"
  )}
${heroShell(`${nav("deals")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / Deals</p>
        <h1>OopBuy Deals &amp; Coupons</h1>
        <p class="page-hero-desc">Active promotions and coupon codes for OopBuy shoppers.</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container">
        <div class="deals-grid">
          <article class="deal-card deal-card-featured">
            <span class="deal-badge">New User</span>
            <h3>CNY 3,000 Coupon Bundle</h3>
            <p>Sign up through our link and receive CNY 3,000 in coupons plus 15% off shipping on your first order.</p>
            <a href="${AFFILIATE}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Claim Now -&gt;</a>
          </article>
          <article class="deal-card">
            <span class="deal-badge">Shipping</span>
            <h3>15% Off First Shipment</h3>
            <p>New OopBuy accounts get 15% off their first international shipping payment.</p>
            <a href="${AFFILIATE}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Sign Up -&gt;</a>
          </article>
          <article class="deal-card">
            <span class="deal-badge">Daily</span>
            <h3>Spreadsheet Daily Updates</h3>
            <p>Our OopBuy Spreadsheet is updated daily with fresh finds and removed stale listings.</p>
            <a href="spreadsheet.html" class="btn btn-secondary">Browse Finds -&gt;</a>
          </article>
        </div>
      </div>
    </section>
${signupCta()}
  </main>
${footer()}${pageEnd()}`
);

writeFile(
  path.join(root, "blog.html"),
  `${head(
    "OopBuy Blog | Spreadsheet Tips, OopBuy Finds & Shipping",
    "Read researched OopBuy blog notes about OopBuy finds, source links, QC photos, shipping checklist steps, storage, categories, and shopping-agent workflow.",
    "/blog.html",
    "",
    breadcrumbJsonLd([
      { name: "Home", url: `${DOMAIN}/` },
      { name: "Blog", url: `${DOMAIN}/blog.html` },
    ])
  )}
${heroShell(`${nav("blog")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / Blog</p>
        <h1>OopBuy Blog</h1>
        <p class="page-hero-desc">Researched spreadsheet notes for OopBuy shoppers, using facts checked on OopBuy and MaisonLooks rather than generic product-roundup copy.</p>
      </div>
    </section>`)}
  <main>
    <section class="section blog-feature">
      <div class="container blog-feature-grid">
        <article class="blog-feature-card">
          <span class="blog-tag">Featured</span>
          <h2>Complete OOPBUY Spreadsheet Guide and Finds Roundups</h2>
          <p>Use this blog as a compact, source-checked hub for how OopBuy buying works, which MaisonLooks categories are worth browsing, and what facts to verify before shipping a haul internationally.</p>
          <a href="guides/how-to-buy.html" class="btn btn-primary">Read Buying Guide</a>
        </article>
        <div class="blog-side-panel">
          <h3>Platform Facts Checked</h3>
          <a href="https://oopbuy.com" target="_blank" rel="noopener noreferrer">OopBuy lists QC, shipping estimate, 90-day storage, and 24/7 support</a>
          <a href="${VIEW_PRODUCTS_URL}"${externalCategoryAttrs()}>MaisonLooks official shop: 67,127 product results checked</a>
          <a href="${streetstyleCategoryUrl("accessories")}"${externalCategoryAttrs()}>Accessories category: 10,273 results checked</a>
          <a href="${streetstyleCategoryUrl("shoes")}"${externalCategoryAttrs()}>Shoes category includes Jordan, Air Force, Air Max, and Shox listings</a>
          <a href="https://oopbuy.com/product/1688/744161001154" target="_blank" rel="noopener noreferrer">OopBuy example links to a 1688 product source</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container content-block">
        <h2>Research Notes Used for These Articles</h2>
        <p>The blog copy is based on live platform checks. OopBuy presents itself as a proxy-shopping flow: buyers add a marketplace item, pay for the goods, wait for seller delivery to the OopBuy warehouse, review QC, and then submit the international shipment. Its product pages also advertise 90 days of free storage, international shipping estimates, and 24/7 customer support.</p>
        <p>For product discovery, the linked MaisonLooks official shop showed 67,127 total results when checked. The accessories category alone showed 10,273 results, while the shoes and clothing paths exposed the main browse structure used by this site's spreadsheet links.</p>
        <ul class="check-list">
          <li>Source platforms checked: OopBuy, MaisonLooks official shop, and MaisonLooks category pages</li>
          <li>Shopping sources referenced by OopBuy product pages include 1688, Taobao, and Weidian-style marketplace links</li>
          <li>Key buying checkpoints: live listing price, seller source, warehouse QC photos, storage time, shipping route, and declared parcel value</li>
          <li>Numbers are snapshots from the checked pages and should be rechecked before publishing dated claims</li>
        </ul>
      </div>
    </section>
    <section class="section blog-feature">
      <div class="container blog-feature-grid">
        <div class="blog-side-panel">
          <h3>Popular Topics</h3>
          <a href="${streetstyleCategoryUrl("jackets")}"${externalCategoryAttrs()}>Top jackets spreadsheet</a>
          <a href="${streetstyleCategoryUrl("shoes")}"${externalCategoryAttrs()}>Sneaker finds</a>
          <a href="${streetstyleCategoryUrl("accessories")}"${externalCategoryAttrs()}>Accessories finds</a>
          <a href="${streetstyleCategoryUrl("hoodies")}"${externalCategoryAttrs()}>Hoodies and sweaters</a>
          <a href="${streetstyleCategoryUrl("pants")}"${externalCategoryAttrs()}>Pants and shorts</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <p class="section-label">Blog Articles</p>
        <h2 class="section-title section-title-left">OopBuy Spreadsheet Guides and Product Finds</h2>
        <div class="blog-grid">
${blogPosts.map((post) => `          <article class="blog-card">
            <span class="blog-tag">${post.tag}</span>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="blog-card-footer">
              <span class="blog-meta">${post.readTime}</span>
              <a href="${post.href}" class="text-link"${post.external ? externalCategoryAttrs() : ""}>${post.cta}</a>
              ${post.referenceHref ? `<a href="${post.referenceHref}" class="text-link" target="_blank" rel="noopener noreferrer">${post.referenceCta}</a>` : ""}
            </div>
          </article>`).join("\n")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container content-block">
        <h2>What This Blog Covers</h2>
        <p>This blog is written for shoppers who use an <strong>OopBuy Spreadsheet</strong> as their starting point. It now mirrors the main reference topics: the complete spreadsheet guide, OopBuy finds, jacket finds, sneaker finds, accessories, hoodies and sweaters, plus pants and shorts.</p>
        <p>Use these articles together with our product categories, guide pages, and comparison pages. When a product looks promising, still review the source links, live options, size notes, seller history, QC photos, and shipping checklist before shipping internationally.</p>
        <ul class="check-list">
          <li>Spreadsheet browsing tips for jackets, sneakers, accessories, hoodies, sweaters, pants, and shorts</li>
          <li>Beginner-friendly explanations of OopBuy ordering and warehouse steps</li>
          <li>Shipping, declaration, and coupon notes for planning a full haul</li>
          <li>Independent advice for comparing OopBuy with other shopping agents</li>
        </ul>
      </div>
    </section>
    <section class="section">
      <div class="container content-block">
        <h2>Reference Blog Links Pulled From OopBuyList</h2>
        <p>The modules above also map to the corresponding article URLs found on the reference blog page. These links are used for topic coverage and SERP comparison, while the factual claims in this page are still checked against OopBuy and MaisonLooks platform pages.</p>
        <ul class="check-list">
          ${oopbuyListReferences.map((ref) => `<li><a href="${ref.href}" class="text-link" target="_blank" rel="noopener noreferrer">${ref.title}</a> - published ${ref.date}</li>`).join("\n          ")}
        </ul>
${seoClosingBlock("blog")}
      </div>
    </section>
${signupCta()}
  </main>
${footer()}${pageEnd()}`
);

writeFile(
  path.join(root, "review.html"),
  `${head(
    "OopBuy Review 2026 | Is OopBuy Legit?",
    "Honest OopBuy review covering shipping, QC photos, fees, customer service, and why we use OopBuy for our spreadsheet.",
    "/review.html"
  )}
${heroShell(`${nav("review")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / Review</p>
        <h1>OopBuy Review 2026</h1>
        <p class="page-hero-desc">An honest look at OopBuy  - shipping, QC, fees, and overall experience.</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container content-block">
        <h2>Overall Rating: Recommended</h2>
        <p>OopBuy is one of the most popular Chinese shopping agents among international streetwear and fashion buyers. After curating thousands of products for our <strong>OopBuy Spreadsheet</strong>, we've found OopBuy consistently delivers on QC quality, shipping options, and customer support.</p>
        <h2>Pros</h2>
        <ul class="check-list">
          <li>Competitive international shipping rates</li>
          <li>Free, detailed QC photos at warehouse</li>
          <li>PayPal and multiple payment methods</li>
          <li>Generous new-user coupon bundle (CNY 3,000 + 15% shipping)</li>
          <li>Clean, mobile-friendly interface</li>
          <li>Responsive customer service</li>
        </ul>
        <h2>Cons</h2>
        <ul class="check-list check-list-minus">
          <li>Shipping times vary by line and destination</li>
          <li>Warehouse storage has time limits</li>
          <li>Customs declaration requires user input</li>
        </ul>
        <h2>Verdict</h2>
        <p>For buyers using an OopBuy Spreadsheet, OopBuy is our top recommendation. Pair our curated ${productCountLabel} finds with OopBuy's reliable service for the best experience.</p>
        ${homeBtn()}
      </div>
    </section>
  </main>
${footer()}${pageEnd()}`
);

writeFile(
  path.join(root, "about.html"),
  `${head(
    "About Us | OopBuy Spreadsheet",
    "About our OopBuy Spreadsheet  - a curated product list for OopBuy shoppers, updated daily with trusted seller finds.",
    "/about.html"
  )}
${heroShell(`${nav("about")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / About</p>
        <h1>About Us</h1>
        <p class="page-hero-desc">We built this OopBuy Spreadsheet to make smart shopping easy.</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container content-block">
        <p>We're an independent group of long-time OopBuy users who maintain a browsable <strong>OopBuy Spreadsheet</strong> of vetted seller links. The goal is simple: cut down search time and steer you away from questionable listings.</p>
        <p>Each row is reviewed for seller history, price, and overall quality before it stays on the sheet. We refresh the list daily  - new picks go in, and weaker entries come out when they no longer hold up.</p>
        <p>This project is not owned or operated by OopBuy. It exists as a free reference to help shoppers discover products and get more comfortable using the platform.</p>
      </div>
    </section>
  </main>
${footer()}${pageEnd()}`
);

writeFile(
  path.join(root, "contact.html"),
  `${head(
    "Contact | OopBuy Spreadsheet",
    "Contact the OopBuy Spreadsheet team. Questions, product requests, or partnership inquiries.",
    "/contact.html"
  )}
${heroShell(`${nav("contact")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / Contact</p>
        <h1>Contact Us</h1>
        <p class="page-hero-desc">Questions about the OopBuy Spreadsheet? We're here to help.</p>
      </div>
    </section>`)}
  <main>
    <section class="section contact-section">
      <div class="container contact-grid">
        <div class="contact-card">
          <h3>General Inquiries</h3>
          <p>Questions about the OopBuy Spreadsheet, listings, or how to get started.</p>
          <a href="mailto:${EMAIL}" class="text-link">${EMAIL}</a>
        </div>
        <div class="contact-card">
          <h3>Find a Product</h3>
          <p>Send a product name or reference image and we can review it for a future spreadsheet update.</p>
          <a href="mailto:${EMAIL}" class="text-link">Email Product Request</a>
        </div>
        <div class="contact-card">
          <h3>Partnerships</h3>
          <p>Copyright, cooperation, or partnership inquiries.</p>
          <a href="mailto:${EMAIL}" class="text-link">${EMAIL}</a>
        </div>
      </div>
    </section>
  </main>
${footer()}${pageEnd()}`
);

/* ========== CATEGORY PAGES ========== */
for (const cat of allCategories) {
  const related = allCategories.filter((c) => c.slug !== cat.slug).slice(0, 4);
  const filterNote = clothingSlugs.includes(cat.slug)
    ? "clothing"
    : cat.slug;

  writeFile(
    path.join(root, "categories", `${cat.slug}.html`),
    `${head(
      `${cat.name} | OopBuy Spreadsheet`,
      cat.desc,
      `/categories/${cat.slug}.html`,
      "../",
      breadcrumbJsonLd([
        { name: "Home", url: `${DOMAIN}/` },
        { name: "Categories", url: `${DOMAIN}/categories.html` },
        { name: cat.name, url: `${DOMAIN}/categories/${cat.slug}.html` },
      ])
    )}
${heroShell(`${nav(`cat-${cat.slug}`, "../")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor("../")} / <a href="../categories.html">Categories</a> / ${cat.name}</p>
        <span class="page-hero-icon">${cat.icon}</span>
        <h1>OopBuy Spreadsheet  - ${cat.name}</h1>
        <p class="page-hero-desc">${cat.desc}</p>
        <a href="../spreadsheet.html?category=${cat.slug}" class="btn btn-primary">Browse ${cat.name} -&gt;</a>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container content-block">
        <h2>Best ${cat.name} Finds on OopBuy</h2>
        <p>The <strong>OopBuy Spreadsheet ${cat.name}</strong> section is curated by experienced buyers and updated daily. Use it to compare category-specific OopBuy finds, open source links, and shortlist items worth checking with QC photos and a shipping checklist before shipping.</p>
        <ul class="check-list">
          <li>Verified product source links from trusted OopBuy sellers</li>
          <li>QC photos reviewed before listing</li>
          <li>Updated daily with trending OopBuy finds</li>
          <li>Direct links to purchase on OopBuy</li>
        </ul>
      </div>
    </section>
    <section class="section categories">
      <div class="container">
        <h2 class="section-title">More Categories</h2>
        <div class="category-grid category-grid-sm">
${related.map((c) => `          <a href="${streetstyleCategoryUrl(c.slug)}" class="category-card"${externalCategoryAttrs()}>
            ${renderCategoryIcon(c, "../")}
            <span class="category-name">${c.name}</span>
          </a>`).join("\n")}
        </div>
      </div>
    </section>
    <section class="section cta">
      <div class="container cta-inner">
        <h2>Ready to Shop ${cat.name}?</h2>
        <p>Browse verified ${cat.name.toLowerCase()} in the full OopBuy Spreadsheet.</p>
        <a href="../spreadsheet.html?category=${cat.slug}" class="btn btn-primary btn-lg">Open Spreadsheet -&gt;</a>
      </div>
    </section>
  </main>
${footer("../")}${pageEnd("../")}`
  );
}

/* clothing group page alias */
writeFile(
  path.join(root, "categories", "clothing.html"),
  `${head(
    "Clothing | OopBuy Spreadsheet",
    "Browse clothing finds in the OopBuy Spreadsheet  - jackets, hoodies, t-shirts, pants from trusted OopBuy sellers.",
    "/categories/clothing.html",
    "../",
    breadcrumbJsonLd([
      { name: "Home", url: `${DOMAIN}/` },
      { name: "Categories", url: `${DOMAIN}/categories.html` },
      { name: "Clothing", url: `${DOMAIN}/categories/clothing.html` },
    ])
  )}
${heroShell(`${nav("cat-clothing", "../")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor("../")} / Clothing</p>
        <span class="page-hero-icon">CL</span>
        <h1>OopBuy Spreadsheet  - Clothing</h1>
        <p class="page-hero-desc">Jackets, hoodies, t-shirts, and pants from trusted OopBuy sellers.</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container content-block">
        <h2>Clothing OopBuy Finds</h2>
        <p>Use this clothing hub to browse jackets, hoodies, t-shirts, and pants from the OopBuy spreadsheet. Open the source links, compare seller details, review QC photos after warehouse arrival, and add each item to your shipping checklist before submitting an international parcel.</p>
      </div>
    </section>
    <section class="section categories">
      <div class="container">
        <div class="category-grid">
${clothingSlugs.map((slug) => {
  const c = allCategories.find((x) => x.slug === slug);
  return `          <a href="${streetstyleCategoryUrl(slug)}" class="category-card"${externalCategoryAttrs()}>
            ${renderCategoryIcon(c, "../")}
            <span class="category-name">${c.name}</span>
          </a>`;
}).join("\n")}
        </div>
      </div>
    </section>
  </main>
${footer("../")}${pageEnd("../")}`
);

const sitemapUrls = [
  "/",
  "/spreadsheet.html",
  "/categories.html",
  "/guides.html",
  "/compare.html",
  "/qc.html",
  "/deals.html",
  "/review.html",
  "/blog.html",
  "/about.html",
  "/contact.html",
  ...allCategories.map((c) => `/categories/${c.slug}.html`),
  "/categories/clothing.html",
  ...guides.map((g) => `/guides/${g.slug}.html`),
  ...comparisons.map((c) => `/compare/vs-${c.slug}.html`),
];

const sitemapLastmod = new Date().toISOString().slice(0, 10);

writeFile(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${DOMAIN}${u === "/" ? "/" : u}</loc><lastmod>${sitemapLastmod}</lastmod><changefreq>weekly</changefreq><priority>${u === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>`
);

writeFile(
  path.join(root, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`
);

writeFile(
  path.join(root, "products.js"),
  `window.OOPBUY_PRODUCTS = ${JSON.stringify(oopbuyProducts, null, 2)};\n`
);

writeFile(
  path.join(root, "config.js"),
  `window.SITE_CONFIG = ${JSON.stringify({ invite: INVITE, affiliate: AFFILIATE, discord: DISCORD, domain: DOMAIN, openInNewTab: OPEN_IN_NEW_TAB }, null, 2)};
`
);

console.log("Generated OopBuy Spreadsheet site:");
console.log("  index.html, spreadsheet.html, categories.html");
console.log("  guides.html + guides/*.html (6 pages)");
console.log(`  compare.html + compare/*.html (${comparisons.length} pages)`);
console.log("  qc.html, deals.html, review.html, blog.html, about.html, contact.html");
console.log(`  categories/*.html (${allCategories.length + 1} pages)`);
console.log("  sitemap.xml, robots.txt, config.js, products.js");
console.log("\nEdit CONFIG at top of generate.js before deploy:");
console.log(`  INVITE, DOMAIN, DISCORD, EMAIL`);
console.log("\nPreview: node serve.js -> http://localhost:3000");




