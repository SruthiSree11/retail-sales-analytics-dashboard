// components/dropdown.js
// Handles custom multi-select dropdowns for filters.

export const dropdownState = {
    region: [],
    gender: [],
    category: [],
    tags: [],
    payment: []
};

const defaultLabels = {
    region: "Region",
    gender: "Gender",
    category: "Product Category",
    tags: "Tags",
    payment: "Payment"
};

// Update shown label text
function updateLabel(fieldKey, labelEl) {
    const values = dropdownState[fieldKey];

    if (!values || values.length === 0) {
        labelEl.textContent = defaultLabels[fieldKey];
    } else if (values.length === 1) {
        labelEl.textContent = values[0];
    } else {
        labelEl.textContent = `${values[0]} (+${values.length - 1})`;
    }
}

// Create one dropdown menu
function setupDropdown({ fieldKey, btnId, menuId, labelId, options, onChange }) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    const labelEl = document.getElementById(labelId);

    if (!btn || !menu || !labelEl) {
        console.error("Dropdown element missing:", fieldKey);
        return;
    }

    // Toggle menu
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("hidden");
    });

    // Close menu on outside click
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.add("hidden");
        }
    });

    // Build menu items
    menu.innerHTML = "";
    (options || []).forEach((value) => {
        const item = document.createElement("button");
        item.type = "button";
        item.textContent = value;
        item.dataset.dropdown = fieldKey;
        item.dataset.value = value;
        item.className =
            "block w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100";

        item.addEventListener("click", () => {
            let arr = dropdownState[fieldKey];
            const idx = arr.indexOf(value);

            if (idx === -1) {
                arr.push(value);
                item.classList.add("bg-slate-100", "font-medium");
            } else {
                arr.splice(idx, 1);
                item.classList.remove("bg-slate-100", "font-medium");
            }

            updateLabel(fieldKey, labelEl);
            menu.classList.add("hidden");

            onChange();
        });

        menu.appendChild(item);
    });

    // Set initial label
    updateLabel(fieldKey, labelEl);
}

// Initialize ALL dropdowns with metadata
export function initDropdowns(metadata, onChange) {
    console.log("Dropdown metadata received:", metadata);

    // MATCH YOUR BACKEND EXACTLY
    const regions = metadata.customer_region || [];
    const genders = metadata.gender || [];
    const categories = metadata.product_category || [];
    const tags = metadata.tags || [];
    const payments = metadata.payment_method || [];

    setupDropdown({
        fieldKey: "region",
        btnId: "btn-region",
        menuId: "region-menu",
        labelId: "filter-region-label",
        options: regions,
        onChange
    });

    setupDropdown({
        fieldKey: "gender",
        btnId: "btn-gender",
        menuId: "gender-menu",
        labelId: "filter-gender-label",
        options: genders,
        onChange
    });

    setupDropdown({
        fieldKey: "category",
        btnId: "btn-category",
        menuId: "category-menu",
        labelId: "filter-category-label",
        options: categories,
        onChange
    });

    setupDropdown({
        fieldKey: "tags",
        btnId: "btn-tags",
        menuId: "tags-menu",
        labelId: "filter-tags-label",
        options: tags,
        onChange
    });

    setupDropdown({
        fieldKey: "payment",
        btnId: "btn-payment",
        menuId: "payment-menu",
        labelId: "filter-payment-label",
        options: payments,
        onChange
    });
}

// Reset dropdowns fully
export function resetDropdowns() {
    dropdownState.region = [];
    dropdownState.gender = [];
    dropdownState.category = [];
    dropdownState.tags = [];
    dropdownState.payment = [];

    ["region", "gender", "category", "tags", "payment"].forEach((key) => {
        document
            .querySelectorAll(`[data-dropdown="${key}"]`)
            .forEach((i) => i.classList.remove("bg-slate-100", "font-medium"));

        const lab = document.getElementById(`filter-${key}-label`);
        lab.textContent = defaultLabels[key];
    });
}
