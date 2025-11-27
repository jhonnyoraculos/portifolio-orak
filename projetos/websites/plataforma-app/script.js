// Protótipo interativo leve para a landing Orbita.
// Apenas front-end: modais, tabs, toggle de planos, FAQ e scroll reveal.

document.addEventListener("DOMContentLoaded", () => {
  setupModal();
  setupTabs();
  setupBillingToggle();
  setupFAQ();
  setupReveal();
});

function setupModal() {
  const openBtn = document.getElementById("open-modal");
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close-modal");
  const form = document.getElementById("login-form");
  const msg = document.getElementById("login-msg");

  if (!openBtn || !modal || !closeBtn || !form || !msg) return;

  openBtn.addEventListener("click", () => {
    modal.classList.add("open");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    msg.textContent = "";
    form.reset();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
      msg.textContent = "";
      form.reset();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector("input[type='email']");
    const password = form.querySelector("input[type='password']");
    const emailVal = email?.value.trim();
    const passVal = password?.value.trim();

    if (!emailVal || !passVal) {
      msg.textContent = "Preencha e-mail e senha para continuar (simulado).";
      msg.style.color = "#b91c1c";
      return;
    }

    msg.textContent = "";
    modal.classList.remove("open");
    form.reset();
    // Redireciona para o painel fictício
    window.location.href = "dashboard.html";
  });
}

function setupTabs() {
  const tabs = document.querySelectorAll("#tabs .tab");
  const title = document.getElementById("tab-title");
  const data = {
    equipe: {
      bars: [60, 80, 45, 90, 70],
      rows: [
        { tag: "Em dia", cls: "success", label: "Sprint Equipe A", pill: "92%" },
        { tag: "Atenção", cls: "warning", label: "Suporte · SLA", pill: "68%" },
        { tag: "Planejamento", cls: "neutral", label: "Q4 Roadmap", pill: "Em revisão" },
      ],
    },
    projetos: {
      bars: [75, 55, 88, 64, 72],
      rows: [
        { tag: "Entregue", cls: "success", label: "Release Mobile", pill: "100%" },
        { tag: "Em curso", cls: "neutral", label: "Portal Analytics", pill: "72%" },
        { tag: "Risco", cls: "warning", label: "Migração Cloud", pill: "54%" },
      ],
    },
    sprints: {
      bars: [50, 65, 70, 85, 95],
      rows: [
        { tag: "Em dia", cls: "success", label: "Sprint 24", pill: "85%" },
        { tag: "Revisão", cls: "neutral", label: "Débitos técnicos", pill: "Em triagem" },
        { tag: "Atenção", cls: "warning", label: "SLA backlog", pill: "60%" },
      ],
    },
  };

  if (!tabs.length || !title) return;

  const bars = [1, 2, 3, 4, 5].map((i) => document.getElementById(`bar${i}`));
  const rows = [1, 2, 3].map((i) => ({
    tag: document.getElementById(`row${i}-tag`),
    label: document.getElementById(`row${i}-label`),
    pill: document.getElementById(`row${i}-pill`),
  }));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.tab;
      if (!data[key]) return;
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      title.textContent = tab.textContent;
      data[key].bars.forEach((height, idx) => {
        if (bars[idx]) bars[idx].style.height = `${height}%`;
      });
      data[key].rows.forEach((rowData, idx) => {
        if (!rows[idx]) return;
        rows[idx].tag.textContent = rowData.tag;
        rows[idx].tag.className = `tag ${rowData.cls}`;
        rows[idx].label.textContent = rowData.label;
        rows[idx].pill.textContent = rowData.pill;
      });
    });
  });
}

function setupBillingToggle() {
  const buttons = document.querySelectorAll(".toggle-btn");
  const prices = {
    mensal: {
      starter: "R$ 49/mês",
      pro: "R$ 129/mês",
      enterprise: "Sob consulta",
      saving: "",
    },
    anual: {
      starter: "R$ 39/mês",
      pro: "R$ 109/mês",
      enterprise: "Sob consulta",
      saving: "Economize 15% no plano anual",
    },
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.billing;
      updatePrices(prices[mode]);
    });
  });

  updatePrices(prices.mensal);
}

function updatePrices(priceSet) {
  const plans = ["starter", "pro", "enterprise"];
  plans.forEach((plan) => {
    const priceEl = document.querySelector(`[data-plan='${plan}']`);
    const savingEl = document.querySelector(`[data-saving='${plan}']`);
    if (priceEl) priceEl.textContent = priceSet[plan];
    if (savingEl) savingEl.textContent = priceSet.saving || "";
  });
}

function setupFAQ() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });
}

function setupReveal() {
  const revealEls = document.querySelectorAll(".hidden");
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
}
