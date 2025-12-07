// components/table.js
// Responsible for rendering the sales data table and display states.

const tableBody = document.getElementById("table-body");
const emptyState = document.getElementById("empty-state");
const errorState = document.getElementById("error-state");
const loadingState = document.getElementById("loading-state");
const resultSummary = document.getElementById("result-summary");
const statsBar = document.getElementById("stats-bar");
const tableWrapper = document.getElementById("table-wrapper");

function formatDate(isoStr) {
    if (!isoStr) return "-";
    const d = new Date(isoStr);
    if (isNaN(d)) return isoStr;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;   
}


function formatINR(value) {
    if (value == null || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return "₹ " + num.toLocaleString("en-IN");
}

/**
 * Show / hide loading, error, empty vs table.
 */
function setStates({ isLoading, isError, isEmpty }) {
    if (loadingState) {
        loadingState.classList.toggle("hidden", !isLoading);
    }
    if (errorState) {
        errorState.classList.toggle("hidden", !isError);
    }
    if (emptyState) {
        emptyState.classList.toggle("hidden", !isEmpty);
    }

    if (tableWrapper) {
        const hideTable = isLoading || isError || isEmpty;
        tableWrapper.classList.toggle("opacity-60", hideTable);
    }
}

/**
 * Render rows into table.
 */
export function renderTable(items) {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!items || items.length === 0) {
        setStates({ isLoading: false, isError: false, isEmpty: true });
        return;
    }

    setStates({ isLoading: false, isError: false, isEmpty: false });

    for (const row of items) {
        const tr = document.createElement("tr");
        tr.className =
            "border-b border-slate-100 hover:bg-slate-50 transition-colors";

        const cells = [
            row.transaction_id,
            formatDate(row.date),
            row.customer_id,
            `<span class="font-medium text-slate-900">${row.customer_name ?? "-"}</span>`,
            row.phone_number,
            row.gender,
            `<span class="inline-flex justify-center w-full">${row.age ?? "-"}</span>`,
            row.product_category,
            `<span class="inline-flex justify-end w-full">${row.quantity ?? "-"}</span>`,
            `<span class="inline-flex justify-end w-full">${formatINR(
                row.total_amount ?? row.final_amount
            )}</span>`,
        ];

        cells.forEach((value, idx) => {
            const td = document.createElement("td");
            td.className = "px-3 py-2 align-top";
            // For numeric columns we already wrapped with span + classes
            if (typeof value === "string" && value.startsWith("<span")) {
                td.innerHTML = value;
            } else {
                td.textContent = value != null && value !== "" ? value : "-";
            }
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    }
}

/**
 * "Showing X–Y of Z results"
 */
export function renderResultSummary(page, pageSize, totalItems) {
    if (!resultSummary) return;

    if (totalItems === 0) {
        resultSummary.textContent = "No results found.";
        return;
    }

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);
    resultSummary.textContent = `Showing ${start}–${end} of ${totalItems} results`;
}

/**
 * Stats cards in header.
 */
export function renderStats(stats) {
    if (!statsBar || !stats) return;

    statsBar.innerHTML = "";

    const items = [
        { label: "Total Units Sold", value: stats.total_quantity },
        { label: "Total Amount", value: formatINR(stats.total_amount) },
        { label: "Total Discount", value: formatINR(stats.total_discount) },
    ];

    items.forEach((item) => {
        const div = document.createElement("div");
        div.className =
            "bg-slate-900 text-slate-50 rounded-full px-4 py-2 text-xs flex items-baseline gap-2 shadow-card";

        const label = document.createElement("span");
        label.className = "text-slate-400";
        label.textContent = item.label;

        const value = document.createElement("span");
        value.className = "font-semibold";
        value.textContent =
            item.value == null || item.value === "" ? "-" : String(item.value);

        div.appendChild(label);
        div.appendChild(value);
        statsBar.appendChild(div);
    });
}

export function showLoading() {
    setStates({ isLoading: true, isError: false, isEmpty: false });
}

export function showError() {
    setStates({ isLoading: false, isError: true, isEmpty: false });
}
