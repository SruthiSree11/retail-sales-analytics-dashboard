// components/pagination.js
// Renders numbered pagination controls.

export function renderPagination({ page, totalPages, onPageChange }) {
    const bar = document.getElementById("pagination-bar");
    if (!bar) return;

    bar.innerHTML = "";

    if (!totalPages || totalPages <= 1) {
        return;
    }

    const container = document.createElement("div");
    container.className =
        "flex items-center justify-between text-sm text-slate-700";

    // Left info
    const info = document.createElement("div");
    info.textContent = `Page ${page} of ${totalPages}`;
    container.appendChild(info);

    // Right: controls
    const controls = document.createElement("div");
    controls.className = "flex items-center gap-1";

    function makeButton(label, disabled, onClick, isActive = false) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = label;
        btn.disabled = disabled;
        btn.className =
            "min-w-[2rem] px-2 py-1 rounded-md border text-sm " +
            (isActive
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100") +
            (disabled ? " opacity-50 cursor-default" : "");

        if (!disabled && onClick) {
            btn.addEventListener("click", onClick);
        }
        return btn;
    }

    // Previous
    controls.appendChild(
        makeButton(
            "‹",
            page <= 1,
            () => onPageChange(Math.max(1, page - 1))
        )
    );

    // Page numbers around current
    const windowSize = 2;
    let start = Math.max(1, page - windowSize);
    let end = Math.min(totalPages, page + windowSize);

    if (start > 1) {
        controls.appendChild(
            makeButton("1", false, () => onPageChange(1), page === 1)
        );
        if (start > 2) {
            const dots = document.createElement("span");
            dots.textContent = "…";
            dots.className = "px-1";
            controls.appendChild(dots);
        }
    }

    for (let p = start; p <= end; p++) {
        controls.appendChild(
            makeButton(
                String(p),
                false,
                () => onPageChange(p),
                p === page
            )
        );
    }

    if (end < totalPages) {
        if (end < totalPages - 1) {
            const dots = document.createElement("span");
            dots.textContent = "…";
            dots.className = "px-1";
            controls.appendChild(dots);
        }
        controls.appendChild(
            makeButton(
                String(totalPages),
                false,
                () => onPageChange(totalPages),
                totalPages === page
            )
        );
    }

    // Next
    controls.appendChild(
        makeButton(
            "›",
            page >= totalPages,
            () => onPageChange(Math.min(totalPages, page + 1))
        )
    );

    container.appendChild(controls);
    bar.appendChild(container);
}
