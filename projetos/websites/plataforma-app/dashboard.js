// Dashboard Orbita - protótipo front-end
// Navegação, filtros, status, modal, relatórios, export e tema.

document.addEventListener("DOMContentLoaded", () => {
  setupSidebar();
  setupViewSwitcher();
  setupProjectFilters();
  setupTaskFilters();
  setupStatusCycle();
  setupModalDetails();
  setupReports();
  setupExports();
  setupConfig();
  ensureDefaultView();
});

function ensureDefaultView() {
  // Garante que apenas a primeira view fique ativa ao carregar
  const links = document.querySelectorAll(".nav-link");
  const views = document.querySelectorAll(".view");
  if (links.length && views.length) {
    links.forEach((l, idx) => l.classList.toggle("active", idx === 0));
    views.forEach((v, idx) => v.classList.toggle("view--active", idx === 0));
  }
}

function setupSidebar() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("sidebar-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

function setupViewSwitcher() {
  const links = document.querySelectorAll(".nav-link");
  const views = document.querySelectorAll(".view");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.dataset.view;
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      views.forEach((v) => v.classList.toggle("view--active", v.id === `view-${target}`));
    });
  });
}

function setupProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-proj");
  const cards = document.querySelectorAll(".project-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      cards.forEach((card) => {
        const status = card.dataset.status;
        card.style.display = filter === "all" || status === filter ? "grid" : "none";
      });
    });
  });
}

function setupTaskFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const rows = document.querySelectorAll(".table-row.clickable");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      rows.forEach((row) => {
        const status = row.dataset.status;
        row.style.display = filter === "all" || status === filter ? "grid" : "none";
      });
    });
  });
}

function setupStatusCycle() {
  const statuses = [
    { key: "ok", text: "Em dia", className: "success" },
    { key: "warn", text: "Atenção", className: "warning" },
    { key: "late", text: "Atrasado", className: "danger" },
  ];

  document.querySelectorAll(".status-toggle").forEach((pill) => {
    pill.addEventListener("click", (e) => {
      e.stopPropagation();
      const row = pill.closest(".table-row");
      const current = row?.dataset.status || "ok";
      const idx = statuses.findIndex((s) => s.key === current);
      const next = statuses[(idx + 1) % statuses.length];
      row.dataset.status = next.key;
      pill.textContent = next.text;
      pill.className = `pill ${next.className} status-toggle`;
    });
  });
}

function setupModalDetails() {
  const modal = document.getElementById("modal-detail");
  const closeBtn = document.getElementById("close-detail");
  const title = document.getElementById("detail-title");
  const desc = document.getElementById("detail-description");
  const squad = document.getElementById("detail-squad");
  const status = document.getElementById("detail-status");
  const priority = document.getElementById("detail-priority");
  const next = document.getElementById("detail-next");

  const openModal = (data) => {
    if (!modal) return;
    title.textContent = data.name || "Detalhes";
    desc.textContent = data.description || "Item fictício para demonstração.";
    squad.textContent = data.squad || "-";
    status.textContent = data.statusLabel || "-";
    priority.textContent = data.priority || "-";
    next.textContent = data.next || "-";
    modal.classList.add("open");
  };

  const closeModal = () => modal?.classList.remove("open");

  document.querySelectorAll(".table-row.clickable, .project-card.clickable").forEach((el) => {
    el.addEventListener("click", () => {
      const statusKey = el.dataset.status || "ok";
      const statusLabel = statusKey === "ok" ? "Em dia" : statusKey === "warn" ? "Atenção" : "Atrasado";
      openModal({
        name: el.dataset.name,
        squad: el.dataset.squad,
        statusLabel,
        priority: el.dataset.priority || "—",
        next: el.dataset.next || "—",
        description: el.dataset.description || "Item fictício para demonstração.",
      });
    });
  });

  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function setupReports() {
  const periodBtns = document.querySelectorAll(".filter-report");
  const focusBtns = document.querySelectorAll(".filter-focus");

  const barValues = {
    7: { A: 78, B: 64, C: 52, Ops: 85 },
    30: { A: 70, B: 58, C: 60, Ops: 80 },
    90: { A: 82, B: 73, C: 68, Ops: 88 },
  };

  const slaValues = {
    7: { sla: "97%", incidentes: "1", tempo: "1.2h" },
    30: { sla: "95%", incidentes: "3", tempo: "1.8h" },
    90: { sla: "93%", incidentes: "6", tempo: "2.1h" },
  };

  const updateReport = (period) => {
    document.querySelectorAll(".r-fill").forEach((bar) => {
      const squad = bar.dataset.squad;
      const pct = barValues[period][squad] || 0;
      bar.style.width = `${pct}%`;
    });
    document.querySelectorAll(".r-val").forEach((val) => {
      const squad = val.dataset.val;
      val.textContent = `${barValues[period][squad] || 0}%`;
    });
    document.querySelectorAll(".sla-val").forEach((el) => {
      const key = el.dataset.sla;
      el.textContent = slaValues[period][key] || "-";
    });
  };

  periodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      periodBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const period = btn.dataset.period;
      updateReport(period);
    });
  });

  focusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      focusBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  updateReport("7");
}

function setupExports() {
  const buttons = document.querySelectorAll(".export-btn");
  const msg = document.getElementById("export-msg");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      if (msg) {
        msg.textContent = `Exportação simulada (${type.toUpperCase()}). Como este é um protótipo, nenhum arquivo real é gerado.`;
      }
    });
  });
}

function setupConfig() {
  const saveBtn = document.getElementById("btn-save-cfg");
  const cfgMsg = document.getElementById("cfg-msg");
  const themeBtns = document.querySelectorAll(".theme-btn");

  saveBtn?.addEventListener("click", () => {
    if (cfgMsg) {
      cfgMsg.textContent = "Configurações salvas visualmente. Nenhum dado foi gravado de verdade.";
    }
  });

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      themeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (theme === "dark") {
        document.body.classList.add("theme-dark");
      } else {
        document.body.classList.remove("theme-dark");
      }
    });
  });
}
