const palette = {
  navy: "#0c1a47",
  titleBlue: "#003A8C",
  blue: "#0057D9",
  green: "#43A047",
  positive: "#16A34A",
  red: "#E53935",
  negative: "#DC2626",
  gray: "#A6AEB8",
  darkGray: "#6B7280",
  grid: "#E5EAF2",
  purple: "#7E57C2",
  teal: "#00A6B2",
  orange: "#F58220",
  black: "#000000",
  white: "#FFFFFF",
};
Chart.register(ChartDataLabels);

const donutCenterLabelPlugin = {
  id: "donutCenterLabel",
  afterDatasetsDraw(chart) {
    if (chart.config.type !== "doughnut") return;

    const dataset = chart.data.datasets[0];
    const total = dataset.data.reduce((sum, value) => sum + value, 0);
    const { ctx, chartArea } = chart;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = palette.navy;
    ctx.font = "700 20px Inter, Segoe UI, sans-serif";
    ctx.fillText(formatters.billion(total), centerX, centerY - 6);
    ctx.font = "700 13px Inter, Segoe UI, sans-serif";
    ctx.fillText("100%", centerX, centerY + 18);
    ctx.restore();
  },
};
const dimensions = {
  regions: ["North", "South", "Central", "Mekong"],
  channels: ["Modern Trade", "General Trade", "E-commerce", "Distributor"],
  products: [
    "Core Plus",
    "Nova Pack",
    "Prime Mix",
    "Value Box",
    "Fresh Line",
    "Urban Kit",
    "Family Pack",
    "Eco Range",
    "Pro Series",
    "Lite SKU",
    "Max Bundle",
    "Smart Pack",
  ],
  customerGroups: ["Enterprise", "SMB", "Retail", "Key Account"],
  accounts: [
    "Product Sales",
    "Service Revenue",
    "Other Income",
    "Material",
    "Labor",
    "Packaging",
    "Freight",
    "Marketing",
    "Salary",
    "Office Rent",
    "Utilities",
  ],
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const state = {
  page: "executive",
  timeframe: "MTD",
  data: [],
  charts: {},
};

const dom = {};

const formatters = {
  billion(value) {
    return `${(value / 1000000).toFixed(1)} B`;
  },
  billionAxis(value) {
    const scaled = value / 1000000;
    return scaled === 0 ? "0" : `${scaled.toFixed(scaled % 1 === 0 ? 0 : 1)} B`;
  },
  compactCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  },
  compactNumber(value) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  },
  percent(value) {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  },
  share(value) {
    return `${value.toFixed(1)}%`;
  },
  matrixValue(value, isPercent = false) {
    if (isPercent) return `${value.toFixed(1)}%`;
    return `${(value / 1000000).toFixed(1)} B`;
  },
};

function createFakeData() {
  const records = [];
  const start = new Date("2026-01-01");
  const end = new Date("2026-12-31");

  for (let current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    dimensions.regions.forEach((region, regionIndex) => {
      dimensions.channels.forEach((channel, channelIndex) => {
        dimensions.products.forEach((product, productIndex) => {
          const customerGroup = dimensions.customerGroups[
            (regionIndex + channelIndex + productIndex + current.getDate()) %
              dimensions.customerGroups.length
          ];
          const seasonality = 1 + Math.sin((current.getMonth() + 1) / 12 * Math.PI) * 0.18;
          const productWeight = 0.78 + productIndex * 0.035;
          const regionWeight = 0.9 + regionIndex * 0.08;
          const channelWeight = 0.88 + channelIndex * 0.06;
          const dayWeight = 0.92 + (current.getDate() % 9) * 0.018;
          const revenue = Math.round(
            2100 * seasonality * productWeight * regionWeight * channelWeight * dayWeight
          );
          const planRevenue = Math.round(revenue * (0.96 + ((productIndex + channelIndex) % 5) * 0.018));
          const lastYearRevenue = Math.round(revenue * (0.86 + ((regionIndex + productIndex) % 6) * 0.025));
          const directCost = Math.round(revenue * (0.43 + (productIndex % 4) * 0.018));
          const indirectCost = Math.round(revenue * (0.16 + (channelIndex % 3) * 0.012));
          const planDirectCost = Math.round(planRevenue * (0.41 + ((productIndex + regionIndex) % 4) * 0.014));
          const planIndirectCost = Math.round(planRevenue * (0.15 + ((channelIndex + current.getMonth()) % 4) * 0.009));
          const lastYearDirectCost = Math.round(lastYearRevenue * (0.44 + (productIndex % 4) * 0.016));
          const lastYearIndirectCost = Math.round(lastYearRevenue * (0.17 + (channelIndex % 3) * 0.011));

          records.push({
            date: current.toISOString().slice(0, 10),
            year: current.getFullYear(),
            month: current.getMonth(),
            region,
            channel,
            product,
            customerGroup,
            revenue,
            planRevenue,
            lastYearRevenue,
            directCost,
            indirectCost,
            grossMargin: revenue - directCost,
            ebit: revenue - directCost - indirectCost,
            planDirectCost,
            planIndirectCost,
            lastYearDirectCost,
            lastYearIndirectCost,
            lastYearGrossMargin: lastYearRevenue - lastYearDirectCost,
            lastYearEbit: lastYearRevenue - lastYearDirectCost - lastYearIndirectCost,
            orders: 15 + ((productIndex + current.getDate()) % 18),
            headcount: 4 + ((regionIndex + channelIndex) % 5),
          });
        });
      });
    });
  }

  return records;
}

function cacheDom() {
  dom.pageTitle = document.getElementById("pageTitle");
  dom.navItems = document.querySelectorAll(".nav-item[data-page]");
  dom.pagePanels = document.querySelectorAll("[data-page-panel]");
  dom.kpiGrid = document.getElementById("kpiGrid");
  dom.yearFilter = document.getElementById("yearFilter");
  dom.quarterFilter = document.getElementById("quarterFilter");
  dom.monthFilter = document.getElementById("monthFilter");
  dom.regionFilter = document.getElementById("regionFilter");
  dom.channelFilter = document.getElementById("channelFilter");
  dom.productFilter = document.getElementById("productFilter");
  dom.customerGroupFilter = document.getElementById("customerGroupFilter");
  dom.accountFilterControl = document.getElementById("accountFilterControl");
  dom.accountFilter = document.getElementById("accountFilter");
  dom.timeframeButtons = document.querySelectorAll(".timeframe-button");
  dom.pnlMonthlyMatrix = document.getElementById("pnlMonthlyMatrix");
  dom.pnlComparisonMatrix = document.getElementById("pnlComparisonMatrix");
  dom.revenueRegionTable = document.getElementById("revenueRegionTable");
  dom.revenueChannelTable = document.getElementById("revenueChannelTable");
  dom.revenueProductTable = document.getElementById("revenueProductTable");
  dom.revenueCustomerGroupTable = document.getElementById("revenueCustomerGroupTable");
  dom.costVarianceMatrix = document.getElementById("costVarianceMatrix");
  dom.gmChannelTable = document.getElementById("gmChannelTable");
  dom.gmRegionTable = document.getElementById("gmRegionTable");
  dom.gmCustomerGroupTable = document.getElementById("gmCustomerGroupTable");
  dom.gmProductTable = document.getElementById("gmProductTable");
}

function populateSelect(select, values) {
  select.innerHTML = [
    '<option value="All">All</option>',
    ...values.map((value) => `<option value="${value}">${value}</option>`),
  ].join("");
}

function populateMonthFilter() {
  const selectedQuarter = dom.quarterFilter.value;
  const selectedMonth = dom.monthFilter.value;
  const monthIndexes = selectedQuarter === "All"
    ? monthNames.map((_, index) => index)
    : [0, 1, 2].map((offset) => (Number(selectedQuarter) - 1) * 3 + offset);

  dom.monthFilter.innerHTML = [
    '<option value="All">All</option>',
    ...monthIndexes.map((monthIndex) => `<option value="${monthIndex}">${monthNames[monthIndex]}</option>`),
  ].join("");

  if ([...dom.monthFilter.options].some((option) => option.value === selectedMonth)) {
    dom.monthFilter.value = selectedMonth;
  }
}

