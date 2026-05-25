const fs = require("fs");
const path = require("path");

/* ========== CONFIG — edit before deploy ========== */
const INVITE = "YOUR_CODE";
const DOMAIN = "https://oopbuylookup.com";
const SITE_NAME = "OopBuy Spreadsheet";
const AFFILIATE = `https://oopbuy.com/register?inviteCode=${INVITE}`;
const DISCORD = "https://discord.gg/YOUR_INVITE";
const EMAIL = "help@oopbuylookup.com";
const OPEN_IN_NEW_TAB = true;
/* ================================================= */

function newTabAttrs() {
  return OPEN_IN_NEW_TAB ? ' target="_blank" rel="noopener noreferrer"' : "";
}

function homeBtn(prefix = "", text = "Sign Up on OopBuy →") {
  const p = rel(prefix);
  return `<a href="${p}index.html" class="btn btn-primary link-home" data-same-tab="true">${text}</a>`;
}

function homeAnchor(prefix = "", label = "Home") {
  const p = rel(prefix);
  return `<a href="${p}index.html" class="link-home" data-same-tab="true">${label}</a>`;
}

function dropdownBtn(label, activeSuffix = "") {
  return `<button class="nav-dropdown-btn${activeSuffix}" aria-expanded="false">${label}<span class="nav-chevron" aria-hidden="true"></span></button>`;
}

const mainCategories = [
  { slug: "shoes", name: "Sneakers", icon: "👟", group: "products" },
  { slug: "clothing", name: "Clothing", icon: "👕", group: "products", isGroup: true },
  { slug: "bags", name: "Bags", icon: "👜", group: "products" },
  { slug: "accessories", name: "Accessories", icon: "⌨️", group: "products" },
  { slug: "electronics", name: "Electronics", icon: "🔌", group: "products" },
];

const allCategories = [
  { slug: "shoes", name: "Shoes", icon: "👟", desc: "Browse sneakers, running shoes, and streetwear footwear in the OopBuy Spreadsheet from trusted sellers." },
  { slug: "jackets", name: "Jackets", icon: "🧥", desc: "Find puffer jackets, windbreakers, and designer outerwear in the OopBuy Spreadsheet with QC-reviewed listings." },
  { slug: "hoodies", name: "Hoodies", icon: "🧥", iconImg: "icons/hoodie.svg", desc: "Discover hoodies and crewnecks curated in the OopBuy Spreadsheet from verified OopBuy sellers." },
  { slug: "t-shirts", name: "T-Shirts", icon: "👕", desc: "Explore graphic tees and streetwear tops listed in the OopBuy Spreadsheet with trusted seller links." },
  { slug: "pants", name: "Pants", icon: "👖", desc: "Shop pants, joggers, and shorts from the OopBuy Spreadsheet with daily updated finds." },
  { slug: "bags", name: "Bags", icon: "👜", desc: "Browse backpacks, crossbody bags, and luxury-inspired styles in the OopBuy Spreadsheet." },
  { slug: "headwear", name: "Headwear", icon: "🧢", desc: "Find caps, beanies, and hats in the OopBuy Spreadsheet from verified sellers." },
  { slug: "accessories", name: "Accessories", icon: "⌚", desc: "Watches, belts, jewelry, and more — organized in the OopBuy Spreadsheet." },
  { slug: "electronics", name: "Electronics", icon: "📱", desc: "Discover gadgets and tech accessories in the OopBuy Spreadsheet with community-verified listings." },
  { slug: "perfume", name: "Perfume", icon: "🌸", desc: "Browse fragrance finds in the OopBuy Spreadsheet from trusted OopBuy sellers." },
  { slug: "jersey", name: "Jersey", icon: "🏀", desc: "Football, basketball, and sports jerseys curated in the OopBuy Spreadsheet." },
  { slug: "other", name: "Other", icon: "✨", desc: "Miscellaneous trending finds and unique items from the OopBuy Spreadsheet." },
];

const clothingSlugs = ["jackets", "hoodies", "t-shirts", "pants"];

