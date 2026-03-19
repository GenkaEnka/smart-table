import { getPages } from "../lib/utils.js";

export function initPagination(elements, renderPageButton, render) {
  function applyPagination(query, state) {
    query.page = state.page;
    query.limit = state.rowsPerPage;
    return query;
  }

  function updatePagination(total, { page, limit }) {
    const totalPages = Math.ceil(total / limit);
    const pages = getPages(page, totalPages, 5);

    elements.pages.innerHTML = "";

    pages.forEach((p) => {
      const label = document.createElement("label");
      label.className = "pagination-button";
      label.setAttribute("aria-label", `Goto page ${p}`);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "page";
      input.value = p;
      if (p === page) input.checked = true;

      const span = document.createElement("span");
      span.textContent = p;

      label.appendChild(input);
      label.appendChild(span);

      input.addEventListener("change", () => {
        const hiddenPageInput = elements.pages.closest("form").querySelector("input[name='page']");
        if (hiddenPageInput) hiddenPageInput.value = p;
        render("paginate", { page: p });
      });

      renderPageButton(label, p, p === page);
      elements.pages.appendChild(label);
    });

    const fromRow = (page - 1) * limit + 1;
    const toRow = Math.min(page * limit, total);
    elements.fromRow.textContent = total === 0 ? 0 : fromRow;
    elements.toRow.textContent = toRow;
    elements.totalRows.textContent = total;
  }

function setPageAndRender(newPage) {
  // обновляем hidden input
  const hiddenPageInput = elements.pages.closest("form").querySelector("input[name='page'][type='hidden']");
  if (hiddenPageInput) hiddenPageInput.value = newPage;

  // переключаем radio
  const radios = elements.pages.querySelectorAll("input[type='radio'][name='page']");
  radios.forEach(r => {
    r.checked = Number(r.value) === newPage;
  });

  render("paginate", { page: newPage });
}

  elements.firstPage.addEventListener("click", () => {
    setPageAndRender(1);
  });

  elements.lastPage.addEventListener("click", () => {
    const total = Number(elements.totalRows.textContent);
    const limit = Number(elements.rowsPerPage.value);
    const totalPages = Math.ceil(total / limit);
    setPageAndRender(totalPages);
  });

  elements.previousPage.addEventListener("click", () => {
    const current = elements.pages.querySelector("input:checked");
    if (current && Number(current.value) > 1) {
      setPageAndRender(Number(current.value) - 1);
    }
  });

  elements.nextPage.addEventListener("click", () => {
    const current = elements.pages.querySelector("input:checked");
    const total = Number(elements.totalRows.textContent);
    const limit = Number(elements.rowsPerPage.value);
    const totalPages = Math.ceil(total / limit);
    if (current && Number(current.value) < totalPages) {
      setPageAndRender(Number(current.value) + 1);
    }
  });


  return { applyPagination, updatePagination };
}
