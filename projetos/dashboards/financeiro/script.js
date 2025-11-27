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

let revenueRendered = false;
let expensesRendered = false;
let cashflowRendered = false;
let goalsRendered = false;

// Navegação de views
function setupSidebar() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("sidebar-nav");
  const items = document.querySelectorAll(".sidebar-item");
  const views = document.querySelectorAll(".view");
  const label = document.getElementById("section-label");

  if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));

  const activate = (view) => {
    items.forEach((i) => i.classList.toggle("is-active", i.dataset.view === view));
    views.forEach((v) => v.classList.toggle("view--active", v.dataset.view === view));
    if (label) label.textContent = view === "overview" ? "Visão geral" : view;
    if (view === "revenue" && !revenueRendered) {
      renderGraficoLinhaReceita(dadosReceita.mensal);
      renderGraficoBarrasReceita(dadosReceita.porCanal);
      renderGraficoPizzaReceita(dadosReceita.porCategoria);
      revenueRendered = true;
    }
    if (view === "expenses" && !expensesRendered) {
      renderGraficoEmpilhadoDespesas(dadosDespesas.mensal);
      renderGraficoPizzaDespesas(dadosDespesas.porCategoria);
      renderResumoDespesas(dadosDespesas.resumo);
      expensesRendered = true;
    }
    if (view === "cashflow" && !cashflowRendered) {
      renderLinhaFluxoCaixa(dadosFluxoCaixa);
      renderBarrasSaldoSemanal(dadosFluxoCaixa);
      renderResumoFluxoCaixa(dadosFluxoCaixa);
      cashflowRendered = true;
    }
    if (view === "goals" && !goalsRendered) {
      renderMetasRadiais(dadosMetas.principais);
      renderTimelineMetas(dadosMetas.timeline);
      renderTabelaMetas(dadosMetas.secundarias);
      goalsRendered = true;
    }
  };

  items.forEach((item) =>
    item.addEventListener("click", () => {
      activate(item.dataset.view);
    })
  );
  activate("overview");
}

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

const dadosReceita = {
  mensal: [
    { mes: "Jan", valor: 120 },
    { mes: "Fev", valor: 140 },
    { mes: "Mar", valor: 135 },
    { mes: "Abr", valor: 150 },
    { mes: "Mai", valor: 160 },
    { mes: "Jun", valor: 170 },
    { mes: "Jul", valor: 165 },
    { mes: "Ago", valor: 180 },
    { mes: "Set", valor: 175 },
    { mes: "Out", valor: 190 },
    { mes: "Nov", valor: 210 },
    { mes: "Dez", valor: 230 },
  ],
  porCanal: [
    { canal: "Loja Física", valor: 180 },
    { canal: "E-commerce", valor: 230 },
    { canal: "B2B", valor: 140 },
    { canal: "Assinaturas", valor: 120 },
  ],
  porCategoria: [
    { categoria: "Produtos", percentual: 45 },
    { categoria: "Serviços", percentual: 28 },
    { categoria: "Licenças", percentual: 18 },
    { categoria: "Outros", percentual: 9 },
  ],
};

const dadosDespesas = {
  mensal: [
    { mes: "Jan", fixas: 40, variaveis: 20 },
    { mes: "Fev", fixas: 42, variaveis: 22 },
    { mes: "Mar", fixas: 44, variaveis: 26 },
    { mes: "Abr", fixas: 46, variaveis: 28 },
    { mes: "Mai", fixas: 48, variaveis: 30 },
    { mes: "Jun", fixas: 50, variaveis: 32 },
  ],
  porCategoria: [
    { categoria: "Operacional", percentual: 30 },
    { categoria: "Marketing", percentual: 18 },
    { categoria: "Pessoal", percentual: 28 },
    { categoria: "Impostos", percentual: 14 },
    { categoria: "Outros", percentual: 10 },
  ],
  resumo: {
    total: 118000,
    variacao: -4.2,
    top: ["Operacional", "Pessoal", "Marketing"],
  },
};

const dadosFluxoCaixa = [
  { semana: "S1", entradas: 50, saidas: 42, saldo: 8 },
  { semana: "S2", entradas: 54, saidas: 48, saldo: 6 },
  { semana: "S3", entradas: 60, saidas: 52, saldo: 8 },
  { semana: "S4", entradas: 58, saidas: 65, saldo: -7 },
  { semana: "S5", entradas: 62, saidas: 50, saldo: 12 },
];

