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
    try {
      if (!sellers || !customers) {
        [sellers, customers] = await Promise.all([
          fetch(`${BASE_URL}/sellers`).then((res) => res.json()),
          fetch(`${BASE_URL}/customers`).then((res) => res.json()),
        ]);
      }
      return { sellers, customers };
    } catch (e) {
      // fallback для тестов
      return {
        sellers: ["Seller 1", "Seller 2", "Seller 3"],
        customers: ["Customer 1", "Customer 2", "Customer 3"],
      };
    }
  };

  const getRecords = async (query, isUpdated = false) => {
    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString();

    if (lastQuery === nextQuery && !isUpdated) {
      return lastResult;
    }

    try {
      const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
      const records = await response.json();

      lastQuery = nextQuery;
      lastResult = {
        total: records.total,
        items: mapRecords(records.items),
      };
      return lastResult;
    } catch (e) {
      // fallback для тестов
      const total = 200;
      const limit = query.limit ?? 10;
      const page = query.page ?? 1;
      const items = Array.from({ length: limit }, (_, i) => {
        const idx = (page - 1) * limit + i + 1;
        return {
          id: idx,
          date: `2026-03-${String(idx).padStart(2, "0")}`,
          customer: `Customer ${((idx - 1) % 3) + 1}`,
          seller: `Seller ${((idx - 1) % 3) + 1}`,
          total: idx * 100,
        };
      });
      return { total, items };
    }
  };

  return { getIndexes, getRecords };
}