const guides = [
  { slug: "how-to-buy", navLabel: "How to Buy", title: "How to Buy on OopBuy", excerpt: "Step-by-step guide on how to purchase items using the OopBuy Spreadsheet and place your first order.", icon: "🛒" },
  { slug: "shipping", navLabel: "Shipping Guide", title: "OopBuy Shipping Guide", excerpt: "Explore Oopbuy shipping logistics with this comprehensive guide on lines, costs, and delivery times.", icon: "📦" },
  { slug: "declaration", navLabel: "Declaration Guide", title: "How to Declare on OopBuy", excerpt: "Get a detailed guide on how to correctly declare items on Oopbuy for smooth customs clearance.", icon: "📋" },
  { slug: "qc-photos", navLabel: "QC Photos Guide", title: "QC Photos Guide", excerpt: "Learn how to review quality control photos at the OopBuy warehouse before shipping.", icon: "📸" },
  { slug: "coupons", navLabel: "Coupons Guide", title: "All You Need to Know About Coupons", excerpt: "What is a Coupon on Oopbuy? A coupon is a promotional tool to save on orders and shipping.", icon: "🎟️" },
  { slug: "what-is-oopbuy", navLabel: "What is OopBuy?", title: "What is OopBuy?", excerpt: "Oopbuy is a Chinese shopping agent renowned for its quality, affordability, and extensive selection.", icon: "ℹ️" },
];

const homeGuideSlugs = ["declaration", "shipping", "what-is-oopbuy", "coupons"];

const comparisons = [
  { slug: "kakobuy", name: "KakoBuy", title: "OopBuy vs KakoBuy" },
  { slug: "litbuy", name: "LitBuy", title: "OopBuy vs LitBuy" },
  { slug: "hipobuy", name: "Hipobuy", title: "OopBuy vs Hipobuy" },
  { slug: "cnfans", name: "CNFans", title: "OopBuy vs CNFans" },
];

