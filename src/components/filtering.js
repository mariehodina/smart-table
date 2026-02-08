import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
 Object.keys(indexes)
    .forEach((elementName) => {
        elements[elementName].append(
          ...Object.values(indexes[elementName])
            .map(name => {
              const option = document.createElement("option");
              option.textContent = name;
              option.value = name;
              return option;
            }),
        );
      });
  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
        const fieldName = action.dataset.field; 
        if (fieldName) {
            const parent = action.parentElement;
                const input = parent.querySelector('input');
                if (input) {
                    input.value = "";
                    state[fieldName] = "";
                }
            }
        }
        
    // @todo: #4.5 — отфильтровать данные используя компаратор
     return data.filter((row) => {
            const standardMatch = compare(row, state);
            let rangeMatch = true;
            
            if (state.totalFrom && state.totalFrom.trim() !== '') {
                const min = Number(state.totalFrom);
                const value = Number(row.total);
                if (!isNaN(min) && !isNaN(value)) {
                    rangeMatch = rangeMatch && (value >= min);
                }
            }
            
            if (state.totalTo && state.totalTo.trim() !== '') {
                const max = Number(state.totalTo);
                const value = Number(row.total);
                if (!isNaN(max) && !isNaN(value)) {
                    rangeMatch = rangeMatch && (value <= max);
                }
            }
            return standardMatch && rangeMatch;
        });
    };
}