function setupFilters() {
  const years = [...new Set(state.data.map((record) => record.year))].sort((a, b) => b - a);

  populateSelect(dom.yearFilter, years);
  dom.yearFilter.value = "2026";
  dom.quarterFilter.value = "All";
  populateMonthFilter();
  dom.monthFilter.value = "5";

  populateSelect(dom.regionFilter, dimensions.regions);
  populateSelect(dom.channelFilter, dimensions.channels);
  populateSelect(dom.productFilter, dimensions.products);
  populateSelect(dom.customerGroupFilter, dimensions.customerGroups);
  populateSelect(dom.accountFilter, dimensions.accounts);

  [
    dom.yearFilter,
    dom.monthFilter,
    dom.regionFilter,
    dom.channelFilter,
    dom.productFilter,
    dom.customerGroupFilter,
    dom.accountFilter,
  ].forEach((control) => control.addEventListener("change", renderDashboard));

  dom.quarterFilter.addEventListener("change", () => {
    populateMonthFilter();
    renderDashboard();
  });

  dom.timeframeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.timeframe = button.dataset.timeframe;
      dom.timeframeButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderDashboard();
    });
  });

  dom.navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      setPage(item.dataset.page);
    });
  });

}

function setPage(page) {
  state.page = page;

  dom.navItems.forEach((item) => {
    const isActive = item.dataset.page === page;
    item.classList.toggle("active", isActive);
    if (isActive) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  dom.pagePanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.pagePanel === page);
  });

  const pageTitles = {
    executive: "EXECUTIVE SUMMARY",
    pnl: "P&L STATEMENT",
    revenue: "REVENUE ANALYSIS",
    cost: "COST ANALYSIS",
    profit: "PROFITABILITY ANALYSIS",
  };

  dom.pageTitle.textContent = pageTitles[page] || "EXECUTIVE SUMMARY";
  dom.accountFilterControl.classList.toggle("visible", page === "pnl" || page === "cost");
  renderDashboard();
}

function getSelectedPeriodLabel() {
  const maxMonthIndex = selectedMaxMonthIndex();

  if (state.timeframe === "MTD") return `${monthNames[maxMonthIndex]} MTD`;
  if (state.timeframe === "QTD") return `Q${Math.floor(maxMonthIndex / 3) + 1} QTD`;
  return "YTD";
}

function getSelectedMonthRange() {
  const maxMonthIndex = selectedMaxMonthIndex();

  if (state.timeframe === "MTD") return { start: maxMonthIndex, end: maxMonthIndex };
  if (state.timeframe === "QTD") return { start: Math.floor(maxMonthIndex / 3) * 3, end: maxMonthIndex };
  return { start: 0, end: maxMonthIndex };
}

function getFilteredData() {
  const filters = {
    year: dom.yearFilter.value,
    region: dom.regionFilter.value,
    channel: dom.channelFilter.value,
    product: dom.productFilter.value,
    customerGroup: dom.customerGroupFilter.value,
  };
  const monthRange = getSelectedMonthRange();

  return state.data.filter((record) => {
    const inYear = filters.year === "All" || String(record.year) === filters.year;
    const inMonthRange = record.month >= monthRange.start && record.month <= monthRange.end;
    const inRegion = filters.region === "All" || record.region === filters.region;
    const inChannel = filters.channel === "All" || record.channel === filters.channel;
    const inProduct = filters.product === "All" || record.product === filters.product;
    const inCustomerGroup =
      filters.customerGroup === "All" || record.customerGroup === filters.customerGroup;

    return inYear && inMonthRange && inRegion && inChannel && inProduct && inCustomerGroup;
  });
}

function getDimensionFilteredData() {
  const filters = {
    year: dom.yearFilter.value,
    region: dom.regionFilter.value,
    channel: dom.channelFilter.value,
    product: dom.productFilter.value,
    customerGroup: dom.customerGroupFilter.value,
  };

  return state.data.filter((record) => {
    const inYear = filters.year === "All" || String(record.year) === filters.year;
    const inRegion = filters.region === "All" || record.region === filters.region;
    const inChannel = filters.channel === "All" || record.channel === filters.channel;
    const inProduct = filters.product === "All" || record.product === filters.product;
    const inCustomerGroup =
      filters.customerGroup === "All" || record.customerGroup === filters.customerGroup;

    return inYear && inRegion && inChannel && inProduct && inCustomerGroup;
  });
}

function sum(records, key) {
  return records.reduce((total, record) => total + record[key], 0);
}

function buildKpis(records) {
  const revenue = sum(records, "revenue");
  const directCost = sum(records, "directCost");
  const grossMargin = sum(records, "grossMargin");
  const indirectCost = sum(records, "indirectCost");
  const ebit = sum(records, "ebit");
  const totalCost = directCost + indirectCost;
  const motc = revenue === 0 ? 0 : totalCost / revenue * 100;

  const lyRevenue = sum(records, "lastYearRevenue");
  const lyDirectCost = sum(records, "lastYearDirectCost");
  const lyGrossMargin = sum(records, "lastYearGrossMargin");
  const lyIndirectCost = sum(records, "lastYearIndirectCost");
  const lyEbit = sum(records, "lastYearEbit");
  const lyTotalCost = lyDirectCost + lyIndirectCost;
  const lyMotc = lyRevenue === 0 ? 0 : lyTotalCost / lyRevenue * 100;

  return [
    { label: "Revenue", value: revenue, ly: lyRevenue, icon: "fa-dollar-sign", type: "currency" },
    { label: "Direct Cost", value: directCost, ly: lyDirectCost, icon: "fa-boxes-stacked", type: "currency" },
    { label: "Gross Margin", value: grossMargin, ly: lyGrossMargin, icon: "fa-chart-simple", type: "currency" },
    { label: "Indirect Cost", value: indirectCost, ly: lyIndirectCost, icon: "fa-building", type: "currency" },
    { label: "EBIT", value: ebit, ly: lyEbit, icon: "fa-scale-balanced", type: "currency" },
    { label: "Total Cost", value: totalCost, ly: lyTotalCost, icon: "fa-wallet", type: "currency" },
    { label: "MoTC", value: motc, ly: lyMotc, icon: "fa-percent", type: "percent-value" },
  ];
}

function buildRevenueKpis(records) {
  const revenue = sum(records, "revenue");
  const planRevenue = sum(records, "planRevenue");
  const lastYearRevenue = sum(records, "lastYearRevenue");
  const ebit = sum(records, "ebit");
  const lastYearEbit = sum(records, "lastYearEbit");
  const orders = sum(records, "orders");
  const lastYearOrders = orders * 0.94;
  const priorYearRevenue = lastYearRevenue * 0.91;
  const variance = revenue - planRevenue;
  const lyVariance = lastYearRevenue - planRevenue;
  const achievement = planRevenue === 0 ? 0 : revenue / planRevenue * 100;
  const lyAchievement = planRevenue === 0 ? 0 : lastYearRevenue / planRevenue * 100;
  const yoy = variancePercent(revenue, lastYearRevenue);
  const lyYoy = variancePercent(lastYearRevenue, priorYearRevenue);
  const ebitPercent = revenue === 0 ? 0 : ebit / revenue * 100;
  const lyEbitPercent = lastYearRevenue === 0 ? 0 : lastYearEbit / lastYearRevenue * 100;
  const revenuePerOrder = orders === 0 ? 0 : revenue / orders;
  const lyRevenuePerOrder = lastYearOrders === 0 ? 0 : lastYearRevenue / lastYearOrders;

  return [
    { label: "Revenue", value: revenue, ly: lastYearRevenue, icon: "fa-dollar-sign", type: "currency" },
    { label: "Plan Revenue", value: planRevenue, ly: lastYearRevenue, icon: "fa-bullseye", type: "currency" },
    { label: "Variance", value: variance, ly: lyVariance, icon: "fa-code-compare", type: "currency" },
    { label: "Achievement %", value: achievement, ly: lyAchievement, icon: "fa-circle-check", type: "plain-percent", varianceType: "pp" },
    { label: "LY", value: lastYearRevenue, ly: priorYearRevenue, icon: "fa-clock-rotate-left", type: "currency" },
    { label: "YoY", value: yoy, ly: lyYoy, icon: "fa-arrow-trend-up", type: "signed-percent", varianceType: "pp" },
    { label: "EBIT %", value: ebitPercent, ly: lyEbitPercent, icon: "fa-scale-balanced", type: "plain-percent", varianceType: "pp" },
    { label: "Revenue / Order", value: revenuePerOrder, ly: lyRevenuePerOrder, icon: "fa-receipt", type: "currency" },
  ];
}

function costSummary(records, mode = "actual") {
  const isLastYear = mode === "lastYear";
  const actualDirectCost = sum(records, "directCost");
  const actualIndirectCost = sum(records, "indirectCost");
  const directCost = isLastYear ? sum(records, "lastYearDirectCost") : actualDirectCost;
  const indirectCost = isLastYear ? sum(records, "lastYearIndirectCost") : actualIndirectCost;

  if (mode === "plan") {
    const planDirectCost = sum(records, "planDirectCost");
    const planIndirectCost = sum(records, "planIndirectCost");

    return {
      directCost: planDirectCost,
      indirectCost: planIndirectCost,
      totalCost: planDirectCost + planIndirectCost,
      orders: sum(records, "orders"),
    };
  }

  return {
    directCost,
    indirectCost,
    totalCost: directCost + indirectCost,
    orders: sum(records, "orders"),
  };
}

