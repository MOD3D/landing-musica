(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const copyrightYear = document.getElementById("copyright-year");
  if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());

  const header = document.querySelector(".site-header");
  if (header) {
    const SCROLL_THRESHOLD = 24;
    let ticking = false;
    const updateHeaderState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    }, { passive: true });
    updateHeaderState();
  }

  const WHATSAPP_NUMBER = "573227340025";
  const defaultMessage = "Hola, quisiera información sobre las clases particulares de percusión en Barbosa.";
  const buildWhatsappUrl = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  document.querySelectorAll(".whatsapp-link").forEach(link => {
    link.href = buildWhatsappUrl(link.dataset.waMessage || defaultMessage);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const nombre = String(data.get("nombre") || "").trim();
      const instrumento = String(data.get("instrumento") || "");
      const publico = String(data.get("publico") || "");
      const horario = String(data.get("horario") || "").trim();
      const mensaje = String(data.get("mensaje") || "").trim();

      let text = `Hola, soy ${nombre}. Me interesa una clase de ${instrumento} para ${publico}.`;
      if (horario) text += ` Horario preferido: ${horario}.`;
      if (mensaje) text += ` ${mensaje}`;

      window.open(buildWhatsappUrl(text), "_blank", "noopener,noreferrer");
    });
  }

  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const slides = [...carousel.querySelectorAll(".hero-slide")];
    const dots = [...carousel.querySelectorAll(".hero-dot")];
    const prevBtn = carousel.querySelector(".hero-prev");
    const nextBtn = carousel.querySelector(".hero-next");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = slides.length;
    let current = Math.max(slides.findIndex(slide => slide.classList.contains("is-active")), 0);
    let timer = null;

    // Cada slide se ubica a -100%/0%/100% según su posición relativa a la activa,
    // así el cambio de slide se ve como un desplazamiento horizontal real.
    const render = instantIndexes => {
      slides.forEach((slide, i) => {
        const offset = ((i - current) % total + total) % total;
        const pos = offset === 0 ? 0 : offset === 1 ? 1 : -1;
        const isActive = offset === 0;
        slide.classList.toggle("is-active", isActive);
        slide.toggleAttribute("inert", !isActive);
        if (instantIndexes.has(i)) slide.classList.add("no-transition");
        slide.style.transform = `translateX(${pos * 100}%)`;
      });
      if (instantIndexes.size) {
        void carousel.offsetWidth;
        instantIndexes.forEach(i => slides[i].classList.remove("no-transition"));
      }
      dots.forEach((dot, i) => {
        const isActive = i === current;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });
    };

    const goTo = (index, direction) => {
      const nextIndex = ((index % total) + total) % total;
      if (nextIndex === current) return;
      if (direction === undefined) {
        direction = (nextIndex - current + total) % total === 1 ? 1 : -1;
      }
      // La única slide que no participa de esta transición salta sin animar,
      // directo al costado opuesto, lista para la próxima vez.
      const jumpIndex = direction === 1 ? (current - 1 + total) % total : (current + 1) % total;
      current = nextIndex;
      render(new Set([jumpIndex]));
    };

    const next = () => goTo(current + 1, 1);
    const prev = () => goTo(current - 1, -1);

    const stopAutoplay = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const startAutoplay = () => {
      if (reduceMotion || total < 2) return;
      stopAutoplay();
      timer = setInterval(next, 6500);
    };

    prevBtn?.addEventListener("click", () => { prev(); startAutoplay(); });
    nextBtn?.addEventListener("click", () => { next(); startAutoplay(); });
    dots.forEach((dot, index) => dot.addEventListener("click", () => { goTo(index); startAutoplay(); }));

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    let touchStartX = 0;
    carousel.addEventListener("touchstart", event => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener("touchend", event => {
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) {
        delta < 0 ? next() : prev();
        startAutoplay();
      }
    }, { passive: true });

    render(new Set(slides.map((_, i) => i)));
    startAutoplay();
  }

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });

    sections.forEach(section => observer.observe(section));
  }
})();