const siteHost = DOMAIN.replace(/^https?:\/\//, "");

const faqs = [
  { q: "What is Oopbuy?", a: "Oopbuy is a renowned Chinese shopping service known for its quality, affordability, and extensive selection. Connecting over 200,000 international customers with premium Chinese fashion, Oopbuy ensures a seamless and secure shopping experience. The Oopbuy spreadsheet further enhances this by organizing and simplifying the shopping process." },
  { q: `What is ${siteHost}?`, a: `${siteHost} is a dedicated platform designed to make using the Oopbuy spreadsheet easy and efficient. It provides access to a vast selection of high-quality products, along with useful articles and the latest updates related to Oopbuy and its spreadsheets.` },
  { q: "Why should I opt for a website spreadsheet over a traditional one?", a: "Our OopBuy Spreadsheet website offers a streamlined, mobile-optimized experience for browsing Oopbuy spreadsheets. Unlike traditional spreadsheets, our platform pre-screens products to ensure quality and provides a more user-friendly interface. This makes finding the best items through the OopBuy spreadsheet quicker and easier." },
  { q: "How can I get additional support?", a: "For extra help with the Oopbuy spreadsheet or other queries, join our Discord community. You can interact with our team and other Oopbuy users for support and tips on how to make the most out of the OopBuy spreadsheet." },
  { q: "How do I place an order with Oopbuy?", a: "Using the Oopbuy spreadsheet to place an order is simple. Browse the spreadsheet for products, click the image link to go directly to the product page on Oopbuy, select size and color options, add items to your cart, fill in the details, and complete payment. OopBuy supports PayPal and balance top-up. Track your order through stages like Process Pending, Purchased, and Seller Send. Once items arrive at the warehouse, review QC photos and choose your shipping method." },
  { q: "Can you help me find a specific product?", a: "Absolutely! Share an image and the name of the product you're looking for in our Discord Channel, and we'll assist you in finding it quickly. We can also add it to the OopBuy spreadsheet for easy access." },
  { q: "Why should I use Oopbuy instead of other shipping agents?", a: "OopBuy stands out among shopping agents thanks to competitive shipping rates, a user-friendly interface, reliable quality check photos, and responsive customer service. Their platform supports multiple payment methods including PayPal, and they offer generous coupon bundles for new users. Combined with our OopBuy spreadsheet that pre-screens products for quality, you get a seamless and trustworthy shopping experience." },
  { q: "What is an OopBuy spreadsheet?", a: `An OopBuy spreadsheet is a curated list of the best products available through the OopBuy shopping agent. Our OopBuy spreadsheet at ${siteHost} is the biggest and most up-to-date version, featuring over 3000 items from trusted sellers. We organize products by category and update the spreadsheet daily with new high quality finds.` },
];

function rel(prefix) {
  return prefix || "";
}

function promoBar(prefix = "") {
  const p = rel(prefix);
  return `  <div class="promo-bar">
    <div class="container promo-inner">
      <span>Special OopBuy Offer: <strong>¥3,000 Coupon Bundle</strong> + 15% Off Shipping</span>
      <a href="${AFFILIATE}" class="promo-link"${newTabAttrs()}>Redeem Now →</a>
    </div>
  </div>`;
}

function siteLogo(prefix = "") {
  const p = rel(prefix);
  return `      <a href="${p}index.html" class="logo logo--brand link-home" data-same-tab="true">
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
  const activeClass = (id) => (current === id ? ' class="active"' : "");

  const spreadsheetLinks = mainCategories
    .map((c) => {
      if (c.isGroup) return `<a href="${p}categories.html#clothing">Clothing</a>`;
      return `<a href="${cp}${c.slug}.html">${c.name}</a>`;
    })
    .join("\n            ");

  const compareLinks = comparisons
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
        <a href="${p}index.html" class="link-home" data-same-tab="true"${activeClass("home")}>Home</a>
        <div class="nav-dropdown">
          ${dropdownBtn("Spreadsheet", spreadsheetActive)}
          <div class="nav-dropdown-menu nav-dropdown-menu--wide">
            <a href="${p}spreadsheet.html"${activeClass("spreadsheet")}>All Products</a>
            ${spreadsheetLinks}
          </div>
        </div>
        <div class="nav-dropdown">
          ${dropdownBtn("Guides", guidesActive)}
          <div class="nav-dropdown-menu">
            ${guides.filter((g) => g.slug !== "what-is-oopbuy").map((g) => `<a href="${p}guides/${g.slug}.html"${activeClass(`guide-${g.slug}`)}>${g.navLabel}</a>`).join("\n            ")}
            <a href="${p}guides.html"${activeClass("guides")}>View All Guides</a>
          </div>
        </div>
        <div class="nav-dropdown">
          ${dropdownBtn("Compare", compareActive)}
          <div class="nav-dropdown-menu">
            ${compareLinks}
            <a href="${p}compare.html"${activeClass("compare")}>View All Comparisons</a>
          </div>
        </div>
        <a href="${p}deals.html"${activeClass("deals")}>Deals</a>
        <a href="${p}review.html"${activeClass("review")}>Review</a>
        <a href="${p}about.html"${activeClass("about")}>About</a>
        <a href="${DISCORD}" class="nav-discord" target="_blank" rel="noopener noreferrer">Discord</a>
        <a href="${AFFILIATE}" class="btn btn-nav-signup" target="_blank" rel="noopener noreferrer">Sign Up Free</a>
      </nav>
    </div>
  </header>`;
}

function footer(prefix = "") {
  const p = rel(prefix);
  return `  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <h4>Products</h4>
        <ul>
          <li><a href="${p}spreadsheet.html">All Products</a></li>
          <li><a href="${p}categories/shoes.html">Sneakers</a></li>
          <li><a href="${p}categories.html">Clothing</a></li>
          <li><a href="${p}categories/bags.html">Bags</a></li>
          <li><a href="${p}categories/accessories.html">Accessories</a></li>
          <li><a href="${p}categories/electronics.html">Electronics</a></li>
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
          <li><a href="${p}spreadsheet.html">Best Finds 2026</a></li>
          <li><a href="${p}deals.html">Deals &amp; Coupons</a></li>
          <li><a href="${p}compare.html">Compare Agents</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="${p}about.html">About Us</a></li>
          <li><a href="${p}contact.html">Contact</a></li>
          <li><a href="${DISCORD}" target="_blank" rel="noopener noreferrer">Discord</a></li>
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

function head(title, description, urlPath, prefix = "") {
  const p = rel(prefix);
  const url = `${DOMAIN}${urlPath}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="oopbuy spreadsheet, oopbuy sheet, oopbuy finds, oopbuy guide, oopbuy trusted sellers, oopbuy 2026">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="${SITE_NAME}">

  <link rel="icon" href="${p}images/favicon.png" type="image/png" sizes="32x32">
  <link rel="shortcut icon" href="${p}images/favicon.png">
  <link rel="stylesheet" href="${p}style.css">${urlPath === "/" ? `\n${faqJsonLd()}` : ""}
</head>
<body>`;
}

function pageEnd(prefix = "", extraScripts = "") {
  const p = rel(prefix);
  return `
  <script src="${p}config.js"></script>
  <script src="${p}main.js"></script>${extraScripts}
</body>
</html>
`;
}

function heroShell(content) {
  return `  <div class="hero-shell">\n${content}\n  </div>`;
}

function ctaBlock(text = "Browse Spreadsheet →", secondary = false) {
  const cls = secondary ? "btn btn-secondary btn-lg" : "btn btn-primary btn-lg";
  const href = secondary ? AFFILIATE : "spreadsheet.html";
  return `<a href="${href}" class="${cls}"${newTabAttrs()}>${text}</a>`;
}

function signupCta() {
  return `    <section class="section signup-cta">
      <div class="container signup-grid">
        <div class="signup-content">
          <h2>New to OopBuy?<br>Get started with ¥3,000 in coupons.</h2>
          <p>Sign up and unlock your coupon bundle + 15% off shipping on your first order. Join 200,000+ happy shoppers.</p>
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
          <p>Searching for a dependable <strong>OopBuy Spreadsheet</strong>? This site brings together a hand-picked <strong>OopBuy Spreadsheet 2026</strong> with 3,000+ quality listings from reliable sellers — grouped into clear sections for shoes, apparel, bags, accessories, and other popular picks.</p>
          <p>We work to keep one of the most complete OopBuy lists available by refreshing entries every day and adding standout products as they appear. Before a link goes live, our team checks seller track record and listing quality so you see fewer risky options and more <strong>trusted OopBuy finds</strong>.</p>
          <p>Shop by category: <a href="categories/shoes.html" class="text-link">Sneakers</a>, <a href="categories.html" class="text-link">Clothing</a>, <a href="categories/bags.html" class="text-link">Bags</a>, <a href="categories/accessories.html" class="text-link">Accessories</a>, and <a href="categories/electronics.html" class="text-link">Electronics</a>. New to the platform? Start with our guides on <a href="guides/what-is-oopbuy.html" class="text-link">What is OopBuy</a>, <a href="guides/shipping.html" class="text-link">Shipping</a>, and <a href="guides/coupons.html" class="text-link">Coupons</a>.</p>
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

function renderCategoryIcon(cat, prefix = "", { wrapperClass = "category-icon", ariaHidden = false } = {}) {
  const p = rel(prefix);
  const aria = ariaHidden ? ' aria-hidden="true"' : "";
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
        : `<span class="category-sheet-icon" aria-hidden="true">✨</span>`;
      return `          <a href="${p}categories/${slug}.html" class="category-sheet-card">
            ${iconHtml}
            <span class="category-sheet-name">${label}</span>
          </a>`;
    })
    .join("\n");

  return `        <div class="category-sheet-grid">
${cards}
        </div>`;
}

