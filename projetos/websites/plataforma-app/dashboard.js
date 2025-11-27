// Dashboard Orbita - protótipo front-end
// Controla navegação entre seções, filtros, ciclo de status e modal de detalhes.

document.addEventListener("DOMContentLoaded", () => {
  setupSidebar();
  setupViewSwitcher();
  setupProjectFilters();
  setupTaskFilters();
  setupStatusCycle();
  setupModalDetails();
});

function setupSidebar() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.querySelector(".sidebar-nav");
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
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      cards.forEach((card) => {
        const status = card.dataset.status;
        const shouldShow = filter === "all" || status === filter;
        card.style.display = shouldShow ? "grid" : "none";
      });
    });
  });
}

function setupTaskFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const rows = document.querySelectorAll(".table-row.clickable");
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      rows.forEach((row) => {
        const status = row.dataset.status;
        const show = filter === "all" || status === filter;
        row.style.display = show ? "grid" : "none";
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
