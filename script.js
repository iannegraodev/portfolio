/* =========================================================
   CONFIGURAÇÕES — troque pelos seus dados reais
========================================================= */

// Número de WhatsApp no formato: código do país + DDD + número (só números, sem espaço/traço)
const WHATSAPP_NUMBER = "5518996751579";

/* =========================================================
   PROJETOS — edite/adicione aqui. Cada item vira um card.
   link: null => mostra card "em breve" (não clicável)
========================================================= */
const PROJECTS = [
  {
    title: "Vini Motors",
    description: "Site institucional para loja de veículos, com catálogo, destaque de estoque e contato direto via WhatsApp.",
    image: "assets/vinimotors-logo.jpg",
    thumbType: "logo",
    link: "https://vini-motors-site.vercel.app/",
  },
  {
    title: "Urso Branco Refrigeração",
    description: "Landing page para distribuidora de peças e equipamentos de refrigeração com mais de 30 anos de mercado e 3 lojas físicas.",
    image: "assets/ursobranco-fachada.jpg",
    thumbType: "photo",
    link: "https://urso-branco-site.vercel.app/",
  },
];

/* =========================================================
   RENDERIZA OS CARDS DE PROJETO
========================================================= */
function renderProjects(){
  const grid = document.getElementById("projetos-grid");
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((project) => {
    const thumb = project.image
      ? `<img src="${project.image}" alt="${project.title}" loading="lazy">`
      : `<span class="project-thumb-placeholder">Em breve</span>`;

    const badge = !project.link ? `<span class="project-badge">Em breve</span>` : "";
    const cta = project.link ? `<span class="project-cta">Ver caso completo →</span>` : "";
    const disabledClass = project.link ? "" : " is-disabled";
    const thumbTypeClass = project.thumbType === "photo" ? " project-thumb--photo" : "";

    const inner = `
      <div class="project-thumb${thumbTypeClass}">${thumb}</div>
      <div class="project-body">
        ${badge}
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        ${cta}
      </div>
    `;

    return project.link
      ? `<a class="project-card${disabledClass}" href="${project.link}" target="_blank" rel="noopener">${inner}</a>`
      : `<div class="project-card${disabledClass}">${inner}</div>`;
  }).join("");
}

/* =========================================================
   TÍTULO DO HERO — anima palavra por palavra
========================================================= */
function renderHeroTitle(){
  const el = document.getElementById("hero-title");
  if (!el) return;

  const text = "Seu projeto saindo do papel em semanas, não meses";
  const words = text.split(" ");

  el.innerHTML = words
    .map((word, i) => `<span class="word" style="animation-delay:${(i * 0.09 + 0.15).toFixed(2)}s">${word}</span>`)
    .join(" ");
}

/* =========================================================
   FADE-IN DAS SEÇÕES AO ROLAR A PÁGINA
========================================================= */
function initScrollReveal(){
  const items = document.querySelectorAll(".fade-in");
  if (!("IntersectionObserver" in window) || items.length === 0){
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

/* =========================================================
   MENU MOBILE
========================================================= */
function initNavToggle(){
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.classList.toggle("is-active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================================
   BOTÃO "ROLE PARA EXPLORAR"
========================================================= */
function initScrollExplore(){
  const btn = document.getElementById("scroll-explore");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.getElementById("prova-social")?.scrollIntoView({ behavior: "smooth" });
  });
}

/* =========================================================
   CTAs DE WHATSAPP — monta o link wa.me com a mensagem de cada botão
========================================================= */
function initWhatsappCtas(){
  document.querySelectorAll(".js-whatsapp-cta").forEach((el) => {
    const message = el.getAttribute("data-wa-text") || "Olá!";
    el.setAttribute(
      "href",
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    );
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

/* =========================================================
   FORMULÁRIO DE CONTATO
   Por padrão, redireciona pro WhatsApp com os dados preenchidos.

   Para receber por E-MAIL em vez disso, duas opções simples:
   1) Formspree: troque o <form> para
      <form action="https://formspree.io/f/SEU_ID" method="POST"> e remova este handler.
   2) EmailJS: inclua o SDK deles e chame emailjs.sendForm(...) aqui dentro do handler.
========================================================= */
function initContactForm(){
  const form = document.getElementById("contato-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nome = data.get("nome");
    const email = data.get("email");
    const mensagem = data.get("mensagem");

    const text = `Olá! Meu nome é ${nome} (${email}).\n\n${mensagem}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    form.reset();
  });
}

/* =========================================================
   EFEITO VISUAL DO HERO — grade de pontos que reage ao mouse
   (versão leve em Canvas 2D, sem bibliotecas 3D)
========================================================= */
function initHeroCanvas(){
  const canvas = document.getElementById("hero-canvas");
  const hero = document.getElementById("hero");
  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pointer = { x: -9999, y: -9999 };
  const spacing = 30;

  function resize(){
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawStatic(){
    ctx.clearRect(0, 0, width, height);
    for (let y = spacing / 2; y < height; y += spacing){
      for (let x = spacing / 2; x < width; x += spacing){
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fill();
      }
    }
  }

  function draw(time){
    ctx.clearRect(0, 0, width, height);
    for (let y = spacing / 2; y < height; y += spacing){
      for (let x = spacing / 2; x < width; x += spacing){
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 220);
        const pulse = (Math.sin(time * 0.0006 + x * 0.01 + y * 0.01) + 1) / 2 * 0.12;
        const alpha = Math.min(0.9, 0.06 + proximity * 0.55 + pulse);
        const radius = 1 + proximity * 1.6;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion){
    drawStatic();
    return;
  }

  requestAnimationFrame(draw);

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });
  hero.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });
}

/* =========================================================
   INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderHeroTitle();
  renderProjects();
  initWhatsappCtas();
  initHeroCanvas();
  initScrollReveal();
  initNavToggle();
  initScrollExplore();
  initContactForm();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
