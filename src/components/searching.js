export function initSearching(searchField) {
  return (query, state, action) => {
  // @todo: #5.1 — настроить компаратор
  if (state[searchField] && state[searchField].trim() !== '') {
   return Object.assign({}, query, {
        search: state[searchField] // устанавливаем в query параметр для сервера
      });
    }
    
    // @todo: #5.2 — применить компаратор
      return query;
  };
}
