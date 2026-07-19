(function () {
  "use strict";

  const AFFILIATE =
    (window.SITE_CONFIG && window.SITE_CONFIG.affiliate) ||
    "https://oopbuy.com/register?inviteCode=YOUR_CODE";

  const OPEN_IN_NEW_TAB =
    !window.SITE_CONFIG || window.SITE_CONFIG.openInNewTab !== false;

  const CNY_PER_USD = 6.7784;

  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "zh-CN", label: "Chinese" },
    { code: "pl", label: "Polski" },
    { code: "de", label: "Deutsch" },
    { code: "fr", label: "French" },
    { code: "it", label: "Italiano" },
    { code: "pt", label: "Portuguese" },
    { code: "es", label: "Spanish" },
    { code: "nl", label: "Nederlands" },
    { code: "da", label: "Dansk" },
    { code: "sv", label: "Svenska" },
    { code: "ar", label: "Arabic" },
    { code: "cs", label: "Czech" },
  ];

  function isHomeLink(link) {
    const href = link.getAttribute("href") || "";
    if (link.dataset.sameTab === "true" || link.classList.contains("link-home")) return true;
    return /(^|\/)index\.html([?#].*)?$/.test(href) || href === "/" || href === "./";
  }

  function normalizeHomeLinks(root) {
    (root || document).querySelectorAll("a[href]").forEach((link) => {
      if (!isHomeLink(link)) return;
      link.classList.add("link-home");
      link.setAttribute("data-same-tab", "true");
      link.removeAttribute("target");
    });
  }

  function applyNewTabLinks(root) {
    if (!OPEN_IN_NEW_TAB) return;

    (root || document).querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
      if (isHomeLink(link)) return;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  normalizeHomeLinks();
  applyNewTabLinks();

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function resetScrollToTop() {
    if (location.hash) return;
    try {
      sessionStorage.removeItem(`oopbuyScroll:${location.pathname}${location.search}`);
    } catch {}

    const top = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    top();
    requestAnimationFrame(() => {
      top();
      setTimeout(top, 120);
      setTimeout(top, 450);
      setTimeout(top, 1000);
    });
  }

  window.addEventListener("load", resetScrollToTop);

  function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : "";
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    if (location.hostname.includes(".")) {
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=.${location.hostname}`;
    }
  }

  function clearCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    if (location.hostname.includes(".")) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname}`;
    }
  }

  function getCurrentLanguage() {
    const stored = localStorage.getItem("oopbuyLanguage");
    const translated = getCookie("googtrans").split("/").filter(Boolean).pop();
    return translated || stored || "en";
  }

  function hasLanguageSelection() {
    return Boolean(localStorage.getItem("oopbuyLanguage") || getCookie("googtrans"));
  }

  function updateLanguageLabel(code) {
    const language = LANGUAGES.find((item) => item.code === code) || LANGUAGES[0];
    document.querySelectorAll(".language-current").forEach((label) => {
      label.textContent = hasLanguageSelection() ? language.label : "Language";
    });
    document.querySelectorAll(".language-option").forEach((option) => {
      const active = option.dataset.lang === language.code;
      option.classList.toggle("active", active);
      option.setAttribute("aria-pressed", String(active));
    });
  }

  function showLanguageStatus(message) {
    let status = document.querySelector(".language-status");
    if (!status) {
      status = document.createElement("div");
      status.className = "language-status notranslate";
      status.setAttribute("translate", "no");
      document.body.append(status);
    }
    status.textContent = message;
    status.hidden = false;
    clearTimeout(showLanguageStatus.timer);
    showLanguageStatus.timer = setTimeout(() => {
      status.hidden = true;
    }, 4200);
  }

  function ensureTranslateScript() {
    if (window.google && window.google.translate) return;
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = function () {
      if (!window.google || !window.google.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map((item) => item.code).join(","),
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      clearCookie("googtrans");
      updateLanguageLabel(getCurrentLanguage());
      showLanguageStatus("Translation service is unavailable. Please try again later.");
    };
    document.head.appendChild(script);
  }

  function applyLanguage(code) {
    if (code === "en") {
      localStorage.setItem("oopbuyLanguage", code);
      updateLanguageLabel(code);
      clearCookie("googtrans");
      location.reload();
      return;
    }

    setCookie("googtrans", `/en/${code}`, 365);
    ensureTranslateScript();

    let attempts = 0;
    const timer = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      attempts += 1;
      if (!select && attempts < 20) return;
      clearInterval(timer);
      if (select) {
        select.value = code;
        select.dispatchEvent(new Event("change"));
        localStorage.setItem("oopbuyLanguage", code);
        updateLanguageLabel(code);
      } else {
        clearCookie("googtrans");
        updateLanguageLabel(getCurrentLanguage());
        showLanguageStatus("Translation service is unavailable. Please try again later.");
      }
    }, 250);
  }

  updateLanguageLabel(getCurrentLanguage());
  if (getCurrentLanguage() !== "en") ensureTranslateScript();

  function formatHeroCount(value, format) {
    const n = Math.round(value);
    if (format === "k") return `${n}k+`;
    return `${n.toLocaleString("en-US")}+`;
  }

  function animateHeroCount(el) {
    const target = Number(el.dataset.target);
    const format = el.dataset.format || "number";
    const duration = 900;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = easeOutExpo(progress) * target;
      el.textContent = formatHeroCount(current, format);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatHeroCount(target, format);
      }
    }

    el.textContent = formatHeroCount(0, format);
    requestAnimationFrame(tick);
  }

  function playHeroStatCountUp() {
    const stats = document.querySelectorAll(".hero-stat-num--count");
    if (!stats.length) return;

    stats.forEach((el, index) => {
      setTimeout(() => animateHeroCount(el), index * 80);
    });
  }

  playHeroStatCountUp();
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) playHeroStatCountUp();
  });

  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        dropdowns.forEach((d) => {
          d.classList.remove("open");
          const btn = d.querySelector(".nav-dropdown-btn");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
      });
    });
  }

  dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector(".nav-dropdown-btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));

      dropdowns.forEach((other) => {
        if (other !== dropdown) {
          other.classList.remove("open");
          const otherBtn = other.querySelector(".nav-dropdown-btn");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });
    });
  });

  document.querySelectorAll(".language-option").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      applyLanguage(option.dataset.lang || "en");
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const btn = dropdown.querySelector(".nav-dropdown-btn");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
      if (siteNav && navToggle) {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("open");
      const btn = dropdown.querySelector(".nav-dropdown-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll(".steps-accordion").forEach((accordion) => {
    const items = accordion.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  });

  document.querySelectorAll(".faq-list").forEach((list) => {
    const items = list.querySelectorAll(".faq-item");
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  });

  const productGrid = document.getElementById("productGrid");
  if (productGrid && window.OOPBUY_PRODUCTS) {
    const searchInput = document.getElementById("productSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");
    const resultsCount = document.getElementById("resultsCount");
    const emptyState = document.getElementById("emptyState");

    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get("category");
    if (initialCategory && categoryFilter) {
      categoryFilter.value = initialCategory;
    }

    function renderProducts(products) {
      productGrid.replaceChildren();

      const fragment = document.createDocumentFragment();
      products.forEach((p) => {
        const productName = p.name || "Product";
        const card = document.createElement("a");
        card.href = p.href || AFFILIATE;
        card.className = "product-card";
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.dataset.name = String(productName).toLowerCase();
        card.dataset.category = p.category || "";

        const image = document.createElement("img");
        image.src = p.image || "";
        image.alt = `${productName} - OopBuy Spreadsheet`;
        image.className = "product-image";
        image.loading = "lazy";
        image.width = 400;
        image.height = 400;

        const body = document.createElement("div");
        body.className = "product-body";

        const options = document.createElement("div");
        options.className = "product-options";
        options.textContent = p.meta || p.brand || "MaisonLooks product";

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = productName;

        const price = document.createElement("div");
        price.className = "product-price";
        price.textContent = `$${(Number(p.price) / CNY_PER_USD).toFixed(2)}`;

        body.append(options, name, price);
        card.append(image, body);
        fragment.append(card);
      });

      productGrid.append(fragment);

      if (resultsCount) {
        resultsCount.textContent = `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`;
      }

      if (emptyState) {
        emptyState.hidden = products.length > 0;
        productGrid.hidden = products.length === 0;
      }

    }

    function filterAndSort() {
      let products = [...window.OOPBUY_PRODUCTS];
      const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      const category = categoryFilter ? categoryFilter.value : "";
      const sort = sortFilter ? sortFilter.value : "default";

      if (query) {
        products = products.filter((p) => p.name.toLowerCase().includes(query));
      }

      if (category) {
        products = products.filter((p) => p.category === category);
      }

      switch (sort) {
        case "price-asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }

      renderProducts(products);
      normalizeHomeLinks(productGrid);
      applyNewTabLinks(productGrid);
    }

    if (searchInput) searchInput.addEventListener("input", filterAndSort);
    if (categoryFilter) categoryFilter.addEventListener("change", filterAndSort);
    if (sortFilter) sortFilter.addEventListener("change", filterAndSort);

    filterAndSort();
  }
})();
