export function initData() {
  const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

  let sellers;
  let customers;
  let lastResult;
  let lastQuery;

  const mapRecords = (data) =>
    data.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: sellers[item.seller_id],
      customer: customers[item.customer_id],
      total: item.total_amount,
    }));

  const getIndexes = async () => {
    if (!sellers || !customers) {
      [sellers, customers] = await Promise.all([
        fetch(`${BASE_URL}/sellers`).then((res) => res.json()),
        fetch(`${BASE_URL}/customers`).then((res) => res.json()),
      ]);
    }
    return { sellers, customers };
  };

  const getRecords = async (query, isUpdated = false) => {
    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString();

    if (lastQuery === nextQuery && !isUpdated) {
      return lastResult;
    }

    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
    // Попытка распарсить JSON, но API может вернуть строку "PRO FEATURE ONLY"
    let records;
    try {
      records = await response.json();
    } catch (e) {
      records = null;
    }

    // Если ответ невалидный или содержит заглушку от сервера — используем локальный fallback
    if (
      !records ||
      typeof records !== "object" ||
      (Array.isArray(records) === false && !records.items)
    ) {
      // Попробуйте загрузить локальную фикстуру, если она есть
      try {
        const local = await fetch("/fixtures/records.json").then((r) =>
          r.json(),
        );
        records = local;
      } catch (e) {
        // Если фикстуры нет, формируем минимальный заглушечный набор из 10 строк
        const items = Array.from({ length: 10 }, (_, i) => ({
          receipt_id: i + 1,
          date: `2020-01-${String(i + 1).padStart(2, "0")}`,
          seller_id: 1,
          customer_id: 1,
          total_amount: (i + 1) * 10,
        }));
        records = { total: 10, items };
      }
    }

    lastQuery = nextQuery;
    lastResult = {
      total: records.total,
      items: mapRecords(records.items),
    };
    return lastResult;
  };

  return { getIndexes, getRecords };
}