const dadosMetas = {
  principais: [
    { nome: "Receita anual", percentual: 78 },
    { nome: "Margem", percentual: 64 },
    { nome: "Reserva", percentual: 52 },
  ],
  timeline: [
    { etapa: "Q1", status: "ok", descricao: "Atingiu 95% da meta do trimestre." },
    { etapa: "Q2", status: "ok", descricao: "Margem dentro do esperado." },
    { etapa: "Q3", status: "late", descricao: "Atraso em metas de custo." },
    { etapa: "Q4", status: "pending", descricao: "Em andamento." },
  ],
  secundarias: [
    { meta: "Reduzir CAC", responsavel: "Growth", status: "Em andamento", prazo: "Mar" },
    { meta: "Automação fiscal", responsavel: "Financeiro", status: "Concluído", prazo: "Jan" },
    { meta: "Reserva 6 meses", responsavel: "CFO", status: "Atrasado", prazo: "Jun" },
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

    const barReceita = document.createElement("div");
    barReceita.className = "bar";
    const fillR = document.createElement("div");
    fillR.className = "fill";
    requestAnimationFrame(() => (fillR.style.width = `${item.receita}%`));
    barReceita.append(fillR);

    const barDespesa = document.createElement("div");
    barDespesa.className = "bar expense";
    const fillD = document.createElement("div");
    fillD.className = "fill";
    requestAnimationFrame(() => (fillD.style.width = `${item.despesa}%`));
    barDespesa.append(fillD);

    const label = document.createElement("div");
    label.className = "bar-label";
    label.innerHTML = `<span>${item.categoria}</span><span class="muted">${formatSimple(item.receita)} / ${formatSimple(item.despesa)}</span>`;

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

// ====== Receita ======
function renderGraficoLinhaReceita(dados) {
  const container = document.getElementById("chart-revenue-line");
  if (!container) return;
  container.innerHTML = "";
  const max = Math.max(...dados.map((d) => d.valor));
  dados.forEach((d, i) => {
    const bar = document.createElement("div");
    bar.className = "line chart-bar";
    bar.style.height = "6px";
    bar.style.width = `${(d.valor / max) * 100}%`;
    bar.style.background = "linear-gradient(90deg, rgba(244,199,107,0.3), rgba(244,199,107,0.8))";
    const row = document.createElement("div");
    row.className = "chart-row";
    const label = document.createElement("span");
    label.textContent = d.mes;
    label.className = "muted";
    row.append(label, bar);
    container.appendChild(row);
  });
}

function renderGraficoBarrasReceita(dados) {
  const container = document.getElementById("chart-revenue-bars");
  if (!container) return;
  container.innerHTML = "";
  const max = Math.max(...dados.map((d) => d.valor));
  dados.forEach((d) => {
    const wrap = document.createElement("div");
    wrap.className = "bar-column";
    const bar = document.createElement("div");
    bar.className = "bar-vert";
    bar.style.height = "0%";
    requestAnimationFrame(() => (bar.style.height = `${(d.valor / max) * 100}%`));
    const val = document.createElement("span");
    val.className = "bar-value";
    val.textContent = formatSimple(d.valor);
    const label = document.createElement("span");
    label.className = "muted";
    label.textContent = d.canal;
    wrap.append(val, bar, label);
    container.appendChild(wrap);
  });
}

function renderGraficoPizzaReceita(dados) {
  const svg = document.getElementById("chart-revenue-donut");
  const legend = document.getElementById("chart-revenue-legend");
  if (!svg || !legend) return;
  svg.innerHTML = "";
  legend.innerHTML = "";
  const total = dados.reduce((sum, d) => sum + d.percentual, 0);
  let offset = 0;
  const colors = ["#f4c76b", "#5ce1a9", "#7fb3ff", "#ff7b7b"];
  dados.forEach((d, i) => {
    const pct = d.percentual / total;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "80");
    circle.setAttribute("cy", "80");
    circle.setAttribute("r", "60");
    circle.setAttribute("fill", "transparent");
    circle.setAttribute("stroke", colors[i % colors.length]);
    circle.setAttribute("stroke-width", "18");
    circle.setAttribute("stroke-dasharray", `${pct * 377} 377`);
    circle.setAttribute("stroke-dashoffset", `${-offset * 377}`);
    circle.setAttribute("stroke-linecap", "round");
    svg.appendChild(circle);
    offset += pct;

    const item = document.createElement("div");
    item.innerHTML = `<span class="dot" style="background:${colors[i % colors.length]}"></span>${d.categoria} — ${d.percentual}%`;
    legend.appendChild(item);
  });
}

// ====== Despesas ======
function renderGraficoEmpilhadoDespesas(dados) {
  const container = document.getElementById("chart-expenses-stacked");
  if (!container) return;
  container.innerHTML = "";
  const max = Math.max(...dados.map((d) => d.fixas + d.variaveis));
  dados.forEach((d) => {
    const col = document.createElement("div");
    col.className = "stacked-col";
    const barsWrap = document.createElement("div");
    barsWrap.className = "stacked-col-bars";
    const varPart = document.createElement("div");
    varPart.className = "stacked-part";
    varPart.style.background = "linear-gradient(180deg, rgba(255,123,123,0.8), rgba(255,123,123,0.5))";
    varPart.style.height = "0%";
    const fixPart = document.createElement("div");
    fixPart.className = "stacked-part";
    fixPart.style.background = "linear-gradient(180deg, rgba(244,199,107,0.8), rgba(244,199,107,0.5))";
    fixPart.style.height = "0%";
    requestAnimationFrame(() => {
      varPart.style.height = `${(d.variaveis / max) * 100}%`;
      fixPart.style.height = `${(d.fixas / max) * 100}%`;
    });
    const label = document.createElement("div");
    label.className = "stacked-label";
    label.textContent = d.mes;
    barsWrap.append(varPart, fixPart);
    col.append(barsWrap, label);
    container.appendChild(col);
  });
}

function renderGraficoPizzaDespesas(dados) {
  const svg = document.getElementById("chart-expenses-donut");
  const legend = document.getElementById("chart-expenses-legend");
  if (!svg || !legend) return;
  svg.innerHTML = "";
  legend.innerHTML = "";
  const total = dados.reduce((sum, d) => sum + d.percentual, 0);
  let offset = 0;
  const colors = ["#f4c76b", "#5ce1a9", "#7fb3ff", "#ff7b7b", "#ffb946"];
  dados.forEach((d, i) => {
    const pct = d.percentual / total;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "80");
    circle.setAttribute("cy", "80");
    circle.setAttribute("r", "60");
    circle.setAttribute("fill", "transparent");
    circle.setAttribute("stroke", colors[i % colors.length]);
    circle.setAttribute("stroke-width", "18");
    circle.setAttribute("stroke-dasharray", `${pct * 377} 377`);
    circle.setAttribute("stroke-dashoffset", `${-offset * 377}`);
    circle.setAttribute("stroke-linecap", "round");
    svg.appendChild(circle);
    offset += pct;
    const item = document.createElement("div");
    item.innerHTML = `<span class="dot" style="background:${colors[i % colors.length]}"></span>${d.categoria} — ${d.percentual}%`;
    legend.appendChild(item);
  });
}

