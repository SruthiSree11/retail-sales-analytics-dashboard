// services/api.js
// Small helper around fetch for backend API.

const API_BASE = "http://127.0.0.1:5000/api";

/**
 * Build query string from state, skipping empty values.
 */
function buildQuery(params) {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        const v = typeof value === "string" ? value.trim() : value;
        if (v === "" || Number.isNaN(v)) return;
        search.append(key, v);
    });
    return search.toString();
}

export async function fetchSales(state) {
    const qs = buildQuery(state);
    const url = `${API_BASE}/sales${qs ? "?" + qs : ""}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch sales: ${res.status}`);
    }
    return res.json();
}

export async function fetchFilterMetadata() {
    const res = await fetch(`${API_BASE}/filters`);
    if (!res.ok) {
        throw new Error(`Failed to fetch filters: ${res.status}`);
    }
    return res.json();
}
