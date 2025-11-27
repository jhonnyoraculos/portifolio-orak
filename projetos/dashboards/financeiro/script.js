// Protótipo Dashboard Financeiro - ORAK

document.addEventListener("DOMContentLoaded", () => {
  setupSidebar();
  setupPeriodButtons();
  setupTableFilters();
  setupSorting();
  setupModal();
  populateAll("7d");
  setupReveal();
});

// Dados estáticos
const dadosKPIs = {
  "7d": { saldo: 128000, receita: 54000, despesa: 32000, resultado: 22000, vars: { saldo: 4.2, receita: 6.5, despesa: -3.1, resultado: 8.4 } },
  "30d": { saldo: 135000, receita: 210000, despesa: 168000, resultado: 42000, vars: { saldo: 5.5, receita: 7.1, despesa: -4.5, resultado: 9.3 } },
  "12m": { saldo: 182000, receita: 1950000, despesa: 1620000, resultado: 330000, vars: { saldo: 12.1, receita: 11.3, despesa: -8.2, resultado: 14.6 } },
};

const dadosFluxo = {
  "7d": [
    { label: "D-6", receita: 9, despesa: 6, saldo: 3 },
    { label: "D-5", receita: 8, despesa: 6.2, saldo: 2 },
    { label: "D-4", receita: 10, despesa: 7.5, saldo: 2.5 },
    { label: "D-3", receita: 12, despesa: 8, saldo: 4 },
    { label: "D-2", receita: 7, despesa: 5, saldo: 2 },
    { label: "D-1", receita: 9.5, despesa: 6.5, saldo: 3 },
    { label: "Hoje", receita: 11, despesa: 7, saldo: 4 },
  ],
  "30d": [
    { label: "S1", receita: 42, despesa: 35, saldo: 7 },
    { label: "S2", receita: 50, despesa: 39, saldo: 11 },
    { label: "S3", receita: 46, despesa: 38, saldo: 8 },
    { label: "S4", receita: 52, despesa: 40, saldo: 12 },
  ],
  "12m": [
    { label: "Q1", receita: 480, despesa: 420, saldo: 60 },
    { label: "Q2", receita: 520, despesa: 430, saldo: 90 },
    { label: "Q3", receita: 510, despesa: 440, saldo: 70 },
    { label: "Q4", receita: 520, despesa: 410, saldo: 110 },
  ],
};

const dadosCategorias = {
  "7d": [
    { categoria: "Vendas", receita: 22, despesa: 8 },
    { categoria: "Serviços", receita: 14, despesa: 6 },
    { categoria: "Assinaturas", receita: 10, despesa: 4 },
    { categoria: "Impostos", receita: 0, despesa: 9 },
    { categoria: "Operacional", receita: 0, despesa: 7 },
  ],
  "30d": [
    { categoria: "Vendas", receita: 80, despesa: 26 },
    { categoria: "Serviços", receita: 58, despesa: 24 },
    { categoria: "Assinaturas", receita: 42, despesa: 18 },
    { categoria: "Impostos", receita: 0, despesa: 32 },
    { categoria: "Operacional", receita: 0, despesa: 28 },
  ],
  "12m": [
    { categoria: "Vendas", receita: 320, despesa: 102 },
    { categoria: "Serviços", receita: 250, despesa: 98 },
    { categoria: "Assinaturas", receita: 180, despesa: 76 },
    { categoria: "Impostos", receita: 0, despesa: 140 },
    { categoria: "Operacional", receita: 0, despesa: 118 },
  ],
};

