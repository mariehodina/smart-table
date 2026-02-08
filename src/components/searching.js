import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  const comparator = createComparison(
    [rules.skipEmptyTargetValues],
    [
      rules.searchMultipleFields(
        searchField,
        ["date", "customer", "seller"],
        false,
      ),
    ],
  );
  return (data, state, action) => {
    // @todo: #5.2 — применить компаратор
    const searchQuery = state[searchField] || "";
    if (!searchQuery.trim()) {
      return data;
    }
    const searchLower = searchQuery.toLowerCase();
    return data.filter((item) => {
      const fieldsToSearch = ["date", "customer", "seller"];
      for (const field of fieldsToSearch) {
        if (item[field]) {
          const fieldValue = String(item[field]).toLowerCase();
          if (fieldValue.includes(searchLower)) {
            return true;
          }
        }
      }
      const searchObj = {};
      searchObj[searchField] = searchQuery;
      return comparator(item, searchObj);
    });
  };
}
