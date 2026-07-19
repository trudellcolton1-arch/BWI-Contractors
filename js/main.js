/* ═══════════════════════════════════════════════════════════
   BWI CONTRACTORS — interaction layer
   Vanilla JS. No dependencies. Everything degrades gracefully.
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Preloader ─────────────────────────────────────── */
  const preloader = document.getElementById("preloader");
  const fill = document.getElementById("preloaderFill");
  const pct = document.getElementById("preloaderPct");

  const finishPreload = () => {
    fill.style.width = "100%";
    pct.textContent = "100%";
    setTimeout(() => preloader.classList.add("done"), 350);
  };

  if (prefersReducedMotion) {
    preloader.classList.add("done");
  } else {
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(progress + Math.random() * 22, 96);
      fill.style.width = progress + "%";
      pct.textContent = Math.round(progress) + "%";
    }, 120);

    const done = () => { clearInterval(timer); finishPreload(); };
    if (document.readyState === "complete") setTimeout(done, 500);
    else window.addEventListener("load", () => setTimeout(done, 400));
    setTimeout(done, 2600); // hard cap — never trap the visitor
  }

  /* ── Custom cursor ─────────────────────────────────── */
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer && !prefersReducedMotion) {
    let mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursor.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      ring.classList.toggle("is-hover", !!t && t.dataset.cursor === "hover");
      const isView = !!t && t.dataset.cursor === "view";
      ring.classList.toggle("is-view", isView);
      if (isView) ring.setAttribute("data-label", "VIEW");
    });
  }

  /* ── Scroll progress + nav state ───────────────────── */
  const progressBar = document.getElementById("progressBar");
  const nav = document.getElementById("nav");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ───────────────────────────────────── */
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  /* ── Active section highlighting ───────────────────── */
  const sections = [...document.querySelectorAll("section[id]")];
  const linkFor = (id) => navLinks.querySelector(`a[href="#${id}"]`);

  const sectionSpy = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (link) link.classList.toggle("is-active", entry.isIntersecting);
      }),
    { rootMargin: "-45% 0px -45% 0px" }
  );
  sections.forEach((s) => sectionSpy.observe(s));

  /* ── Scroll reveals (staggered) ────────────────────── */
  const revealables = document.querySelectorAll(".reveal, .reveal-line, .section__head, .about__cards, .process__steps");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // stagger children inside grouped containers
        const group = el.matches(".about__cards, .process__steps")
          ? [...el.children]
          : [el];
        group.forEach((child, i) =>
          setTimeout(() => child.classList.add("in-view"), i * 110)
        );
        el.classList.add("in-view");
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.18 }
  );
  revealables.forEach((el) => revealObserver.observe(el));

  /* ── Animated counters ─────────────────────────────── */
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1600;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(step);
        };
        prefersReducedMotion ? (el.textContent = target) : requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* ── Services accordion ────────────────────────────── */
  document.querySelectorAll(".service").forEach((item) => {
    const row = item.querySelector(".service__row");
    row.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".service.is-open").forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".service__row").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        row.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ── Tilt cards ────────────────────────────────────── */
  if (finePointer && !prefersReducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(700px) rotateX(${-py * 7}deg) rotateY(${px * 7}deg) translateY(-2px)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  /* ── Magnetic buttons ──────────────────────────────── */
  if (finePointer && !prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.translate = `${x * 0.18}px ${y * 0.28}px`;
      });
      el.addEventListener("mouseleave", () => (el.style.translate = ""));
    });
  }

  /* ── Horizontal work gallery (scroll-driven) ───────── */
  const work = document.getElementById("work");
  const track = document.getElementById("workTrack");

  const sizeWork = () => {
    const overflow = track.scrollWidth - window.innerWidth;
    if (overflow > 0 && window.innerWidth > 700 && !prefersReducedMotion) {
      work.style.height = window.innerHeight + overflow + "px";
      return overflow;
    }
    work.style.height = "";
    track.style.transform = "";
    track.style.overflowX = "auto";
    return 0;
  };

  let workOverflow = sizeWork();
  window.addEventListener("resize", () => { workOverflow = sizeWork(); }, { passive: true });

  window.addEventListener(
    "scroll",
    () => {
      if (workOverflow <= 0) return;
      const rect = work.getBoundingClientRect();
      const total = work.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      track.style.transform = `translateX(${-progress * workOverflow}px)`;
    },
    { passive: true }
  );

  /* ── Hero canvas: drifting constellation grid ──────── */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, dots = [];
    let pointer = { x: -1e4, y: -1e4 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((w * h) / 22000), 90);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    canvas.parentElement.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    }, { passive: true });
    canvas.parentElement.addEventListener("mouseleave", () => {
      pointer.x = pointer.y = -1e4;
    });

    let visible = true;
    new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
      .observe(canvas);

    const drawFrame = () => {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (const d of dots) {
          d.x += d.vx; d.y += d.vy;
          if (d.x < 0 || d.x > w) d.vx *= -1;
          if (d.y < 0 || d.y > h) d.vy *= -1;

          const distP = Math.hypot(d.x - pointer.x, d.y - pointer.y);
          const near = distP < 160;
          ctx.fillStyle = near ? "rgba(255,92,31,.75)" : "rgba(242,239,233,.25)";
          ctx.beginPath();
          ctx.arc(d.x, d.y, near ? 2 : 1.3, 0, Math.PI * 2);
          ctx.fill();

          if (near) {
            ctx.strokeStyle = `rgba(255,92,31,${(1 - distP / 160) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawFrame);
    };
    drawFrame();
  }

  /* ── Contact form (no backend — routes to a call) ──── */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    if (!name || !phone) {
      note.textContent = "PLEASE ADD YOUR NAME AND PHONE SO WE CAN CALL YOU BACK.";
      return;
    }
    note.textContent = "THANKS " + name.toUpperCase() + " — TAP TO CALL US NOW: (817) 618-3002";
    window.location.href = "tel:+18176183002";
  });

  /* ── Footer year ───────────────────────────────────── */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