function buildCostKpis(records) {
  const actual = costSummary(records);
  const plan = costSummary(records, "plan");
  const lastYear = costSummary(records, "lastYear");
  const variance = actual.totalCost - plan.totalCost;
  const achievement = plan.totalCost === 0 ? 0 : actual.totalCost / plan.totalCost * 100;
  const vsLastYear = variancePercent(actual.totalCost, lastYear.totalCost);
  const costPerOrder = actual.orders === 0 ? 0 : actual.totalCost / actual.orders;

  return [
    { label: "Total Cost", value: actual.totalCost, icon: "fa-wallet", type: "currency" },
    { label: "Plan Cost", value: plan.totalCost, icon: "fa-bullseye", type: "currency" },
    { label: "Variance", value: variance, icon: "fa-code-compare", type: "currency" },
    { label: "Achievement %", value: achievement, icon: "fa-circle-check", type: "plain-percent" },
    { label: "LY", value: lastYear.totalCost, icon: "fa-clock-rotate-left", type: "currency" },
    { label: "% vs LY", value: vsLastYear, icon: "fa-arrow-trend-up", type: "signed-percent" },
    { label: "Cost / Order", value: costPerOrder, icon: "fa-receipt", type: "currency" },
  ];
}

function buildProfitabilityKpis(records) {
  const revenue = sum(records, "revenue");
  const grossMargin = sum(records, "grossMargin");
  const ebit = sum(records, "ebit");
  const lastYearRevenue = sum(records, "lastYearRevenue");
  const lastYearGrossMargin = sum(records, "lastYearGrossMargin");
  const lastYearEbit = sum(records, "lastYearEbit");
  const ebitPercent = revenue === 0 ? 0 : ebit / revenue * 100;
  const grossMarginPercent = revenue === 0 ? 0 : grossMargin / revenue * 100;
  const lastYearEbitPercent = lastYearRevenue === 0 ? 0 : lastYearEbit / lastYearRevenue * 100;
  const lastYearGrossMarginPercent = lastYearRevenue === 0 ? 0 : lastYearGrossMargin / lastYearRevenue * 100;

  return [
    { label: "EBIT", value: ebit, ly: lastYearEbit, icon: "fa-scale-balanced", type: "currency" },
    { label: "EBIT %", value: ebitPercent, ly: lastYearEbitPercent, icon: "fa-percent", type: "plain-percent", varianceType: "pp" },
    { label: "GM", value: grossMargin, ly: lastYearGrossMargin, icon: "fa-chart-simple", type: "currency" },
    { label: "GM %", value: grossMarginPercent, ly: lastYearGrossMarginPercent, icon: "fa-percent", type: "plain-percent", varianceType: "pp" },
  ];
}

function variancePercent(value, ly) {
  if (!ly) return 0;
  return (value - ly) / ly * 100;
}

function renderKpis(records) {
  const isRevenuePage = state.page === "revenue";
  const isCostPage = state.page === "cost";
  const isProfitPage = state.page === "profit";
  const kpis = isProfitPage
    ? buildProfitabilityKpis(records)
    : isCostPage
      ? buildCostKpis(records)
      : isRevenuePage
        ? buildRevenueKpis(records)
        : buildKpis(records);

  dom.kpiGrid.classList.toggle("revenue-kpis", isRevenuePage);
  dom.kpiGrid.classList.toggle("cost-kpis", isCostPage);
  dom.kpiGrid.classList.toggle("profit-kpis", isProfitPage);
  dom.kpiGrid.setAttribute(
    "aria-label",
    isProfitPage
      ? "Profitability Analysis KPI cards"
      : isCostPage
      ? "Cost Analysis KPI cards"
      : isRevenuePage
        ? "Revenue Analysis KPI cards"
        : "Executive KPI cards"
  );

  dom.kpiGrid.innerHTML = kpis
    .map((kpi) => {
      if (isCostPage) {
        const value = kpi.type === "currency"
          ? formatters.billion(kpi.value)
          : kpi.type === "signed-percent"
            ? formatters.percent(kpi.value)
            : `${kpi.value.toFixed(1)}%`;

        return `
          <article class="kpi-card cost-kpi-card">
            <div class="kpi-label">
              <span>${kpi.label}</span>
              <i class="fa-solid ${kpi.icon}" aria-hidden="true"></i>
            </div>
            <div class="kpi-value">${value}</div>
          </article>
        `;
      }

      if (isRevenuePage || isProfitPage) {
        const value = kpi.type === "currency"
          ? formatters.billion(kpi.value)
          : kpi.type === "signed-percent"
            ? formatters.percent(kpi.value)
            : `${kpi.value.toFixed(1)}%`;
        const ly = kpi.type === "currency"
          ? formatters.billion(kpi.ly)
          : kpi.type === "signed-percent"
            ? formatters.percent(kpi.ly)
            : `${kpi.ly.toFixed(1)}%`;
        const variance = kpi.type === "currency"
          ? variancePercent(kpi.value, kpi.ly)
          : kpi.value - kpi.ly;
        const isPositive = variance >= 0;
        const varianceText = kpi.varianceType === "pp"
          ? `${variance >= 0 ? "+" : ""}${variance.toFixed(1)} pp`
          : formatters.percent(variance);

        return `
          <article class="kpi-card">
            <div class="kpi-label">
              <span>${kpi.label}</span>
              <i class="fa-solid ${kpi.icon}" aria-hidden="true"></i>
            </div>
            <div class="kpi-value">${value}</div>
          </article>
        `;
      }

      const variance = variancePercent(kpi.value, kpi.ly);
      const isPositive = variance >= 0;
      const value = kpi.type === "percent-value"
        ? `${kpi.value.toFixed(1)}%`
        : formatters.billion(kpi.value);
      const ly = kpi.type === "percent-value"
        ? `${kpi.ly.toFixed(1)}%`
        : formatters.billion(kpi.ly);

      return `
        <article class="kpi-card">
          <div class="kpi-label">
            <span>${kpi.label}</span>
            <i class="fa-solid ${kpi.icon}" aria-hidden="true"></i>
          </div>
          <div class="kpi-value">${value}</div>
          <div class="kpi-meta">
            <span>LY ${ly}</span>
            <span class="variance ${isPositive ? "positive" : "negative"}">
              ${formatters.percent(variance)}
            </span>
          </div>
        </article>
      `;
    })
    .join("");
}

function groupBy(records, key, valueKey) {
  return records.reduce((groups, record) => {
    groups[record[key]] = (groups[record[key]] || 0) + record[valueKey];
    return groups;
  }, {});
}

function monthlySeries(records, valueKey) {
  const values = Array(12).fill(0);
  records.forEach((record) => {
    values[record.month] += record[valueKey];
  });
  return values;
}

function selectedMaxMonthIndex() {
  if (dom.monthFilter.value !== "All") return Number(dom.monthFilter.value);
  if (dom.quarterFilter.value !== "All") return Number(dom.quarterFilter.value) * 3 - 1;
  return 11;
}

function showUntilMonth(series, maxMonthIndex) {
  return series.map((value, index) => (index <= maxMonthIndex ? value : null));
}

function financialSummary(records, useLastYear = false) {
  const revenue = sum(records, useLastYear ? "lastYearRevenue" : "revenue");
  const directCost = sum(records, useLastYear ? "lastYearDirectCost" : "directCost");
  const grossProfit = useLastYear
    ? sum(records, "lastYearGrossMargin")
    : sum(records, "grossMargin");
  const indirectCost = sum(records, useLastYear ? "lastYearIndirectCost" : "indirectCost");
  const ebit = useLastYear ? sum(records, "lastYearEbit") : sum(records, "ebit");
  const totalCost = directCost + indirectCost;
  const netProfit = ebit * 0.86;

  return {
    revenue,
    directCost,
    grossProfit,
    indirectCost,
    ebit,
    totalCost,
    ebitPercent: revenue === 0 ? 0 : ebit / revenue * 100,
    motcPercent: revenue === 0 ? 0 : totalCost / revenue * 100,
    netProfit,
  };
}