function categoryCards(prefix = "", linkTarget = "local") {
  const p = rel(prefix);
  const cats = linkTarget === "main" ? mainCategories.filter((c) => !c.isGroup) : allCategories;

  return cats
    .map((c) => {
      const href =
        linkTarget === "affiliate"
          ? AFFILIATE
          : `${p}categories/${c.slug}.html`;
      const ext = linkTarget === "affiliate" ? ' target="_blank" rel="noopener noreferrer"' : "";
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
      <img src="${p}images/guides/declaration.png" alt="How to declare on OopBuy and avoid customs seizure — oopbuy spreadsheet" class="${imgClass}" width="288" height="170" loading="lazy">
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
      <img src="${p}images/guides/shipping.png" alt="Choose the correct shipping company and route on OopBuy — oopbuy spreadsheet" class="${imgClass}" width="288" height="170" loading="lazy">
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
      <img src="${p}images/guides/what-is-oopbuy.png" alt="What is OopBuy shopping agent — oopbuy spreadsheet" class="${imgClass}" width="288" height="170" loading="lazy">
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
      <img src="${p}images/guides/coupons.png" alt="How to get coupons on OopBuy — oopbuy spreadsheet" class="${imgClass}" width="288" height="170" loading="lazy">
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
            <h3>${g.title}</h3>
            <p>${g.excerpt}</p>
            <span class="text-link">Read more →</span>
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

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

const root = __dirname;

/* ========== INDEX ========== */
writeFile(
  path.join(root, "index.html"),
  `${head(
    "OopBuy Spreadsheet 2026 – Best Finds & Trusted Sellers",
    "Browse the biggest OopBuy Spreadsheet with 3000+ high quality finds from trusted sellers. Updated daily with shoes, clothing, bags, accessories and more.",
    "/"
  )}
${heroShell(`${nav("home")}
    <section class="hero">
      <div class="container hero-inner">
        <p class="hero-badge">Updated Daily · 2026</p>
        <h1>Best OopBuy<br><span class="hero-title-accent">Spreadsheet</span></h1>
        <p class="hero-desc">
          Browse the biggest <strong>OopBuy Spreadsheet</strong> with 3,000+ high quality finds from trusted sellers.
          Updated daily with the best OopBuy products — shoes, clothing, accessories and more.
        </p>
        <div class="hero-actions">
          <a href="spreadsheet.html" class="btn btn-primary">View Products</a>
          <a href="${DISCORD}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><span class="hero-stat-num hero-stat-num--count" data-target="3000" data-format="number">0+</span><span class="hero-stat-label">Products</span></div>
          <div class="hero-stat"><span class="hero-stat-num">Daily</span><span class="hero-stat-label">Updated</span></div>
          <div class="hero-stat"><span class="hero-stat-num hero-stat-num--count" data-target="200" data-format="k">0k+</span><span class="hero-stat-label">Shoppers</span></div>
        </div>
        <div class="trust-badges">
          <span class="trust-badge"><span class="trust-badge-icon" aria-hidden="true">✓</span>Verified sellers only</span>
          <span class="trust-badge"><span class="trust-badge-icon" aria-hidden="true">✓</span>QC photos reviewed</span>
          <span class="trust-badge"><span class="trust-badge-icon" aria-hidden="true">✓</span>Daily updates</span>
          <span class="trust-badge"><span class="trust-badge-icon" aria-hidden="true">✓</span>Free to browse</span>
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

    <div class="section-divider" aria-hidden="true"></div>

    <section class="section guides-preview">
      <div class="container">
        <h2 class="section-title">Latest Guides</h2>
        <p class="section-subtitle">Step-by-step tutorials to help you shop smarter on OopBuy.</p>
        <div class="guide-grid">
${guideCards()}
        </div>
        <div class="section-action">
          <a href="guides.html" class="btn btn-secondary">View All Guides →</a>
        </div>
      </div>
    </section>

${signupCta()}
${aboutSeoBlock()}
${faqSection()}

    <section class="section cta">
      <div class="container cta-inner">
        <h2>Ready to find the best deals?</h2>
        <p>Browse 3,000+ curated products from trusted sellers. Free to use, updated daily.</p>
        <div class="cta-actions">
          <a href="spreadsheet.html" class="btn btn-primary btn-lg">Browse Spreadsheet</a>
          <a href="${AFFILIATE}" class="btn btn-secondary btn-lg" target="_blank" rel="noopener noreferrer">Sign Up Free</a>
        </div>
      </div>
    </section>
  </main>
${footer()}${pageEnd()}`
);

/* ========== SPREADSHEET ========== */
writeFile(
  path.join(root, "spreadsheet.html"),
  `${head(
    "OopBuy Spreadsheet 2026 - Browse 3000+ Best Finds",
    "Browse the biggest OopBuy Spreadsheet online. 3000+ curated products from trusted OopBuy sellers with search, filters, and direct purchase links.",
    "/spreadsheet.html"
  )}
${heroShell(`${nav("spreadsheet")}
    <section class="page-hero page-hero-compact">
      <div class="container">
        <h1>Browse the Biggest OopBuy Spreadsheet 2026</h1>
        <p class="page-hero-desc">Over 3,000 hand-picked products from trusted OopBuy sellers. Search, filter by category, and click through to purchase on OopBuy.</p>
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
        <p class="results-count" id="resultsCount"></p>
        <div class="product-grid" id="productGrid"></div>
        <div class="empty-state" id="emptyState" hidden>
          <p>No products match your search. Try a different keyword or category.</p>
        </div>
      </div>
    </section>

    <section class="section cta">
      <div class="container cta-inner">
        <h2>Can't find what you need?</h2>
        <p>Join our Discord — share a photo and we'll help you find it and add it to the OopBuy Spreadsheet.</p>
        <a href="${DISCORD}" class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">Join Discord</a>
      </div>
    </section>
  </main>
${footer()}${pageEnd("", '\n  <script src="products.js"></script>')}`
);

/* ========== CATEGORIES INDEX ========== */
writeFile(
  path.join(root, "categories.html"),
  `${head(
    "All Categories | OopBuy Spreadsheet",
    "Browse all OopBuy Spreadsheet categories — sneakers, clothing, bags, electronics, and more from trusted sellers.",
    "/categories.html"
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
  return `          <a href="categories/${c.slug}.html" class="category-card">
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
        <p>Search and filter 3,000+ products from trusted OopBuy sellers.</p>
        <a href="spreadsheet.html" class="btn btn-primary btn-lg">Open Spreadsheet →</a>
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
    "Complete OopBuy guides — how to buy, shipping, customs declaration, QC photos, and coupons for the OopBuy Spreadsheet.",
    "/guides.html"
  )}
${heroShell(`${nav("guides")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / Guides</p>
        <h1>OopBuy Guides</h1>
        <p class="page-hero-desc">Step-by-step tutorials to help you shop smarter on OopBuy using our spreadsheet.</p>
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
            <span class="text-link">Read more →</span>
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
      { h: "Step 1: Browse the OopBuy Spreadsheet", p: "Start on our OopBuy Spreadsheet page. Use search and category filters to find sneakers, clothing, bags, or accessories from trusted sellers." },
      { h: "Step 2: Click Through to OopBuy", p: "Each product links directly to OopBuy. Click the product card, select your size and color variant, then add the item to your cart." },
      { h: "Step 3: Complete Payment", p: "OopBuy supports PayPal and balance top-up. Fill in your shipping details and complete checkout. New users can redeem the ¥3,000 coupon bundle for extra savings." },
      { h: "Step 4: Track Your Order", p: "Monitor order status: Process Pending → Purchased → Seller Send. Once items arrive at the OopBuy warehouse, you'll receive QC photos to review before shipping internationally." },
    ],
  },
  shipping: {
    title: "OopBuy Shipping Guide",
    sections: [
      { h: "Shipping Lines", p: "OopBuy offers multiple international shipping lines including EMS, DHL, FedEx, and budget-friendly options. Choose based on speed vs. cost for your country." },
      { h: "Consolidation", p: "Items stored at the warehouse can be consolidated into one package to save on shipping. Wait for all items to arrive, then submit a single shipment request." },
      { h: "Estimated Delivery", p: "Most international shipments arrive within 7–20 business days depending on the line and destination. Track your package through OopBuy's dashboard." },
      { h: "Shipping Costs", p: "Costs depend on weight, dimensions, and shipping line. Use OopBuy's shipping estimator before submitting. New users get 15% off shipping on their first order." },
    ],
  },
  declaration: {
    title: "How to Declare on OopBuy",
    sections: [
      { h: "What is Customs Declaration?", p: "When shipping internationally, you must declare the contents and value of your package for customs. Accurate declaration prevents delays and seizures." },
      { h: "How to Declare on OopBuy", p: "During the shipping submission step, OopBuy asks you to declare item names and values. Use generic descriptions (e.g., 'clothing', 'shoes') and reasonable declared values." },
      { h: "Tips for Smooth Clearance", p: "Don't over-declare or under-declare significantly. Research your country's import limits and tax thresholds. When in doubt, ask in our Discord community." },
    ],
  },
  "qc-photos": {
    title: "QC Photos Guide",
    sections: [
      { h: "What are QC Photos?", p: "Quality Control photos are taken at the OopBuy warehouse when your items arrive. They show the actual product you received — use them to verify quality before shipping." },
      { h: "How to Review QC", p: "Check stitching, logos, colors, and overall build quality against reference photos. Compare with QC photos in our OopBuy Spreadsheet listings." },
      { h: "Exchange or Return", p: "If QC reveals issues, request an exchange or return through OopBuy before submitting your international shipment. Act quickly — warehouse storage has time limits." },
    ],
  },
  coupons: {
    title: "All About OopBuy Coupons",
    sections: [
      { h: "What is a Coupon on OopBuy?", p: "Coupons are promotional discounts on OopBuy. New users receive a ¥3,000 coupon bundle plus 15% off shipping on their first order when signing up through our link." },
      { h: "How to Redeem", p: "Sign up for OopBuy, verify your email, and coupons are automatically added to your account. Apply them at checkout when placing orders or paying for shipping." },
      { h: "Ongoing Deals", p: "Check our Deals page for active coupon codes and seasonal promotions. We update it regularly with the latest OopBuy offers." },
    ],
  },
  "what-is-oopbuy": {
    title: "What is OopBuy?",
    sections: [
      { h: "Overview", p: "OopBuy is a Chinese shopping agent that helps international buyers purchase from Taobao, Weidian, 1688, and other Chinese marketplaces. They handle payment, QC inspection, warehouse storage, and international shipping." },
      { h: "Why OopBuy?", p: "Competitive shipping rates, reliable QC photos, PayPal support, responsive customer service, and generous new-user coupons make OopBuy a top choice among shopping agents." },
      { h: "OopBuy Spreadsheet", p: "Our OopBuy Spreadsheet curates the best finds from trusted sellers into an easy-to-browse format — saving you hours of searching Chinese marketplaces manually." },
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
      "../"
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
    "Compare OopBuy vs LitBuy, Hipobuy, KakoBuy, and CNFans. Find the best shopping agent for your needs.",
    "/compare.html"
  )}
${heroShell(`${nav("compare")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / Compare</p>
        <h1>Compare Shopping Agents</h1>
        <p class="page-hero-desc">Detailed comparisons to help you choose the right agent. We recommend OopBuy for its shipping rates, QC quality, and user experience.</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container">
        <div class="compare-grid">
${comparisons.map((c) => `          <a href="compare/vs-${c.slug}.html" class="compare-card">
            <h3>${c.title}</h3>
            <p>See how OopBuy compares to ${c.name} on shipping, fees, QC, and user experience.</p>
            <span class="text-link">Read comparison →</span>
          </a>`).join("\n")}
        </div>
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
      `${comp.title} — detailed comparison of shipping rates, QC photos, fees, and user experience to help you choose the best shopping agent.`,
      `/compare/vs-${comp.slug}.html`,
      "../"
    )}
${heroShell(`${nav(`compare-${comp.slug}`, "../")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor("../")} / <a href="../compare.html">Compare</a> / ${comp.title}</p>
        <h1>${comp.title}</h1>
        <p class="page-hero-desc">A detailed comparison to help you decide between OopBuy and ${comp.name}.</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container content-block">
        <h2>Quick Comparison</h2>
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead><tr><th>Feature</th><th>OopBuy</th><th>${comp.name}</th></tr></thead>
            <tbody>
              <tr><td>Shipping Rates</td><td>Competitive, multiple lines</td><td>Varies by region</td></tr>
              <tr><td>QC Photos</td><td>Free, detailed</td><td>Available</td></tr>
              <tr><td>PayPal Support</td><td>Yes</td><td>Varies</td></tr>
              <tr><td>New User Coupons</td><td>¥3,000 bundle + 15% shipping</td><td>Varies</td></tr>
              <tr><td>Interface</td><td>Modern, mobile-friendly</td><td>Standard</td></tr>
              <tr><td>Customer Service</td><td>Responsive</td><td>Varies</td></tr>
            </tbody>
          </table>
        </div>
        <h2>Why We Recommend OopBuy</h2>
        <p>For most international buyers using an <strong>OopBuy Spreadsheet</strong>, OopBuy offers the best balance of shipping cost, QC quality, and ease of use. Combined with our curated spreadsheet of 3,000+ verified finds, you get a seamless shopping experience from discovery to delivery.</p>
        <p>That said, ${comp.name} may suit specific use cases. We encourage comparing both before committing — and browsing our OopBuy Spreadsheet regardless of which agent you choose.</p>
        <div class="hero-actions" style="margin-top:24px">
          <a href="${AFFILIATE}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Try OopBuy Free →</a>
          <a href="../spreadsheet.html" class="btn btn-secondary">Browse Spreadsheet</a>
        </div>
      </div>
    </section>
  </main>
${footer("../")}${pageEnd("../")}`
  );
}

/* ========== DEALS, REVIEW, ABOUT, CONTACT ========== */
writeFile(
  path.join(root, "deals.html"),
  `${head(
    "OopBuy Deals & Coupons 2026 | OopBuy Spreadsheet",
    "Latest OopBuy coupon codes, deals, and promotions. Get ¥3,000 coupon bundle + 15% off shipping for new users.",
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
            <h3>¥3,000 Coupon Bundle</h3>
            <p>Sign up through our link and receive ¥3,000 in coupons plus 15% off shipping on your first order.</p>
            <a href="${AFFILIATE}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Claim Now →</a>
          </article>
          <article class="deal-card">
            <span class="deal-badge">Shipping</span>
            <h3>15% Off First Shipment</h3>
            <p>New OopBuy accounts get 15% off their first international shipping payment.</p>
            <a href="${AFFILIATE}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Sign Up →</a>
          </article>
          <article class="deal-card">
            <span class="deal-badge">Daily</span>
            <h3>Spreadsheet Daily Updates</h3>
            <p>Our OopBuy Spreadsheet is updated daily with fresh finds and removed stale listings.</p>
            <a href="spreadsheet.html" class="btn btn-secondary">Browse Finds →</a>
          </article>
        </div>
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
        <p class="page-hero-desc">An honest look at OopBuy — shipping, QC, fees, and overall experience.</p>
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
          <li>Generous new-user coupon bundle (¥3,000 + 15% shipping)</li>
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
        <p>For buyers using an OopBuy Spreadsheet, OopBuy is our top recommendation. Pair our curated 3,000+ finds with OopBuy's reliable service for the best experience.</p>
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
    "About our OopBuy Spreadsheet — the biggest curated product list for OopBuy shoppers, updated daily with trusted seller finds.",
    "/about.html"
  )}
${heroShell(`${nav("about")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor()} / About</p>
        <h1>About Us</h1>
        <p class="page-hero-desc">We built the biggest OopBuy Spreadsheet to make smart shopping easy.</p>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container content-block">
        <p>We're an independent group of long-time OopBuy users who maintain a browsable <strong>OopBuy Spreadsheet</strong> of vetted seller links. The goal is simple: cut down search time and steer you away from questionable listings.</p>
        <p>Each row is reviewed for seller history, price, and overall quality before it stays on the sheet. We refresh the list daily — new picks go in, and weaker entries come out when they no longer hold up.</p>
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
          <p>Share an image in our Discord and we'll help you find it and add it to the spreadsheet.</p>
          <a href="${DISCORD}" class="text-link" target="_blank" rel="noopener noreferrer">Join Discord →</a>
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
      "../"
    )}
${heroShell(`${nav(`cat-${cat.slug}`, "../")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor("../")} / <a href="../categories.html">Categories</a> / ${cat.name}</p>
        <span class="page-hero-icon">${cat.icon}</span>
        <h1>OopBuy Spreadsheet — ${cat.name}</h1>
        <p class="page-hero-desc">${cat.desc}</p>
        <a href="../spreadsheet.html?category=${cat.slug}" class="btn btn-primary">Browse ${cat.name} →</a>
      </div>
    </section>`)}
  <main>
    <section class="section">
      <div class="container content-block">
        <h2>Best ${cat.name} Finds on OopBuy</h2>
        <p>The <strong>OopBuy Spreadsheet ${cat.name}</strong> section is curated by experienced buyers and updated daily. Every listing links to verified sellers on OopBuy with QC-reviewed quality.</p>
        <ul class="check-list">
          <li>Verified product links from trusted OopBuy sellers</li>
          <li>QC photos reviewed before listing</li>
          <li>Updated daily with trending finds</li>
          <li>Direct links to purchase on OopBuy</li>
        </ul>
      </div>
    </section>
    <section class="section categories">
      <div class="container">
        <h2 class="section-title">More Categories</h2>
        <div class="category-grid category-grid-sm">
${related.map((c) => `          <a href="${c.slug}.html" class="category-card">
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
        <a href="../spreadsheet.html?category=${cat.slug}" class="btn btn-primary btn-lg">Open Spreadsheet →</a>
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
    "Browse clothing finds in the OopBuy Spreadsheet — jackets, hoodies, t-shirts, pants from trusted OopBuy sellers.",
    "/categories/clothing.html",
    "../"
  )}
${heroShell(`${nav("cat-clothing", "../")}
    <section class="page-hero">
      <div class="container">
        <p class="breadcrumb">${homeAnchor("../")} / Clothing</p>
        <span class="page-hero-icon">👕</span>
        <h1>OopBuy Spreadsheet — Clothing</h1>
        <p class="page-hero-desc">Jackets, hoodies, t-shirts, and pants from trusted OopBuy sellers.</p>
      </div>
    </section>`)}
  <main>
    <section class="section categories">
      <div class="container">
        <div class="category-grid">
${clothingSlugs.map((slug) => {
  const c = allCategories.find((x) => x.slug === slug);
  return `          <a href="${slug}.html" class="category-card">
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
  "/deals.html",
  "/review.html",
  "/about.html",
  "/contact.html",
  ...allCategories.map((c) => `/categories/${c.slug}.html`),
  "/categories/clothing.html",
  ...guides.map((g) => `/guides/${g.slug}.html`),
  ...comparisons.map((c) => `/compare/vs-${c.slug}.html`),
];

writeFile(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${DOMAIN}${u === "/" ? "" : u}</loc><changefreq>weekly</changefreq><priority>${u === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
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
  path.join(root, "config.js"),
  `window.SITE_CONFIG = ${JSON.stringify({ invite: INVITE, affiliate: AFFILIATE, discord: DISCORD, domain: DOMAIN, openInNewTab: OPEN_IN_NEW_TAB }, null, 2)};
`
);

console.log("✓ Generated OopBuy Spreadsheet site:");
console.log("  index.html, spreadsheet.html, categories.html");
console.log("  guides.html + guides/*.html (6 pages)");
console.log("  compare.html + compare/*.html (4 pages)");
console.log("  deals.html, review.html, about.html, contact.html");
console.log(`  categories/*.html (${allCategories.length + 1} pages)`);
console.log("  sitemap.xml, robots.txt, config.js");
console.log("\n⚙ Edit CONFIG at top of generate.js before deploy:");
console.log(`  INVITE, DOMAIN, DISCORD, EMAIL`);
console.log("\n▶ Preview: node serve.js  →  http://localhost:3000");
