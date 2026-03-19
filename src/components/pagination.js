export function initPagination(elements, renderPageButton) {
  function applyPagination(query, state) {
    query.page = state.page;
    query.limit = state.rowsPerPage;
    return query;
  }

  function updatePagination(total, { page, limit }) {
    const totalPages = Math.ceil(total / limit);

    // контейнер для страниц
    const pagesContainer = elements.pages;
    pagesContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      // создаём кнопку страницы
      const label = document.createElement("label");
      label.className = "pagination-button";
      label.setAttribute("aria-label", `Goto page ${i}`);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "page";
      input.value = i;
      if (i === page) input.checked = true;

      const span = document.createElement("span");
      span.textContent = i;

      label.appendChild(input);
      label.appendChild(span);

      // даём возможность кастомизировать кнопку
      renderPageButton(label, i, i === page);

      pagesContainer.appendChild(label);
    }

    // обновляем статус
    const fromRow = (page - 1) * limit + 1;
    const toRow = Math.min(page * limit, total);

    elements.fromRow.textContent = total === 0 ? 0 : fromRow;
    elements.toRow.textContent = toRow;
    elements.totalRows.textContent = total;
  }

  return { applyPagination, updatePagination };
}