const pnlRows = [
  { label: "Revenue", type: "category", value: (summary) => summary.revenue },
  { label: "Product Sales", type: "account", parent: "Revenue", value: (summary) => summary.revenue * 0.72 },
  { label: "Service Revenue", type: "account", parent: "Revenue", value: (summary) => summary.revenue * 0.22 },
  { label: "Other Income", type: "account", parent: "Revenue", value: (summary) => summary.revenue * 0.06 },
  { label: "Direct Cost", type: "category", value: (summary) => summary.directCost },
  { label: "Material", type: "account", parent: "Direct Cost", value: (summary) => summary.directCost * 0.45 },
  { label: "Labor", type: "account", parent: "Direct Cost", value: (summary) => summary.directCost * 0.25 },
  { label: "Packaging", type: "account", parent: "Direct Cost", value: (summary) => summary.directCost * 0.18 },
  { label: "Freight", type: "account", parent: "Direct Cost", value: (summary) => summary.directCost * 0.12 },
  { label: "Gross Profit", type: "total", value: (summary) => summary.grossProfit },
  { label: "Indirect Cost", type: "category", value: (summary) => summary.indirectCost },
  { label: "Marketing", type: "account", parent: "Indirect Cost", value: (summary) => summary.indirectCost * 0.36 },
  { label: "Salary", type: "account", parent: "Indirect Cost", value: (summary) => summary.indirectCost * 0.34 },
  { label: "Office Rent", type: "account", parent: "Indirect Cost", value: (summary) => summary.indirectCost * 0.18 },
  { label: "Utilities", type: "account", parent: "Indirect Cost", value: (summary) => summary.indirectCost * 0.12 },
  { label: "EBIT", type: "total", value: (summary) => summary.ebit },
  { label: "EBIT %", type: "total", isPercent: true, value: (summary) => summary.ebitPercent },
  { label: "MoTC %", type: "total", isPercent: true, value: (summary) => summary.motcPercent },
  { label: "Net Profit", type: "total", value: (summary) => summary.netProfit },
];

const costRows = [
  { label: "Direct Cost", type: "category", value: (summary) => summary.directCost },
  { label: "Material", type: "account", parent: "Direct Cost", value: (summary) => summary.directCost * 0.45 },
  { label: "Labor", type: "account", parent: "Direct Cost", value: (summary) => summary.directCost * 0.25 },
  { label: "Packaging", type: "account", parent: "Direct Cost", value: (summary) => summary.directCost * 0.18 },
  { label: "Freight", type: "account", parent: "Direct Cost", value: (summary) => summary.directCost * 0.12 },
  { label: "Indirect Cost", type: "category", value: (summary) => summary.indirectCost },
  { label: "Marketing", type: "account", parent: "Indirect Cost", value: (summary) => summary.indirectCost * 0.36 },
  { label: "Salary", type: "account", parent: "Indirect Cost", value: (summary) => summary.indirectCost * 0.34 },
  { label: "Office Rent", type: "account", parent: "Indirect Cost", value: (summary) => summary.indirectCost * 0.18 },
  { label: "Utilities", type: "account", parent: "Indirect Cost", value: (summary) => summary.indirectCost * 0.12 },
  { label: "Total Cost", type: "total", value: (summary) => summary.totalCost },
];

function visiblePnlRows() {
  const selectedAccount = dom.accountFilter.value;

  return pnlRows.filter((row) => {
    if (row.type !== "account") return true;
    return selectedAccount === "All" || row.label === selectedAccount;
  });
}

function visibleCostRows() {
  const selectedAccount = dom.accountFilter.value;

  return costRows.filter((row) => {
    if (row.type !== "account") return true;
    return selectedAccount === "All" || row.label === selectedAccount;
  });
}

function formatMatrixCell(value, isPercent = false, suffix = "") {
  const text = isPercent ? `${value.toFixed(1)}${suffix || "%"}` : formatters.matrixValue(value);
  const className = value < 0 ? "negative-value" : value > 0 ? "positive-value" : "";
  return `<td class="${className}">${text}</td>`;
}

function recordsForMonth(records, monthIndex) {
  return records.filter((record) => record.month === monthIndex);
}

function renderPnlMonthlyMatrix(periodRecords) {
  const dimensionRecords = getDimensionFilteredData();
  const rows = visiblePnlRows();
  const periodLabel = getSelectedPeriodLabel();

  const header = `
    <thead>
      <tr>
        <th>Category / Account</th>
        ${monthNames.map((month) => `<th>${month}</th>`).join("")}
        <th>${periodLabel} Total</th>
      </tr>
    </thead>
  `;

  const body = rows
    .map((row) => {
      const monthCells = monthNames.map((_, index) => {
        const value = row.value(financialSummary(recordsForMonth(dimensionRecords, index)));
        return formatMatrixCell(value, row.isPercent);
      });
      const total = row.value(financialSummary(periodRecords));

      return `
        <tr class="${row.type}-row">
          <td>${row.type === "account" ? row.label : row.label}</td>
          ${monthCells.join("")}
          ${formatMatrixCell(total, row.isPercent)}
        </tr>
      `;
    })
    .join("");

  dom.pnlMonthlyMatrix.innerHTML = `${header}<tbody>${body}</tbody>`;
}

function renderPnlComparisonMatrix(periodRecords) {
  const rows = visiblePnlRows();
  const periodLabel = getSelectedPeriodLabel();

  const header = `
    <thead>
      <tr>
        <th>Category / Account</th>
        <th>Current Year (${periodLabel})</th>
        <th>Last Year</th>
        <th>Variance</th>
        <th>%YoY</th>
      </tr>
    </thead>
  `;

  const currentSummary = financialSummary(periodRecords);
  const lastYearSummary = financialSummary(periodRecords, true);
  const body = rows
    .map((row) => {
      const currentValue = row.value(currentSummary);
      const lastYearValue = row.value(lastYearSummary);
      const variance = currentValue - lastYearValue;
      const yoy = row.isPercent || lastYearValue === 0 ? variance : variance / lastYearValue * 100;
      const varianceSuffix = row.isPercent ? " pp" : "";
      const yoySuffix = row.isPercent ? " pp" : "%";

      return `
        <tr class="${row.type}-row">
          <td>${row.label}</td>
          ${formatMatrixCell(currentValue, row.isPercent)}
          ${formatMatrixCell(lastYearValue, row.isPercent)}
          ${formatMatrixCell(variance, row.isPercent, varianceSuffix)}
          ${formatMatrixCell(yoy, true, yoySuffix)}
        </tr>
      `;
    })
    .join("");

  dom.pnlComparisonMatrix.innerHTML = `${header}<tbody>${body}</tbody>`;
}

function renderPnlStatement(records) {
  renderPnlMonthlyMatrix(records);
  renderPnlComparisonMatrix(records);
}

function renderCostVarianceMatrix(records) {
  if (!dom.costVarianceMatrix) return;

  const actual = costSummary(records);
  const plan = costSummary(records, "plan");
  const lastYear = costSummary(records, "lastYear");
  const rows = visibleCostRows();
  const header = `
    <thead>
      <tr>
        <th>Category / Account</th>
        <th>Act</th>
        <th>Plan</th>
        <th>Var vs Plan</th>
        <th>%Ach</th>
        <th>LY</th>
        <th>% vs LY</th>
      </tr>
    </thead>
  `;
  const body = rows
    .map((row) => {
      const actualValue = row.value(actual);
      const planValue = row.value(plan);
      const lastYearValue = row.value(lastYear);
      const variance = actualValue - planValue;
      const achievement = planValue === 0 ? 0 : actualValue / planValue * 100;
      const vsLastYear = variancePercent(actualValue, lastYearValue);

      return `
        <tr class="${row.type}-row">
          <td>${row.label}</td>
          ${formatMatrixCell(actualValue)}
          ${formatMatrixCell(planValue)}
          ${formatMatrixCell(variance)}
          ${formatMatrixCell(achievement, true)}
          ${formatMatrixCell(lastYearValue)}
          ${formatMatrixCell(vsLastYear, true)}
        </tr>
      `;
    })
    .join("");

  dom.costVarianceMatrix.innerHTML = `${header}<tbody>${body}</tbody>`;
}

