// main.js
// Coordinates dropdowns, filters, API calls, table and pagination.

import { fetchSales, fetchFilterMetadata } from "./services/api.js";
import {
    renderTable,
    renderResultSummary,
    renderStats,
    showLoading,
    showError,
} from "./components/table.js";
import { renderPagination } from "./components/pagination.js";
import {
    initDropdowns,
    dropdownState,
    resetDropdowns,
} from "./components/dropdown.js";

const DEFAULT_STATE = {
    search_name: "",
    search_phone: "",
    customer_region: "",
    gender: "",
    age_min: "",
    age_max: "",
    product_category: "",
    tags: "",
    payment_method: "",
    date_from: "",
    date_to: "",
    sort_by: "date",
    sort_order: "desc",
    page: 1,
    page_size: 10,
};

let appState = { ...DEFAULT_STATE };

/**
 * Helper to merge new state and reload.
 */
async function updateStateAndReload(partial) {
    appState = { ...appState, ...partial };
    await loadData();
}

/**
 * Fetch from backend and update UI.
 */
async function loadData() {
    try {
        showLoading();
        const response = await fetchSales(appState);

        const items = response.items || [];
        const page = response.page || appState.page;
        const pageSize = response.page_size || appState.page_size;
        const totalItems = response.total_items || 0;
        const totalPages = response.total_pages || 1;

        appState.page = page;
        appState.page_size = pageSize;

        renderTable(items);
        renderResultSummary(page, pageSize, totalItems);

        renderPagination({
            page,
            totalPages,
            onPageChange: (nextPage) => updateStateAndReload({ page: nextPage }),
        });

        if (response.stats) {
            renderStats(response.stats);
        }
    } catch (err) {
        console.error("Load error:", err);
        showError();
    }
}

/**
 * Wire up non-dropdown filters: age, date, search, sort, reset.
 */
function initBasicFilters() {
    // Age
    const ageMinEl = document.getElementById("filter-age-min");
    const ageMaxEl = document.getElementById("filter-age-max");

    ageMinEl.addEventListener("input", () => {
        updateStateAndReload({
            age_min: ageMinEl.value || "",
            page: 1,
        });
    });

    ageMaxEl.addEventListener("input", () => {
        updateStateAndReload({
            age_max: ageMaxEl.value || "",
            page: 1,
        });
    });

    // Dates
    const dateFromEl = document.getElementById("filter-date-from");
    const dateToEl = document.getElementById("filter-date-to");

    dateFromEl.addEventListener("change", () => {
        updateStateAndReload({
            date_from: dateFromEl.value || "",
            page: 1,
        });
    });

    dateToEl.addEventListener("change", () => {
        updateStateAndReload({
            date_to: dateToEl.value || "",
            page: 1,
        });
    });

    // Search (name / phone)
    const searchEl = document.getElementById("search-name");
    searchEl.addEventListener("input", () => {
        updateStateAndReload({
            search_name: searchEl.value.trim(),
            page: 1,
        });
    });

    // Sort
    
    document.getElementById("sort-by").addEventListener("change", () => {
    const raw = document.getElementById("sort-by").value;
    const [sort_by, sort_order] = raw.split("-");

    updateStateAndReload({
        sort_by,
        sort_order,
        page: 1
    });
   });


    // Reset filters
    const resetBtn = document.getElementById("filters-reset");
    resetBtn.addEventListener("click", () => {
        // Reset state
        appState = { ...DEFAULT_STATE };

        // Reset basic inputs
        ageMinEl.value = "";
        ageMaxEl.value = "";
        dateFromEl.value = "";
        dateToEl.value = "";
        searchEl.value = "";
        sortEl.value = "date_desc";

        // Reset dropdowns (region, gender, category, tags, payment)
        resetDropdowns();

        // Reload
        loadData();
    });
}

/**
 * Apply dropdown state (region, gender, category, tags, payment) to appState.
 */
function applyDropdownFilters() {
    updateStateAndReload({
        customer_region: dropdownState.region.join(","),
        gender: dropdownState.gender.join(","),
        product_category: dropdownState.category.join(","),
        tags: dropdownState.tags.join(","),
        payment_method: dropdownState.payment.join(","),
        page: 1,
    });
}

/**
 * Bootstrap everything once DOM is ready.
 */
document.addEventListener("DOMContentLoaded", async () => {
    // Load metadata and init dropdowns
    const metadata = await fetchFilterMetadata();
    await initDropdowns(metadata, applyDropdownFilters);

    // Wire up basic inputs
    initBasicFilters();

    // Initial load
    await loadData();
});
