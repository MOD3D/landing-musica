// Menú móvil, enlaces de WhatsApp y navegación activa.
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

  // Actualiza el número aquí antes de publicar. Formato internacional, solo dígitos.
  const WHATSAPP_NUMBER = "573227340025";
  const message = "Hola, quisiera información sobre las clases particulares de percusión en Barbosa.";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll(".whatsapp-link").forEach(link => {
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  // Resalta el enlace de navegación correspondiente a la sección visible.
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