function chartBaseOptions(extraOptions = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    layout: {
      padding: { top: 8, right: 12, bottom: 0, left: 0 },
    },
    plugins: {
      datalabels: {
  display(context) {
    const value = context.dataset.data[context.dataIndex];
    return value !== null && value !== 0;
  },

  color(context) {
    if (Array.isArray(context.dataset.dataLabelColor)) {
      return context.dataset.dataLabelColor[context.dataIndex] || palette.navy;
    }
    if (context.dataset.dataLabelColor) return context.dataset.dataLabelColor;
    return context.dataset.borderColor || context.dataset.backgroundColor || palette.navy;
  },

  anchor(context) {
    const chartType = context.chart.config.type;

    if (chartType === "line") return "end";
    if (chartType === "bar" && context.dataset.waterfallSigns?.[context.dataIndex] < 0) {
      return "start";
    }
    if (chartType === "bar") return "end";

    return "center";
  },

  align(context) {
    const chartType = context.chart.config.type;

    if (chartType === "line") {
      return context.dataIndex % 2 === 0 ? "top" : "bottom";
    }

    if (chartType === "bar") {
      if (context.dataset.waterfallSigns?.[context.dataIndex] < 0) return "bottom";
      return "end";
    }

    return "center";
  },

  offset(context) {
    const chartType = context.chart.config.type;

    if (chartType === "line") return 8;
    if (chartType === "bar") return 4;

    return 0;
  },

  clamp: true,
  clip: false,

  font: {
    family: "Inter",
    size: 12,
    weight: "700",
  },

  formatter(value, context) {
    if (value === null) return "";

    if (Array.isArray(value)) {
      const sign = context.dataset.waterfallSigns?.[context.dataIndex] < 0 ? "-" : "";
      return `${sign}${formatters.billion(Math.abs(value[1] - value[0]))}`;
    }

    if (
      context.dataset.label?.includes("%") ||
      context.dataset.label?.includes("Margin") ||
      context.dataset.label?.includes("Achievement") ||
      context.dataset.label?.includes("YoY")
    ) {
      return `${value.toFixed(1)}%`;
    }

    return formatters.billion(value);
  },
},
      legend: {
        position: "top",
        align: "start",
        labels: {
          boxHeight: 8,
          boxWidth: 22,
          color: palette.navy,
          font: { family: "Inter", size: 12, weight: "500" },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label(context) {
            const raw = context.raw;
            const value = Array.isArray(raw)
              ? Math.abs(raw[1] - raw[0])
              : typeof context.parsed === "object"
                ? context.parsed.y
                : context.parsed;
            if (context.dataset.label?.includes("%") || context.dataset.label?.includes("Margin")) {
              return `${context.dataset.label}: ${formatters.share(value)}`;
            }
            return `${context.dataset.label}: ${formatters.billion(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: palette.black, font: { family: "Inter", size: 12, weight: "600" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: palette.grid },
        ticks: {
          color: palette.black,
          font: { family: "Inter", size: 12, weight: "600" },
          callback: (value) => formatters.billionAxis(value),
        },
      },
    },
    ...extraOptions,
  };
}

function createCharts() {
  state.charts.revenueTrend = new Chart(document.getElementById("revenueTrendChart"), {
    type: "line",
    data: {
      labels: monthNames,
      datasets: [
        {
          label: "CY Revenue",
          data: [],
          borderColor: palette.blue,
          backgroundColor: palette.blue,
          dataLabelColor: palette.blue,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
        },
        {
          label: "LY Revenue",
          data: [],
          borderColor: palette.blue,
          backgroundColor: palette.blue,
          dataLabelColor: palette.blue,
          borderDash: [6, 5],
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
        },
      ],
    },
    options: chartBaseOptions(),
  });

  state.charts.grossProfitTrend = new Chart(document.getElementById("grossProfitTrendChart"), {
    type: "line",
    data: {
      labels: monthNames,
      datasets: [
        {
          label: "CY Gross Profit",
          data: [],
          borderColor: palette.teal,
          backgroundColor: palette.teal,
          dataLabelColor: palette.teal,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
        },
        {
          label: "LY Gross Profit",
          data: [],
          borderColor: palette.teal,
          backgroundColor: palette.teal,
          dataLabelColor: palette.teal,
          borderDash: [6, 5],
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
        },
        {
          label: "Gross Margin % (CY)",
          data: [],
          borderColor: palette.orange,
          backgroundColor: palette.orange,
          dataLabelColor: palette.orange,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
          yAxisID: "y1",
        },
      ],
    },
    options: chartBaseOptions({
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: palette.black, font: { family: "Inter", size: 12, weight: "600" } },
    },
    y: {
      type: "linear",
      position: "left",
      beginAtZero: true,
      grid: { color: palette.grid },
      ticks: {
        color: palette.black,
        font: { family: "Inter", size: 12, weight: "600" },
        callback: (value) => formatters.billionAxis(value),
      },
    },
    y1: {
      type: "linear",
      position: "right",
      min: 0,
      max: 100,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: palette.orange,
        font: { family: "Inter", size: 12, weight: "600" },
        callback: (value) => `${value}%`,
      },
    },
  },
}),
  });

  state.charts.actualVsPlan = new Chart(document.getElementById("actualVsPlanChart"), {
    type: "bar",
    data: {
      labels: monthNames,
      datasets: [
        {
          label: "Actual Revenue",
          data: [],
          backgroundColor: palette.blue,
          dataLabelColor: palette.blue,
          borderRadius: 2,
        },
        {
          label: "Plan Revenue",
          data: [],
          backgroundColor: palette.gray,
          dataLabelColor: palette.darkGray,
          borderRadius: 2,
        },
      ],
    },
    options: chartBaseOptions(),
  });

  state.charts.componentBreakdown = new Chart(document.getElementById("componentBreakdownChart"), {
    type: "bar",
    data: {
      labels: ["Revenue", "Direct Cost", "Gross Margin", "Indirect Cost", "EBIT"],
      datasets: [{
        label: "Amount",
        data: [],
        backgroundColor: [],
        dataLabelColor: [],
        waterfallSigns: [],
        borderRadius: 6,
      }],
    },
    options: chartBaseOptions({
      plugins: {
        datalabels: chartBaseOptions().plugins.datalabels,
        legend: { display: false },
        tooltip: chartBaseOptions().plugins.tooltip,
      },
    }),
  });

  state.charts.topProductRevenue = new Chart(document.getElementById("topProductRevenueChart"), {
    type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Revenue",
      data: [],
      backgroundColor: palette.blue,
      dataLabelColor: palette.navy,
      borderRadius: 2,
    }],
  },
    options: chartBaseOptions({
  indexAxis: "y",
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: palette.grid },
      ticks: {
        color: palette.black,
        font: { family: "Inter", size: 12, weight: "600" },
        callback: (value) => formatters.billionAxis(value),
      },
    },
    y: {
      type: "category",
      grid: { display: false },
      ticks: {
        color: palette.black,
        font: { family: "Inter", size: 13, weight: "700" },
      },
    },
  },
  plugins: {
    datalabels: chartBaseOptions().plugins.datalabels,
    legend: { display: false },
    tooltip: chartBaseOptions().plugins.tooltip,
  },
}),
  });

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    cutout: "62%",
    plugins: {
      datalabels: {
  color: palette.white,
  font: {
    family: "Inter",
    size: 12,
    weight: "700",
  },
  formatter(value, context) {
    const data = context.chart.data.datasets[0].data;
    const total = data.reduce((sum, item) => sum + item, 0);
    const percent = total === 0 ? 0 : value / total * 100;

    return `${percent.toFixed(1)}%`;
  },
},
      legend: {
        position: "right",
        labels: {
          boxHeight: 9,
          boxWidth: 9,
          color: palette.navy,
          font: { family: "Inter", size: 12, weight: "500" },
          usePointStyle: true,
          generateLabels(chart) {
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce((sum, value) => sum + value, 0);

            return chart.data.labels.map((label, index) => {
              const value = dataset.data[index];
              const percent = total === 0 ? 0 : value / total * 100;

              return {
                text: `${label}  ${formatters.billion(value)} (${percent.toFixed(0)}%)`,
                fillStyle: dataset.backgroundColor[index],
                strokeStyle: dataset.backgroundColor[index],
                lineWidth: 0,
                hidden: false,
                index,
              };
            });
          },
        },
      },
      tooltip: chartBaseOptions().plugins.tooltip,
    },
  };

  state.charts.revenueByRegion = new Chart(document.getElementById("revenueByRegionChart"), {
    type: "doughnut",
    data: { labels: [], datasets: [{ label: "Revenue", data: [], backgroundColor: [] }] },
    options: donutOptions,
    plugins: [donutCenterLabelPlugin],
  });

  state.charts.revenueByChannel = new Chart(document.getElementById("revenueByChannelChart"), {
    type: "doughnut",
    data: { labels: [], datasets: [{ label: "Revenue", data: [], backgroundColor: [] }] },
    options: donutOptions,
    plugins: [donutCenterLabelPlugin],
  });

  const revenueComboOptions = chartBaseOptions({
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: palette.black, font: { family: "Inter", size: 12, weight: "600" } },
      },
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        grid: { color: palette.grid },
        ticks: {
          color: palette.black,
          font: { family: "Inter", size: 12, weight: "600" },
          callback: (value) => formatters.billionAxis(value),
        },
      },
      y1: {
        type: "linear",
        position: "right",
        min: -20,
        max: 140,
        grid: { drawOnChartArea: false },
        ticks: {
          color: palette.orange,
          font: { family: "Inter", size: 12, weight: "600" },
          callback: (value) => `${value}%`,
        },
      },
    },
  });

  state.charts.revenueActualPlanAchievement = new Chart(
    document.getElementById("revenueActualPlanAchievementChart"),
    {
      type: "bar",
      data: {
        labels: monthNames,
        datasets: [
          {
            type: "bar",
            label: "Actual Revenue",
            data: [],
            backgroundColor: palette.blue,
            dataLabelColor: palette.blue,
            borderRadius: 2,
            yAxisID: "y",
          },
          {
            type: "bar",
            label: "Plan Revenue",
            data: [],
            backgroundColor: palette.gray,
            dataLabelColor: palette.darkGray,
            borderRadius: 2,
            yAxisID: "y",
          },
          {
            type: "line",
            label: "Achievement %",
            data: [],
            borderColor: palette.orange,
            backgroundColor: palette.orange,
            dataLabelColor: palette.orange,
            borderWidth: 3,
            pointRadius: 4,
            pointBorderColor: palette.white,
            pointBorderWidth: 2,
            tension: 0.35,
            yAxisID: "y1",
          },
        ],
      },
      options: revenueComboOptions,
    }
  );

  state.charts.revenueVsLyYoy = new Chart(document.getElementById("revenueVsLyYoyChart"), {
    type: "bar",
    data: {
      labels: monthNames,
      datasets: [
        {
          type: "bar",
          label: "CY Revenue",
          data: [],
          backgroundColor: palette.blue,
          dataLabelColor: palette.blue,
          borderRadius: 2,
          yAxisID: "y",
        },
        {
          type: "bar",
          label: "LY Revenue",
          data: [],
          backgroundColor: palette.gray,
          dataLabelColor: palette.darkGray,
          borderRadius: 2,
          yAxisID: "y",
        },
        {
          type: "line",
          label: "%YoY",
          data: [],
          borderColor: palette.orange,
          backgroundColor: palette.orange,
          dataLabelColor: palette.orange,
          borderWidth: 3,
          pointRadius: 4,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
          yAxisID: "y1",
        },
      ],
    },
    options: revenueComboOptions,
  });

  state.charts.revenueAnalysisRegion = new Chart(
    document.getElementById("revenueAnalysisRegionChart"),
    {
      type: "doughnut",
      data: { labels: [], datasets: [{ label: "Revenue", data: [], backgroundColor: [] }] },
      options: donutOptions,
      plugins: [donutCenterLabelPlugin],
    }
  );

  state.charts.revenueAnalysisChannel = new Chart(
    document.getElementById("revenueAnalysisChannelChart"),
    {
      type: "doughnut",
      data: { labels: [], datasets: [{ label: "Revenue", data: [], backgroundColor: [] }] },
      options: donutOptions,
      plugins: [donutCenterLabelPlugin],
    }
  );

  state.charts.revenueCustomerGroup = new Chart(
    document.getElementById("revenueCustomerGroupChart"),
    {
      type: "doughnut",
      data: { labels: [], datasets: [{ label: "Revenue", data: [], backgroundColor: [] }] },
      options: donutOptions,
      plugins: [donutCenterLabelPlugin],
    }
  );

  state.charts.revenueTopProduct = new Chart(document.getElementById("revenueTopProductChart"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Revenue",
        data: [],
        backgroundColor: palette.blue,
        dataLabelColor: palette.navy,
        borderRadius: 2,
      }],
    },
    options: chartBaseOptions({
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: palette.grid },
          ticks: {
            color: palette.black,
            font: { family: "Inter", size: 12, weight: "600" },
            callback: (value) => formatters.billionAxis(value),
          },
        },
        y: {
          type: "category",
          grid: { display: false },
          ticks: {
            color: palette.black,
            font: { family: "Inter", size: 12, weight: "700" },
          },
        },
      },
      plugins: {
        datalabels: chartBaseOptions().plugins.datalabels,
        legend: { display: false },
        tooltip: chartBaseOptions().plugins.tooltip,
      },
    }),
  });

  const costTrendOptions = chartBaseOptions({
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: palette.black, font: { family: "Inter", size: 12, weight: "600" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: palette.grid },
        ticks: {
          color: palette.black,
          font: { family: "Inter", size: 12, weight: "600" },
          callback: (value) => formatters.billionAxis(value),
        },
      },
    },
  });

  state.charts.monthlyCostTrend = new Chart(document.getElementById("monthlyCostTrendChart"), {
    type: "line",
    data: {
      labels: monthNames,
      datasets: [
        {
          label: "Actual Cost",
          data: [],
          borderColor: palette.red,
          backgroundColor: palette.red,
          dataLabelColor: palette.red,
          borderWidth: 3,
          pointRadius: 4,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
        },
        {
          label: "Plan Cost",
          data: [],
          borderColor: palette.gray,
          backgroundColor: palette.gray,
          dataLabelColor: palette.darkGray,
          borderDash: [6, 5],
          borderWidth: 3,
          pointRadius: 4,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
        },
        {
          label: "Last Year",
          data: [],
          borderColor: palette.teal,
          backgroundColor: palette.teal,
          dataLabelColor: palette.teal,
          borderWidth: 3,
          pointRadius: 4,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
        },
      ],
    },
    options: costTrendOptions,
  });

  state.charts.costStructureByMonth = new Chart(document.getElementById("costStructureByMonthChart"), {
    type: "bar",
    data: {
      labels: monthNames,
      datasets: [
        { label: "Material", data: [], backgroundColor: palette.blue, stack: "cost" },
        { label: "Labor", data: [], backgroundColor: palette.teal, stack: "cost" },
        { label: "Packaging", data: [], backgroundColor: palette.orange, stack: "cost" },
        { label: "Freight", data: [], backgroundColor: palette.purple, stack: "cost" },
        { label: "Marketing", data: [], backgroundColor: palette.green, stack: "cost" },
        { label: "Salary", data: [], backgroundColor: palette.red, stack: "cost" },
        { label: "Office Rent", data: [], backgroundColor: palette.gray, stack: "cost" },
        { label: "Utilities", data: [], backgroundColor: palette.darkGray, stack: "cost" },
      ],
    },
    options: chartBaseOptions({
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: palette.black, font: { family: "Inter", size: 12, weight: "600" } },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: 100,
          grid: { color: palette.grid },
          ticks: {
            color: palette.black,
            font: { family: "Inter", size: 12, weight: "600" },
            callback: (value) => `${value}%`,
          },
        },
      },
      plugins: {
        datalabels: {
          ...chartBaseOptions().plugins.datalabels,
          color: palette.white,
          formatter(value) {
            if (value === null || value < 7) return "";
            return `${value.toFixed(0)}%`;
          },
        },
        legend: chartBaseOptions().plugins.legend,
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
            },
          },
        },
      },
    }),
  });

  state.charts.profitMarginTrend = new Chart(document.getElementById("profitMarginTrendChart"), {
    type: "line",
    data: {
      labels: monthNames,
      datasets: [
        {
          label: "GM %",
          data: [],
          borderColor: palette.green,
          backgroundColor: palette.green,
          dataLabelColor: palette.green,
          borderWidth: 3,
          pointRadius: 4,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
        },
        {
          label: "EBIT %",
          data: [],
          borderColor: palette.orange,
          backgroundColor: palette.orange,
          dataLabelColor: palette.orange,
          borderWidth: 3,
          pointRadius: 4,
          pointBorderColor: palette.white,
          pointBorderWidth: 2,
          tension: 0.35,
        },
      ],
    },
    options: chartBaseOptions({
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: palette.black, font: { family: "Inter", size: 12, weight: "600" } },
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: palette.grid },
          ticks: {
            color: palette.black,
            font: { family: "Inter", size: 12, weight: "600" },
            callback: (value) => `${value}%`,
          },
        },
      },
      plugins: {
        datalabels: chartBaseOptions().plugins.datalabels,
        legend: chartBaseOptions().plugins.legend,
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
            },
          },
        },
      },
    }),
  });

  state.charts.gmByChannel = new Chart(document.getElementById("gmByChannelChart"), {
    type: "doughnut",
    data: { labels: [], datasets: [{ label: "Gross Margin", data: [], backgroundColor: [] }] },
    options: donutOptions,
    plugins: [donutCenterLabelPlugin],
  });

  state.charts.gmByRegion = new Chart(document.getElementById("gmByRegionChart"), {
    type: "doughnut",
    data: { labels: [], datasets: [{ label: "Gross Margin", data: [], backgroundColor: [] }] },
    options: donutOptions,
    plugins: [donutCenterLabelPlugin],
  });

  state.charts.gmByCustomerGroup = new Chart(document.getElementById("gmCustomerGroupChart"), {
    type: "doughnut",
    data: { labels: [], datasets: [{ label: "Gross Margin", data: [], backgroundColor: [] }] },
    options: donutOptions,
    plugins: [donutCenterLabelPlugin],
  });

  state.charts.gmTopProduct = new Chart(document.getElementById("gmTopProductChart"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "GM",
          data: [],
          backgroundColor: palette.green,
          dataLabelColor: palette.green,
          borderRadius: 2,
        },
      ],
    },
    options: chartBaseOptions({
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: palette.grid },
          ticks: {
            color: palette.black,
            font: { family: "Inter", size: 12, weight: "600" },
            callback: (value) => formatters.billionAxis(value),
          },
        },
        y: {
          grid: { display: false },
          ticks: { color: palette.black, font: { family: "Inter", size: 12, weight: "700" } },
        },
      },
      plugins: {
        datalabels: chartBaseOptions().plugins.datalabels,
        legend: chartBaseOptions().plugins.legend,
        tooltip: chartBaseOptions().plugins.tooltip,
      },
    }),
  });

  state.charts.productProfitability = new Chart(document.getElementById("productProfitabilityChart"), {
    type: "bubble",
    data: {
      datasets: [{
        label: "Products",
        data: [],
        backgroundColor: "rgba(0, 87, 217, 0.45)",
        borderColor: palette.blue,
        borderWidth: 2,
      }],
    },
    options: chartBaseOptions({
      plugins: {
        datalabels: { display: false },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(context) {
              const point = context.raw;
              return `${point.label}: Revenue ${formatters.billion(point.x)}, GM ${formatters.billion(point.gm)}, GM% ${point.y.toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: palette.grid },
          title: { display: true, text: "Revenue", color: palette.navy },
          ticks: {
            color: palette.black,
            font: { family: "Inter", size: 12, weight: "600" },
            callback: (value) => formatters.billionAxis(value),
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: palette.grid },
          title: { display: true, text: "%GM", color: palette.navy },
          ticks: {
            color: palette.black,
            font: { family: "Inter", size: 12, weight: "600" },
            callback: (value) => `${value}%`,
          },
        },
      },
    }),
  });
}

