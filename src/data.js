import { makeIndex } from "./lib/utils.js";

const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

export function initData(sourceData) {
  // переменные для кеширования данных
  let sellers;
  let customers;
  let lastResult;
  let lastQuery;

  // функция для приведения строк в тот вид, который нужен нашей таблице
  const mapRecords = (data) => data.map(item => ({
    id: item.receipt_id,
    date: item.date,
    seller: sellers ? sellers[item.seller_id] : 'Unknown',
    customer: customers ? customers[item.customer_id] : 'Unknown',
    total: item.total_amount
  }));

  // функция получения индексов
  const getIndexes = async () => {
    try {
      if (!sellers || !customers) {
        [sellers, customers] = await Promise.all([
          fetch(`${BASE_URL}/sellers`).then(res => res.json()),
          fetch(`${BASE_URL}/customers`).then(res => res.json()),
        ]);
      }
      return { sellers, customers };
    } catch (error) {
      console.warn("API недоступно, используем локальные данные");
      const uniqueSellers = [...new Set(sourceData.map(item => item.seller))];
      const uniqueCustomers = [...new Set(sourceData.map(item => item.customer))];
      return { 
        sellers: uniqueSellers, 
        customers: uniqueCustomers 
      };
    }
  }

  // функция получения записей о продажах с сервера
  const getRecords = async (query, isUpdated = false) => {
    try {
      const qs = new URLSearchParams(query);
      const nextQuery = qs.toString();

      if (lastQuery === nextQuery && !isUpdated) {
        return lastResult;
      }

      const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
      const records = await response.json();

      lastQuery = nextQuery;
      lastResult = {
        total: records.total,
        items: mapRecords(records.items)
      };

      return lastResult;
    } catch (error) {
      console.warn("API недоступно, возвращаем локальные данные");
      return {
        total: sourceData.length,
        items: sourceData
      };
    }
  };

  return {
    getIndexes,
    getRecords
  };
}