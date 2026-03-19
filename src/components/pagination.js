import { getPages } from "../lib/utils.js";

export function initPagination(elements, renderPageButton) {
  function applyPagination(query, state) {
    query.page = state.page;
    query.limit = state.rowsPerPage;
    return query;
  }

  function updatePagination(total, { page, limit }) {
    const totalPages = Math.ceil(total / limit);

    // получаем массив страниц
    const pages = getPages(page, totalPages, 5);

    // очищаем контейнер и создаём кнопки заново
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

      renderPageButton(label, p, p === page);
      elements.pages.appendChild(label);
    });

    // обновляем статус
    const fromRow = (page - 1) * limit + 1;
    const toRow = Math.min(page * limit, total);
    elements.fromRow.textContent = total === 0 ? 0 : fromRow;
    elements.toRow.textContent = toRow;
    elements.totalRows.textContent = total;
  }

  // обработка стрелок
  elements.firstPage.addEventListener("click", () => {
    elements.pages.querySelector("input[value='1']")?.click();
  });
  elements.previousPage.addEventListener("click", () => {
    const current = elements.pages.querySelector("input:checked");
    if (current && Number(current.value) > 1) {
      elements.pages
        .querySelector(`input[value='${Number(current.value) - 1}']`)
        ?.click();
    }
  });
  elements.nextPage.addEventListener("click", () => {
    const current = elements.pages.querySelector("input:checked");
    if (current) {
      elements.pages
        .querySelector(`input[value='${Number(current.value) + 1}']`)
        ?.click();
    }
  });
  elements.lastPage.addEventListener("click", () => {
    const total = Number(elements.totalRows.textContent);
    const limit = Number(elements.rowsPerPage.value);
    const totalPages = Math.ceil(total / limit);
    elements.pages.querySelector(`input[value='${totalPages}']`)?.click();
  });

  return { applyPagination, updatePagination };
}