function updateChart(chart) {
  chart.update();
}

function groupRevenueDetails(records, key) {
  return Object.entries(groupBy(records, key, "revenue"))
    .map(([label, cy]) => {
      const scopedRecords = records.filter((record) => record[key] === label);
      const plan = sum(scopedRecords, "planRevenue");
      const ly = sum(scopedRecords, "lastYearRevenue");
      return { label, cy, plan, ly };
    })
    .sort((a, b) => b.cy - a.cy);
}

function renderMiniTable(table, rows) {
  const totalCy = rows.reduce((total, row) => total + row.cy, 0);
  const totalPlan = rows.reduce((total, row) => total + row.plan, 0);
  const totalLy = rows.reduce((total, row) => total + row.ly, 0);
  const body = rows
    .map((row) => {
      const contribution = totalCy === 0 ? 0 : row.cy / totalCy * 100;
      const achievement = row.plan === 0 ? 0 : row.cy / row.plan * 100;
      const yoy = variancePercent(row.cy, row.ly);
      const yoyClass = yoy >= 0 ? "positive-value" : "negative-value";

      return `
        <tr>
          <td>${row.label}</td>
          <td>${formatters.billion(row.cy)}</td>
          <td>${contribution.toFixed(1)}%</td>
          <td>${formatters.billion(row.plan)}</td>
          <td>${achievement.toFixed(1)}%</td>
          <td>${formatters.billion(row.ly)}</td>
          <td class="${yoyClass}">${formatters.percent(yoy)}</td>
        </tr>
      `;
    })
    .join("");
  const totalAchievement = totalPlan === 0 ? 0 : totalCy / totalPlan * 100;
  const totalYoy = variancePercent(totalCy, totalLy);

  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>CY</th>
        <th>% Cont.</th>
        <th>Plan</th>
        <th>%Ach</th>
        <th>LY</th>
        <th>%YoY</th>
      </tr>
    </thead>
    <tbody>${body}</tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td>${formatters.billion(totalCy)}</td>
        <td>100.0%</td>
        <td>${formatters.billion(totalPlan)}</td>
        <td>${totalAchievement.toFixed(1)}%</td>
        <td>${formatters.billion(totalLy)}</td>
        <td class="${totalYoy >= 0 ? "positive-value" : "negative-value"}">${formatters.percent(totalYoy)}</td>
      </tr>
    </tfoot>
  `;
}

function groupProfitabilityDetails(records, key) {
  return Object.entries(groupBy(records, key, "grossMargin"))
    .map(([label, gm]) => {
      const scopedRecords = records.filter((record) => record[key] === label);
      const revenue = sum(scopedRecords, "revenue");
      return {
        label,
        revenue,
        gm,
        gmPercent: revenue === 0 ? 0 : gm / revenue * 100,
      };
    })
    .sort((a, b) => b.gm - a.gm);
}

function renderProfitabilityMiniTable(table, rows) {
  if (!table) return;

  const totalRevenue = rows.reduce((total, row) => total + row.revenue, 0);
  const totalGm = rows.reduce((total, row) => total + row.gm, 0);
  const totalGmPercent = totalRevenue === 0 ? 0 : totalGm / totalRevenue * 100;
  const body = rows
    .map((row) => `
      <tr>
        <td>${row.label}</td>
        <td>${formatters.billion(row.revenue)}</td>
        <td>${formatters.billion(row.gm)}</td>
        <td>${row.gmPercent.toFixed(1)}%</td>
      </tr>
    `)
    .join("");

  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Revenue</th>
        <th>GM</th>
        <th>%GM</th>
      </tr>
    </thead>
    <tbody>${body}</tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td>${formatters.billion(totalRevenue)}</td>
        <td>${formatters.billion(totalGm)}</td>
        <td>${totalGmPercent.toFixed(1)}%</td>
      </tr>
    </tfoot>
  `;
}