function renderResumoDespesas(resumo) {
  const container = document.getElementById("expenses-resumo");
  if (!container) return;
  container.innerHTML = `
    <div><strong>Total:</strong> ${formatCurrency(-resumo.total)}</div>
    <div class="${resumo.variacao >= 0 ? "var positive" : "var negative"}">${resumo.variacao >= 0 ? "▲" : "▼"} ${Math.abs(resumo.variacao)}%</div>
    <div><strong>Top 3 categorias:</strong><br>${resumo.top.join(", ")}</div>
  `;
}

// ====== Fluxo de Caixa ======
function renderLinhaFluxoCaixa(dados) {
  const container = document.getElementById("chart-cashflow-lines");
  if (!container) return;
  container.innerHTML = "";
  const max = Math.max(...dados.map((d) => Math.max(d.entradas, d.saidas)));
  dados.forEach((d) => {
    const row = document.createElement("div");
    row.className = "line-pair";
    const label = document.createElement("span");
    label.className = "muted";
    label.textContent = d.semana;
    const track = document.createElement("div");
    track.className = "line-track";
    const fillIn = document.createElement("div");
    fillIn.className = "line-fill green";
    fillIn.style.width = `${(d.entradas / max) * 100}%`;
    const fillOut = document.createElement("div");
    fillOut.className = "line-fill red";
    fillOut.style.width = `${(d.saidas / max) * 100}%`;
    track.append(fillIn, fillOut);
    row.append(label, track);
    container.appendChild(row);
  });
}

