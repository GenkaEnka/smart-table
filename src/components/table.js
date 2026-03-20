import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // дополнительные шаблоны до таблицы
  before.reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  // дополнительные шаблоны после таблицы
  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  // обработка событий формы
  root.container.addEventListener("change", () => onAction());
  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });
  root.container.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitter = event.submitter;
    const pageInput = root.container.querySelector('input[name="page"]');

    if (submitter && submitter.name) {
      if (pageInput && submitter.name === "page") {
        pageInput.value = submitter.value;
      }
    }

    onAction(submitter);
  });

  const render = (data) => {
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        if (key in row.elements) {
          row.elements[key].textContent = item[key];
        }
      });
      return row.container;
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