function updateRevenueDonut(chart, rows) {
  chart.data.labels = rows.map((row) => row.label);
  chart.data.datasets[0].data = rows.map((row) => row.cy);
  chart.data.datasets[0].backgroundColor = rows.map((_, index) => {
    const colors = [palette.blue, palette.teal, palette.orange, palette.purple, palette.gray];
    return colors[index % colors.length];
  });
}

function updateProfitabilityDonut(chart, rows) {
  chart.data.labels = rows.map((row) => row.label);
  chart.data.datasets[0].data = rows.map((row) => row.gm);
  chart.data.datasets[0].backgroundColor = rows.map((_, index) => {
    const colors = [palette.green, palette.blue, palette.teal, palette.orange, palette.purple, palette.gray];
    return colors[index % colors.length];
  });
}

function updateRevenueAnalysis(records) {
  const fullYearRecords = getDimensionFilteredData();
  const maxMonthIndex = selectedMaxMonthIndex();
  const revenueSeries = showUntilMonth(monthlySeries(fullYearRecords, "revenue"), maxMonthIndex);
  const planSeries = monthlySeries(fullYearRecords, "planRevenue");
  const lyRevenueSeries = monthlySeries(fullYearRecords, "lastYearRevenue");
  const achievementSeries = revenueSeries.map((value, index) => {
    if (value === null || !planSeries[index]) return null;
    return value / planSeries[index] * 100;
  });
  const yoySeries = revenueSeries.map((value, index) => {
    if (value === null || !lyRevenueSeries[index]) return null;
    return variancePercent(value, lyRevenueSeries[index]);
  });

  state.charts.revenueActualPlanAchievement.data.datasets[0].data = revenueSeries;
  state.charts.revenueActualPlanAchievement.data.datasets[1].data = planSeries;
  state.charts.revenueActualPlanAchievement.data.datasets[2].data = achievementSeries;

  state.charts.revenueVsLyYoy.data.datasets[0].data = revenueSeries;
  state.charts.revenueVsLyYoy.data.datasets[1].data = lyRevenueSeries;
  state.charts.revenueVsLyYoy.data.datasets[2].data = yoySeries;

  const regionRows = groupRevenueDetails(records, "region");
  const channelRows = groupRevenueDetails(records, "channel");
  const customerGroupRows = groupRevenueDetails(records, "customerGroup");
  const productRows = groupRevenueDetails(records, "product").slice(0, 10);

  updateRevenueDonut(state.charts.revenueAnalysisRegion, regionRows);
  updateRevenueDonut(state.charts.revenueAnalysisChannel, channelRows);
  updateRevenueDonut(state.charts.revenueCustomerGroup, customerGroupRows);

  state.charts.revenueTopProduct.data.labels = productRows.map((row) => row.label);
  state.charts.revenueTopProduct.data.datasets[0].data = productRows.map((row) => row.cy);

  renderMiniTable(dom.revenueRegionTable, regionRows);
  renderMiniTable(dom.revenueChannelTable, channelRows);
  renderMiniTable(dom.revenueProductTable, productRows);
  renderMiniTable(dom.revenueCustomerGroupTable, customerGroupRows);
}

