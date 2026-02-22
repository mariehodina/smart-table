export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            const hasEmptyOption = select.options.length > 0 && select.options[0].value === "";
            while (select.options.length > (hasEmptyOption ? 1 : 0)) {
                select.remove(select.options.length - 1);
            }
            select.append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }));
        });
    }

    const applyFiltering = (query, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === "clear") {
            const fieldName = action.dataset.field; 
            if (fieldName) {
                const parent = action.parentElement;
                const input = parent.querySelector('input');
                if (input) {
                    input.value = "";
                }
            }
        }
        
        // @todo: #4.5 — формируем параметры фильтрации для запроса к серверу
        const filter = {};
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element) {
                if (['INPUT', 'SELECT'].includes(element.tagName) && element.value) {
                    filter[`filter[${element.name}]`] = element.value;
                }
            }
        });
        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    }

    return {
        updateIndexes,
        applyFiltering
    };
}