const tabelas = {
  "7d": [
    { data: "2025-02-10", tipo: "receita", categoria: "Vendas", descricao: "Pedido #5412", valor: 3500, status: "pago" },
    { data: "2025-02-10", tipo: "despesa", categoria: "Impostos", descricao: "DARF quinzenal", valor: -1800, status: "pago" },
    { data: "2025-02-11", tipo: "despesa", categoria: "Operacional", descricao: "Serviço de nuvem", valor: -950, status: "pendente" },
    { data: "2025-02-12", tipo: "receita", categoria: "Serviços", descricao: "Projeto UX cliente X", valor: 6200, status: "pago" },
    { data: "2025-02-12", tipo: "despesa", categoria: "Folha", descricao: "Pagamento freelancer", valor: -2100, status: "pago" },
    { data: "2025-02-13", tipo: "receita", categoria: "Assinaturas", descricao: "Billing mensal SaaS", valor: 2800, status: "pago" },
    { data: "2025-02-13", tipo: "despesa", categoria: "Operacional", descricao: "Infra + CDN", valor: -1200, status: "pago" },
  ],
  "30d": [
    { data: "2025-01-18", tipo: "receita", categoria: "Vendas", descricao: "Contrato anual Y", valor: 18000, status: "pago" },
    { data: "2025-01-20", tipo: "despesa", categoria: "Impostos", descricao: "IRPJ", valor: -7200, status: "pago" },
    { data: "2025-01-21", tipo: "receita", categoria: "Serviços", descricao: "Consultoria Ops", valor: 9400, status: "pago" },
    { data: "2025-01-24", tipo: "despesa", categoria: "Operacional", descricao: "Licenças SaaS", valor: -3100, status: "pendente" },
    { data: "2025-01-27", tipo: "despesa", categoria: "Folha", descricao: "Pagamento equipe", valor: -21500, status: "pago" },
    { data: "2025-02-02", tipo: "receita", categoria: "Assinaturas", descricao: "Renovações plano Pro", valor: 12800, status: "pago" },
    { data: "2025-02-05", tipo: "despesa", categoria: "Impostos", descricao: "ISS mensal", valor: -2600, status: "pago" },
  ],
  "12m": [
    { data: "2024-03-10", tipo: "receita", categoria: "Vendas", descricao: "Contrato enterprise", valor: 54000, status: "pago" },
    { data: "2024-04-02", tipo: "despesa", categoria: "Impostos", descricao: "IR trimestral", valor: -18000, status: "pago" },
    { data: "2024-05-12", tipo: "receita", categoria: "Serviços", descricao: "Projeto mobile", valor: 36000, status: "pago" },
    { data: "2024-06-01", tipo: "despesa", categoria: "Operacional", descricao: "Infraestrutura anual", valor: -12000, status: "pago" },
    { data: "2024-08-20", tipo: "receita", categoria: "Assinaturas", descricao: "Planos anuais", valor: 48000, status: "pago" },
    { data: "2024-10-05", tipo: "despesa", categoria: "Folha", descricao: "Bônus equipes", valor: -35000, status: "pago" },
    { data: "2024-12-15", tipo: "despesa", categoria: "Impostos", descricao: "Encargos 13º", valor: -9000, status: "pago" },
  ],
};

let currentPeriod = "7d";
let sortConfig = { key: null, asc: true };

function setupSidebar() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("sidebar-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
  const links = document.querySelectorAll(".nav-link");
  const label = document.getElementById("section-label");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      if (label) label.textContent = link.textContent + " (apenas visual)";
    });
  });
}

function setupPeriodButtons() {
  const buttons = document.querySelectorAll(".period-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentPeriod = btn.dataset.period;
      populateAll(currentPeriod);
    });
  });
}

function populateAll(period) {
  updateKPIs(period);
  renderFluxo(period);
  renderCategorias(period);
  renderTabela(period);
  revealOnLoad();
}

function updateKPIs(period) {
  const data = dadosKPIs[period];
  countUp("kpi-saldo", data.saldo);
  countUp("kpi-receita", data.receita);
  countUp("kpi-despesa", data.despesa);
  countUp("kpi-resultado", data.resultado);

  setVar("var-saldo", data.vars.saldo);
  setVar("var-receita", data.vars.receita);
  setVar("var-despesa", data.vars.despesa);
  setVar("var-resultado", data.vars.resultado);
}

function setVar(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = `${val > 0 ? "▲" : "▼"} ${Math.abs(val).toFixed(1)}%`;
  el.className = "var " + (val >= 0 ? "positive" : "negative");
}

function countUp(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 800;
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = start + (value - start) * progress;
    el.textContent = formatCurrency(current);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function formatCurrency(val) {
  const sign = val < 0 ? "-" : "";
  const num = Math.abs(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  return sign + num;
}

function renderFluxo(period) {
  const area = document.getElementById("fluxo-area");
  if (!area) return;
  const data = dadosFluxo[period];
  area.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("div");
    row.className = "chart-row";
    const label = document.createElement("span");
    label.textContent = item.label;
    label.className = "muted";
    const income = document.createElement("div");
    income.className = "line income";
    income.style.width = `${item.receita * 6}%`;
    const expense = document.createElement("div");
    expense.className = "line expense";
    expense.style.width = `${item.despesa * 6}%`;
    const balance = document.createElement("div");
    balance.className = "line balance";
    balance.style.width = `${item.saldo * 10}%`;
    row.append(label, income, expense, balance);
    area.appendChild(row);
  });
}

function renderCategorias(period) {
  const wrap = document.getElementById("bars-categorias");
  if (!wrap) return;
  wrap.innerHTML = "";
  dadosCategorias[period].forEach((item) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    const label = document.createElement("div");
    label.className = "bar-label";
    label.innerHTML = `<span>${item.categoria}</span><span class="muted">${formatSimple(item.receita)} / ${formatSimple(item.despesa)}</span>`;
    const barReceita = document.createElement("div");
    barReceita.className = "bar";
    const fillR = document.createElement("div");
    fillR.className = "fill";
    fillR.style.width = "0%";
    requestAnimationFrame(() => (fillR.style.width = `${item.receita}%`));
    barReceita.append(fillR);

    const barDespesa = document.createElement("div");
    barDespesa.className = "bar expense";
    const fillD = document.createElement("div");
    fillD.className = "fill";
    fillD.style.width = "0%";
    requestAnimationFrame(() => (fillD.style.width = `${item.despesa}%`));
    barDespesa.append(fillD);

    row.append(barReceita, barDespesa, label);
    wrap.appendChild(row);
  });
}