function updateProfitabilityAnalysis(records) {
  const fullYearRecords = getDimensionFilteredData();
  const maxMonthIndex = selectedMaxMonthIndex();
  const revenueSeries = showUntilMonth(monthlySeries(fullYearRecords, "revenue"), maxMonthIndex);
  const grossMarginSeries = showUntilMonth(monthlySeries(fullYearRecords, "grossMargin"), maxMonthIndex);
  const ebitSeries = showUntilMonth(monthlySeries(fullYearRecords, "ebit"), maxMonthIndex);
  const gmPercentSeries = grossMarginSeries.map((value, index) => {
    if (value === null || !revenueSeries[index]) return null;
    return value / revenueSeries[index] * 100;
  });
  const ebitPercentSeries = ebitSeries.map((value, index) => {
    if (value === null || !revenueSeries[index]) return null;
    return value / revenueSeries[index] * 100;
  });

  state.charts.profitMarginTrend.data.datasets[0].data = gmPercentSeries;
  state.charts.profitMarginTrend.data.datasets[1].data = ebitPercentSeries;

  const channelRows = groupProfitabilityDetails(records, "channel");
  const regionRows = groupProfitabilityDetails(records, "region");
  const customerGroupRows = groupProfitabilityDetails(records, "customerGroup");
  const productRows = groupProfitabilityDetails(records, "product").slice(0, 10);
  const scatterRows = groupProfitabilityDetails(records, "product");
  const maxGm = Math.max(...scatterRows.map((row) => row.gm), 1);

  updateProfitabilityDonut(state.charts.gmByChannel, channelRows);
  updateProfitabilityDonut(state.charts.gmByRegion, regionRows);
  updateProfitabilityDonut(state.charts.gmByCustomerGroup, customerGroupRows);

  state.charts.gmTopProduct.data.labels = productRows.map((row) => row.label);
  state.charts.gmTopProduct.data.datasets[0].data = productRows.map((row) => row.gm);

  state.charts.productProfitability.data.datasets[0].data = scatterRows.map((row) => ({
    x: row.revenue,
    y: row.gmPercent,
    r: 7 + row.gm / maxGm * 18,
    gm: row.gm,
    label: row.label,
  }));

  renderProfitabilityMiniTable(dom.gmChannelTable, channelRows);
  renderProfitabilityMiniTable(dom.gmRegionTable, regionRows);
  renderProfitabilityMiniTable(dom.gmCustomerGroupTable, customerGroupRows);
  renderProfitabilityMiniTable(dom.gmProductTable, productRows);
}

function costComponentShares(records) {
  const summary = costSummary(records);
  const components = [
    summary.directCost * 0.45,
    summary.directCost * 0.25,
    summary.directCost * 0.18,
    summary.directCost * 0.12,
    summary.indirectCost * 0.36,
    summary.indirectCost * 0.34,
    summary.indirectCost * 0.18,
    summary.indirectCost * 0.12,
  ];

  return components.map((value) => (summary.totalCost === 0 ? 0 : value / summary.totalCost * 100));
}

function monthlyCostSeries(records, mode = "actual") {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const summary = costSummary(recordsForMonth(records, monthIndex), mode);
    return summary.totalCost;
  });
}

function updateCostAnalysis(records) {
  renderCostVarianceMatrix(records);

  const fullYearRecords = getDimensionFilteredData();
  const maxMonthIndex = selectedMaxMonthIndex();
  const actualCostSeries = showUntilMonth(monthlyCostSeries(fullYearRecords), maxMonthIndex);
  const planCostSeries = monthlyCostSeries(fullYearRecords, "plan");
  const lastYearCostSeries = monthlyCostSeries(fullYearRecords, "lastYear");

  state.charts.monthlyCostTrend.data.datasets[0].data = actualCostSeries;
  state.charts.monthlyCostTrend.data.datasets[1].data = planCostSeries;
  state.charts.monthlyCostTrend.data.datasets[2].data = lastYearCostSeries;

  const monthlyShares = Array.from({ length: 12 }, (_, monthIndex) => {
    if (monthIndex > maxMonthIndex) return Array(8).fill(null);
    return costComponentShares(recordsForMonth(fullYearRecords, monthIndex));
  });

  state.charts.costStructureByMonth.data.datasets.forEach((dataset, datasetIndex) => {
    dataset.data = monthlyShares.map((shares) => shares[datasetIndex]);
  });
}

function updateCharts(records) {
  const fullYearRecords = getDimensionFilteredData();
  const maxMonthIndex = selectedMaxMonthIndex();
  const revenueSeries = showUntilMonth(monthlySeries(fullYearRecords, "revenue"), maxMonthIndex);
  const lyRevenueSeries = monthlySeries(fullYearRecords, "lastYearRevenue");
  const grossMarginSeries = showUntilMonth(monthlySeries(fullYearRecords, "grossMargin"), maxMonthIndex);
  const lyGrossMarginSeries = monthlySeries(fullYearRecords, "lastYearGrossMargin");
  const planSeries = monthlySeries(fullYearRecords, "planRevenue");

  state.charts.revenueTrend.data.datasets[0].data = revenueSeries;
  state.charts.revenueTrend.data.datasets[1].data = lyRevenueSeries;

  state.charts.grossProfitTrend.data.datasets[0].data = grossMarginSeries;
  state.charts.grossProfitTrend.data.datasets[1].data = lyGrossMarginSeries;
  state.charts.grossProfitTrend.data.datasets[2].data = grossMarginSeries.map((value, index) => {
  if (value === null || !revenueSeries[index]) return null;

  const baseMargin = (value / revenueSeries[index]) * 100;
  const fluctuation = Math.sin(index * 1.4) * 6 + Math.cos(index * 0.7) * 4;

  return baseMargin + fluctuation;
});

  state.charts.actualVsPlan.data.datasets[0].data = revenueSeries;
  state.charts.actualVsPlan.data.datasets[1].data = planSeries;

  const revenue = sum(records, "revenue");
  const directCost = sum(records, "directCost");
  const grossMargin = sum(records, "grossMargin");
  const indirectCost = sum(records, "indirectCost");
  const ebit = sum(records, "ebit");
  state.charts.componentBreakdown.data.datasets[0].data = [
    [0, revenue],
    [grossMargin, revenue],
    [0, grossMargin],
    [ebit, grossMargin],
    [0, ebit],
  ];
  state.charts.componentBreakdown.data.datasets[0].backgroundColor = [
    palette.blue,
    palette.red,
    palette.green,
    palette.red,
    palette.blue,
  ];
  state.charts.componentBreakdown.data.datasets[0].dataLabelColor = [
    palette.navy,
    palette.red,
    palette.navy,
    palette.red,
    palette.navy,
  ];
  state.charts.componentBreakdown.data.datasets[0].waterfallSigns = [1, -1, 1, -1, 1];

  const productGroups = Object.entries(groupBy(records, "product", "revenue"))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  state.charts.topProductRevenue.data.labels = productGroups.map(([label]) => label);
  state.charts.topProductRevenue.data.datasets[0].data = productGroups.map(([, value]) => value);

  const regionGroups = Object.entries(groupBy(records, "region", "revenue"));
  state.charts.revenueByRegion.data.labels = regionGroups.map(([label]) => label);
  state.charts.revenueByRegion.data.datasets[0].data = regionGroups.map(([, value]) => value);
  state.charts.revenueByRegion.data.datasets[0].backgroundColor = [
    palette.blue,
    palette.teal,
    palette.orange,
    palette.purple,
    palette.gray,
  ];

  const channelGroups = Object.entries(groupBy(records, "channel", "revenue"));
  state.charts.revenueByChannel.data.labels = channelGroups.map(([label]) => label);
  state.charts.revenueByChannel.data.datasets[0].data = channelGroups.map(([, value]) => value);
  state.charts.revenueByChannel.data.datasets[0].backgroundColor = [
    palette.blue,
    palette.teal,
    palette.orange,
    palette.purple,
    palette.gray,
  ];

  updateRevenueAnalysis(records);
  updateCostAnalysis(records);
  updateProfitabilityAnalysis(records);
  Object.values(state.charts).forEach(updateChart);
}

function renderDashboard() {
  const records = getFilteredData();
  renderKpis(records);
  updateCharts(records);
  renderPnlStatement(records);
}

function init() {
  state.data = createFakeData();
  cacheDom();
  setupFilters();
  createCharts();
  renderDashboard();
}

document.addEventListener("DOMContentLoaded", init);
