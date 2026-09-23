/* ============================================================
   EMMA MYERS — official site · shared interactions
   ============================================================ */

// ---- load veil ----
window.addEventListener("load", () => document.body.classList.add("loaded"));
// fallback in case load already fired or hangs
setTimeout(() => document.body.classList.add("loaded"), 1200);

// ---- cursor glow ----
(() => {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);
  let x = -500, y = -500, cx = x, cy = y;
  window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
  (function loop() {
    cx += (x - cx) * 0.09;
    cy += (y - cy) * 0.09;
    glow.style.transform = `translate(${cx - 230}px, ${cy - 230}px)`;
    requestAnimationFrame(loop);
  })();
})();

// ---- nav scrolled state ----
const nav = document.querySelector(".nav");
const onScrollNav = () => nav && nav.classList.toggle("scrolled", window.scrollY > 40);
onScrollNav();
window.addEventListener("scroll", onScrollNav, { passive: true });

// ---- mobile menu ----
const burger = document.querySelector(".burger");
const menu = document.querySelector(".mobile-menu");
if (burger && menu) {
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    burger.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.classList.remove("open");
      document.body.style.overflow = "";
    })
  );
}

// ---- reveal on scroll ----
const revealEls = document.querySelectorAll("[data-reveal]");
if (revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
}

// ---- animated counters ----
const counters = document.querySelectorAll("[data-count]");
if (counters.length) {
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        cio.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const dur = 1600;
        const t0 = performance.now();
        (function tick(t) {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => cio.observe(el));
}

// ---- parallax (hero bg + floating portraits) ----
const parallaxEls = document.querySelectorAll("[data-parallax]");
if (parallaxEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;
  const update = () => {
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
      el.style.transform = `translateY(${offset.toFixed(1)}px)`;
    });
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

// ---- 3D tilt cards ----
(() => {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    const strength = 7;
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateZ(6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

// ---- gallery / project filters ----
document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const btns = group.querySelectorAll(".filter");
  const scope = document.querySelector(group.dataset.filterGroup);
  if (!scope) return;
  btns.forEach((btn) =>
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      scope.querySelectorAll("[data-cat]").forEach((item) => {
        const show = f === "all" || item.dataset.cat.split(" ").includes(f);
        item.classList.toggle("hide", !show);
        if (show) {
          item.classList.remove("in");
          requestAnimationFrame(() => requestAnimationFrame(() => item.classList.add("in")));
        }
      });
    })
  );
});

// ---- lightbox ----
(() => {
  const triggers = [...document.querySelectorAll("[data-lightbox]")];
  if (!triggers.length) return;

  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-label", "Photo viewer");
  lb.innerHTML = `
    <button class="lb-btn lb-close" aria-label="Close">&#10005;</button>
    <button class="lb-btn lb-prev" aria-label="Previous photo">&#8592;</button>
    <img alt="">
    <button class="lb-btn lb-next" aria-label="Next photo">&#8594;</button>
    <p class="lb-cap"></p>`;
  document.body.appendChild(lb);

  const img = lb.querySelector("img");
  const cap = lb.querySelector(".lb-cap");
  let group = [];
  let idx = 0;

  const show = () => {
    const item = group[idx];
    img.src = item.dataset.full || item.querySelector("img").src;
    img.alt = item.querySelector("img").alt || "";
    cap.textContent = item.dataset.caption || "";
  };
  const open = (item) => {
    const key = item.dataset.lightbox || "default";
    group = triggers.filter((t) => (t.dataset.lightbox || "default") === key);
    idx = Math.max(0, group.indexOf(item));
    show();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  };
  const step = (dir) => {
    idx = (idx + dir + group.length) % group.length;
    show();
  };

  triggers.forEach((t) =>
    t.addEventListener("click", (e) => {
      e.preventDefault();
      open(t);
    })
  );
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => step(-1));
  lb.querySelector(".lb-next").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  window.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();

// ---- footer year ----
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