function formatSimple(val) {
  return `R$ ${val.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

function renderTabela(period) {
  const body = document.getElementById("table-body");
  if (!body) return;
  const data = tabelas[period];
  body.innerHTML = "";
  data.forEach((item) => {
    const tr = document.createElement("tr");
    tr.dataset.tipo = item.tipo;
    tr.dataset.status = item.status;
    tr.innerHTML = `
      <td>${formatDate(item.data)}</td>
      <td>${capitalize(item.tipo)}</td>
      <td>${item.categoria}</td>
      <td>${item.descricao}</td>
      <td class="${item.valor >= 0 ? "pos" : "neg"}">${formatCurrency(item.valor)}</td>
      <td>${statusPill(item.status)}</td>
    `;
    tr.addEventListener("click", () => openModal(item));
    body.appendChild(tr);
  });
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function statusPill(status) {
  const map = { pago: "success", pendente: "warning", atrasado: "danger" };
  const cls = map[status] || "neutral";
  const label = status === "pago" ? "Pago" : status === "pendente" ? "Pendente" : "Atrasado";
  return `<span class="pill ${cls}">${label}</span>`;
}

function setupTableFilters() {
  const tipoBtns = document.querySelectorAll("#tipo-filter .chip");
  const statusBtns = document.querySelectorAll("#status-filter .chip");
  const search = document.getElementById("search");

  tipoBtns.forEach((btn) => btn.addEventListener("click", () => toggleFilter(tipoBtns, btn, "tipo")));
  statusBtns.forEach((btn) => btn.addEventListener("click", () => toggleFilter(statusBtns, btn, "status")));
  search?.addEventListener("input", applyFilters);
}

function toggleFilter(btns, btn, key) {
  btns.forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  applyFilters();
}

function applyFilters() {
  const tipo = document.querySelector("#tipo-filter .chip.active")?.dataset.tipo || "todos";
  const status = document.querySelector("#status-filter .chip.active")?.dataset.status || "todos";
  const term = (document.getElementById("search")?.value || "").toLowerCase();
  const rows = document.querySelectorAll("#table-body tr");
  rows.forEach((row) => {
    const matchTipo = tipo === "todos" || row.dataset.tipo === tipo;
    const matchStatus = status === "todos" || row.dataset.status === status;
    const matchSearch = term === "" || row.children[3].textContent.toLowerCase().includes(term);
    const show = matchTipo && matchStatus && matchSearch;
    row.style.display = show ? "table-row" : "none";
  });
}

function setupSorting() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      const asc = sortConfig.key === key ? !sortConfig.asc : true;
      sortConfig = { key, asc };
      sortTable(key, asc);
    });
  });
}

function sortTable(key, asc) {
  const tbody = document.getElementById("table-body");
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.sort((a, b) => {
    if (key === "data") {
      return asc ? a.cells[0].textContent.localeCompare(b.cells[0].textContent) : b.cells[0].textContent.localeCompare(a.cells[0].textContent);
    }
    if (key === "valor") {
      const va = parseFloat(a.cells[4].textContent.replace(/[^\d,-]/g, "").replace(",", "."));
      const vb = parseFloat(b.cells[4].textContent.replace(/[^\d,-]/g, "").replace(",", "."));
      return asc ? va - vb : vb - va;
    }
    return 0;
  });
  rows.forEach((r) => tbody.appendChild(r));
}

function setupModal() {
  const close = document.getElementById("close-modal");
  const backdrop = document.getElementById("modal");
  close?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
}

function openModal(item) {
  document.getElementById("modal-title").textContent = item.descricao;
  document.getElementById("modal-desc").textContent = `Categoria: ${item.categoria}`;
  document.getElementById("modal-data").textContent = formatDate(item.data);
  document.getElementById("modal-tipo").textContent = capitalize(item.tipo);
  document.getElementById("modal-categoria").textContent = item.categoria;
  document.getElementById("modal-status").textContent = capitalize(item.status);
  document.getElementById("modal-valor").textContent = formatCurrency(item.valor);
  document.getElementById("modal").classList.add("open");
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
}

function setupReveal() {
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
  document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));
}

function revealOnLoad() {
  document.querySelectorAll(".hidden").forEach((el) => {
    el.classList.remove("visible");
    requestAnimationFrame(() => el.classList.add("visible"));
  });
}