function renderBarrasSaldoSemanal(dados) {
  const container = document.getElementById("chart-cashflow-bars");
  if (!container) return;
  container.innerHTML = "";
  const max = Math.max(...dados.map((d) => Math.abs(d.saldo)));
  dados.forEach((d) => {
    const wrap = document.createElement("div");
    wrap.className = "bar-column";
    const bar = document.createElement("div");
    bar.className = "bar-vert";
    bar.style.background = d.saldo >= 0 ? "linear-gradient(180deg, rgba(92,225,169,0.8), rgba(92,225,169,0.5))" : "linear-gradient(180deg, rgba(255,123,123,0.8), rgba(255,123,123,0.5))";
    bar.style.height = "0%";
    requestAnimationFrame(() => (bar.style.height = `${(Math.abs(d.saldo) / max) * 100}%`));
    const val = document.createElement("span");
    val.className = "bar-value";
    val.textContent = formatSimple(d.saldo);
    const label = document.createElement("span");
    label.className = "muted";
    label.textContent = d.semana;
    wrap.append(val, bar, label);
    container.appendChild(wrap);
  });
}

function renderResumoFluxoCaixa(dados) {
  const container = document.getElementById("cashflow-resumo");
  if (!container) return;
  const saldoMedio = dados.reduce((sum, d) => sum + d.saldo, 0) / dados.length;
  const melhor = dados.reduce((a, b) => (a.saldo > b.saldo ? a : b));
  const pior = dados.reduce((a, b) => (a.saldo < b.saldo ? a : b));
  container.innerHTML = `
    <div><strong>Saldo médio:</strong> ${formatSimple(saldoMedio)}</div>
    <div><strong>Melhor semana:</strong> ${melhor.semana} (${formatSimple(melhor.saldo)})</div>
    <div><strong>Pior semana:</strong> ${pior.semana} (${formatSimple(pior.saldo)})</div>
  `;
}

// ====== Metas ======
function renderMetasRadiais(dados) {
  const container = document.getElementById("goals-radiais");
  if (!container) return;
  container.innerHTML = "";
  dados.forEach((d) => {
    const wrap = document.createElement("div");
    wrap.className = "radial";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 120 120");
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    const gradId = `grad-${d.nome.replace(/\s+/g, "")}`;
    grad.setAttribute("id", gradId);
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "0%");
    grad.innerHTML = `<stop offset="0%" stop-color="#f4c76b"/><stop offset="100%" stop-color="#5ce1a9"/>`;
    defs.appendChild(grad);
    svg.appendChild(defs);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "60");
    circle.setAttribute("cy", "60");
    circle.setAttribute("r", "52");
    circle.setAttribute("fill", "transparent");
    circle.setAttribute("stroke", "rgba(255,255,255,0.08)");
    circle.setAttribute("stroke-width", "10");
    const fg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    fg.setAttribute("cx", "60");
    fg.setAttribute("cy", "60");
    fg.setAttribute("r", "52");
    fg.setAttribute("fill", "transparent");
    fg.setAttribute("stroke", `url(#${gradId})`);
    fg.setAttribute("stroke-width", "10");
    fg.setAttribute("stroke-linecap", "round");
    const len = 2 * Math.PI * 52;
    fg.setAttribute("stroke-dasharray", `${len} ${len}`);
    fg.setAttribute("stroke-dashoffset", `${len}`);
    fg.style.transition = "stroke-dashoffset 0.8s ease";
    svg.append(circle, fg);
    wrap.appendChild(svg);
    const label = document.createElement("p");
    label.innerHTML = `<strong>${d.nome}</strong><br>${d.percentual}%`;
    wrap.appendChild(label);
    container.appendChild(wrap);
    requestAnimationFrame(() => {
      fg.style.strokeDashoffset = `${len * (1 - d.percentual / 100)}`;
    });
  });
}

function renderTimelineMetas(dados) {
  const container = document.getElementById("goals-timeline");
  if (!container) return;
  container.innerHTML = "";
  dados.forEach((d) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    const dot = document.createElement("div");
    dot.className = "timeline-dot";
    if (d.status === "late") dot.style.background = "var(--red)";
    if (d.status === "pending") dot.style.background = "var(--gold)";
    const title = document.createElement("p");
    title.innerHTML = `<strong>${d.etapa}</strong>`;
    const desc = document.createElement("p");
    desc.className = "muted";
    desc.textContent = d.descricao;
    item.append(dot, title, desc);
    container.appendChild(item);
  });
}

function renderTabelaMetas(dados) {
  const tbody = document.querySelector("#goals-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  dados.forEach((d) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.meta}</td><td>${d.responsavel}</td><td>${d.status}</td><td>${d.prazo}</td>`;
    tbody.appendChild(tr);
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
