import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  const comparator = createComparison(
    ["skipEmptyTargetValues"],
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
    return data.filter((item) => {
      const searchObj = {};
      searchObj[searchField] = searchQuery;
      return comparator(item, searchObj);
    });
  };
}
