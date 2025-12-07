// components/filters.js
// Responsible for wiring search and filter inputs to the main application.

import { fetchFilterMetadata } from "../services/api.js";

/**
 * Initialize filters and search inputs.
 * @param {function(object): void} onChange - Called whenever any filter or search field changes.
 */
export async function initFilters(onChange) {
    const searchNameInput = document.getElementById("search-name");
    const searchPhoneInput = document.getElementById("search-phone");
    const regionSelect = document.getElementById("filter-region");
    const genderSelect = document.getElementById("filter-gender");
    const ageMinInput = document.getElementById("filter-age-min");
    const ageMaxInput = document.getElementById("filter-age-max");
    const categorySelect = document.getElementById("filter-category");
    const tagsSelect = document.getElementById("filter-tags");
    const paymentMethodSelect = document.getElementById("filter-payment-method");
    const dateFromInput = document.getElementById("filter-date-from");
    const dateToInput = document.getElementById("filter-date-to");
    const resetButton = document.getElementById("filters-reset");
    const sortSelect = document.getElementById("sort-by");

    // Optional: load distinct values for filters from backend.
    try {
        const metadata = await fetchFilterMetadata();
        populateMultiSelect(regionSelect, metadata.customer_region);
        populateMultiSelect(genderSelect, metadata.gender);
        populateMultiSelect(categorySelect, metadata.product_category);
        populateMultiSelect(tagsSelect, metadata.tags);
        populateMultiSelect(paymentMethodSelect, metadata.payment_method);
    } catch (e) {
        // In case /filters is not implemented, you can ignore this and hardcode options if required.
        console.warn("Failed to load filter metadata:", e);
    }

    function emitChange(extra) {
        const sortValue = sortSelect ? sortSelect.value : "date_desc";
        const [sortBy, sortOrder] = parseSortValue(sortValue);

        const payload = {
            searchName: searchNameInput?.value.trim() || "",
            searchPhone: searchPhoneInput?.value.trim() || "",
            customerRegion: getMultiSelectValues(regionSelect),
            gender: getMultiSelectValues(genderSelect),
            ageMin: ageMinInput?.value,
            ageMax: ageMaxInput?.value,
            productCategory: getMultiSelectValues(categorySelect),
            tags: getMultiSelectValues(tagsSelect),
            paymentMethod: getMultiSelectValues(paymentMethodSelect),
            dateFrom: dateFromInput?.value,
            dateTo: dateToInput?.value,
            sortBy,
            sortOrder,
            ...extra
        };

        onChange(payload);
    }

    const inputs = [
        searchNameInput,
        searchPhoneInput,
        regionSelect,
        genderSelect,
        ageMinInput,
        ageMaxInput,
        categorySelect,
        tagsSelect,
        paymentMethodSelect,
        dateFromInput,
        dateToInput,
        sortSelect
    ];

    inputs.forEach((el) => {
        if (!el) return;
        const eventName = el.tagName === "SELECT" ? "change" : "input";
        el.addEventListener(eventName, () => emitChange({ page: 1 }));
    });

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            if (searchNameInput) searchNameInput.value = "";
            if (searchPhoneInput) searchPhoneInput.value = "";
            clearMultiSelect(regionSelect);
            clearMultiSelect(genderSelect);
            if (ageMinInput) ageMinInput.value = "";
            if (ageMaxInput) ageMaxInput.value = "";
            clearMultiSelect(categorySelect);
            clearMultiSelect(tagsSelect);
            clearMultiSelect(paymentMethodSelect);
            if (dateFromInput) dateFromInput.value = "";
            if (dateToInput) dateToInput.value = "";
            if (sortSelect) sortSelect.value = "date_desc";

            emitChange({ page: 1 });
        });
    }

    // Emit initial change so the main app can load first page.
    emitChange({ page: 1 });
}

function populateMultiSelect(select, values) {
    if (!select || !Array.isArray(values)) return;
    select.innerHTML = "";
    values.forEach((v) => {
        const option = document.createElement("option");
        option.value = v;
        option.textContent = v;
        select.appendChild(option);
    });
}

function clearMultiSelect(select) {
    if (!select) return;
    Array.from(select.options).forEach((opt) => {
        opt.selected = false;
    });
}

function getMultiSelectValues(select) {
    if (!select) return [];
    return Array.from(select.selectedOptions).map((opt) => opt.value);
}

function parseSortValue(value) {
    switch (value) {
        case "quantity_asc":
            return ["quantity", "asc"];
        case "quantity_desc":
            return ["quantity", "desc"];
        case "customer_name_asc":
            return ["customer_name", "asc"];
        case "customer_name_desc":
            return ["customer_name", "desc"];
        case "date_desc":
        default:
            return ["date", "desc"];
    }
}
