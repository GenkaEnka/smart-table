import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  return (total, state) => {
    const rowsPerPage = state.rowsPerPage;
    const pageCount = Math.ceil(total / rowsPerPage);
    const page = state.page;

    // отрисовка номеров страниц
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    // обновление статуса
    fromRow.textContent = (page - 1) * rowsPerPage + 1;
    toRow.textContent = Math.min(page * rowsPerPage, total);
    totalRows.textContent = total;

    // обновляем value у стрелок
    const form = pages.closest("form");
    form.querySelector('[aria-label="Previous page"]').value = Math.max(
      1,
      page - 1,
    );
    form.querySelector('[aria-label="Next page"]').value = Math.min(
      pageCount,
      page + 1,
    );
    form.querySelector('[aria-label="Last page"]').value = pageCount;
  };
};
