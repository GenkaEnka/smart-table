import "./style.css";
import "./fonts/ys-display/fonts.css";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

const api = initData();

function collectState(action) {
  const fd = new FormData(sampleTable.container);

  if (action && action.name) {
    fd.set(action.name, action.value);
  }

  const state = processFormData(fd);
  const rowsPerPage = parseInt(state.rowsPerPage);
  const pageFromAction =
    action && action.name === "page" ? parseInt(action.value) : undefined;
  const page = parseInt(pageFromAction ?? state.page ?? 1);
  const total = [parseFloat(state.totalFrom), parseFloat(state.totalTo)];
  return { ...state, rowsPerPage, page, total };
}

async function render(action) {
  let state = collectState(action);

  let query = {};
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);

  query.page = state.page;
  query.limit = state.rowsPerPage;

  const { total, items } = await api.getRecords(query, true);

  applyPagination(total, state, () => render());

  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render,
);

const applyPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
);

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements,
);
const applySearching = initSearching("search");

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });

  await render();
}

init();
