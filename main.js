(function () {
  "use strict";

  const AFFILIATE =
    (window.SITE_CONFIG && window.SITE_CONFIG.affiliate) ||
    "https://oopbuy.com/register?inviteCode=YOUR_CODE";

  const OPEN_IN_NEW_TAB =
    !window.SITE_CONFIG || window.SITE_CONFIG.openInNewTab !== false;

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
      productGrid.innerHTML = products
        .map(
          (p) => `<a href="${AFFILIATE}" class="product-card" target="_blank" rel="noopener noreferrer" data-name="${p.name.toLowerCase()}">
            <img src="${p.image}" alt="${p.name} — OopBuy Spreadsheet" class="product-image" loading="lazy" width="400" height="400">
            <div class="product-body">
              <div class="product-options">${p.options} OPTIONS</div>
              <h3 class="product-name">${p.name}</h3>
              <div class="product-price">¥${p.price}</div>
            </div>
          </a>`
        )
        .join("");

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
