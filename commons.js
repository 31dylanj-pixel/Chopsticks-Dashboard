/* ==========================================================
   Chopsticks Hub - shared helpers + top navigation bar
========================================================== */

const CH = {
    escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    },

    /* 12500 -> "12.5K" */
    short(amount) {
        amount = Number(amount) || 0;
        const units = [
            [1e18, "Qi"], [1e15, "Qa"], [1e12, "T"],
            [1e9, "B"], [1e6, "M"], [1e3, "K"]
        ];
        for (const [value, symbol] of units) {
            if (amount >= value) {
                return (amount / value).toFixed(1).replace(".0", "") + symbol;
            }
        }
        return String(amount);
    },

    full(amount) {
        return (Number(amount) || 0).toLocaleString();
    },

    /* "🐟 Minnow" -> {emoji:"🐟", name:"Minnow"} */
    cap(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    SUPABASE_URL: "https://rualkoaojvjiqsudzgah.supabase.co",
    SUPABASE_KEY: "sb_publishable_oxTVjZfp9wvrrmG60Qm-cg_WsBD1pIE"
};

const NAV_LINKS = [
    ["index.html", "Home"],
    ["fish.html", "Fish"],
    ["cards.html", "Cards"],
    ["shop.html", "Shop"],
    ["commands.html", "Commands"],
    ["leaderboard.html", "Leaderboard"],
    ["releases.html", "Releases"],
    ["settings.html", "Settings"]
];

const ICON_MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const ICON_SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MENU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

function buildNav() {
    const file = location.pathname.split("/").pop() || "index.html";

    const nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.setAttribute("aria-label", "Main navigation");

    nav.innerHTML = `
        <a class="nav-brand" href="index.html" aria-label="Chopsticks Hub home">
            <span class="brand-mark">🥢</span>
            <span>CHOPSTICKS</span>
        </a>

        <ul class="nav-links" id="navLinks">
            ${NAV_LINKS.map(([href, label]) => `
                <li><a href="${href}" ${file === href ? 'aria-current="page"' : ""}>${label}</a></li>
            `).join("")}
        </ul>

        <div class="nav-actions">
            <div id="navAccount" class="nav-account-slot"></div>
            <button class="icon-btn" id="navTheme" type="button" aria-label="Toggle light and dark theme"></button>
            <button class="icon-btn nav-toggle" id="navToggle" type="button"
                    aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">${ICON_MENU}</button>
        </div>

        <div class="scroll-progress" id="navProgress"></div>
    `;

    document.body.prepend(nav);

    const links = nav.querySelector("#navLinks");
    const toggle = nav.querySelector("#navToggle");
    const themeBtn = nav.querySelector("#navTheme");

    toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    links.addEventListener("click", event => {
        if (event.target.closest("a")) {
            links.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            links.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });

    function paintThemeButton() {
        const dark = document.documentElement.classList.contains("dark-theme");
        themeBtn.innerHTML = dark ? ICON_SUN : ICON_MOON;
        themeBtn.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
    }

    themeBtn.addEventListener("click", () => {
        CH.setTheme(document.documentElement.classList.contains("dark-theme") ? "light" : "dark");
    });

    document.addEventListener("themechange", paintThemeButton);
    paintThemeButton();

    /* Reading progress bar */
    const bar = nav.querySelector("#navProgress");
    const update = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
}

CH.setTheme = function (theme) {
    const root = document.documentElement;
    root.classList.remove("dark-theme", "light-theme");
    root.classList.add(theme + "-theme");
    localStorage.setItem("theme", theme);
    document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
};

/* Small helper used by all list pages: search + filter chips + empty state */
CH.makeFilter = function ({ items, sections, searchInput, chips, countEl, emptyEl, itemName = "results" }) {
    const state = { query: "", chip: "all" };

    function apply() {
        let visible = 0;

        items.forEach(item => {
            const matchText = !state.query || item.dataset.search.includes(state.query);
            const matchChip = state.chip === "all" || item.dataset.group === state.chip;
            const show = matchText && matchChip;
            item.hidden = !show;
            if (show) visible++;
        });

        sections.forEach(section => {
            section.hidden = !section.querySelector(":scope .grid > :not([hidden])");
        });

        if (countEl) countEl.textContent = `${visible} ${itemName}`;
        if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    searchInput?.addEventListener("input", () => {
        state.query = searchInput.value.toLowerCase().trim();
        apply();
    });

    chips?.addEventListener("click", event => {
        const chip = event.target.closest(".chip");
        if (!chip) return;
        state.chip = chip.dataset.chip;
        chips.querySelectorAll(".chip").forEach(c =>
            c.setAttribute("aria-pressed", String(c === chip))
        );
        apply();
    });

    apply();
    return state;
};

CH.chipHtml = function (values, labelFn = v => v) {
    return `<button class="chip" type="button" data-chip="all" aria-pressed="true">All</button>` +
        values.map(v => `<button class="chip" type="button" data-chip="${CH.escapeHtml(v)}" aria-pressed="false">${CH.escapeHtml(labelFn(v))}</button>`).join("");
};

CH.SEARCH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

document.addEventListener("DOMContentLoaded", buildNav);
