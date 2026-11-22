/* ==========================================================
   Chopsticks Hub - home page
   ScrollCraft drives the text reveals, staggers, counters,
   zooms and parallax. ocean.js drives the Three.js dive.
   If the ScrollCraft CDN is unreachable, everything simply
   shows normally (no content is ever hidden by CSS).
========================================================== */

/* ---------- upcoming events (edit this list; finished ones are marked 'Ended') ---------- */
const EVENTS = [
    { type: "BAND / STRINGS CONCERT", title: "Harvest Showcase", note: "",            start: "2026-10-02", end: "2026-10-02", label: "OCT 02" },
    { type: "FNF",                     title: "FNF",              note: "Details TBD", start: "2026-10-02", end: "2026-10-02", label: "OCT 02" },
    { type: "SCHOOL",                  title: "Break",            note: "October Break", start: "2026-10-12", end: "2026-10-16", label: "OCT 12–16" },
    { type: "CAMP",                    title: "IGNITE CAMP",      note: "",            start: "2026-10-22", end: "2026-10-24", label: "OCT 22–24" }
];

function renderEvents() {
    const grid = document.getElementById("eventsGrid");
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

    grid.innerHTML = EVENTS.map(e => {
        const over = e.end < todayStr;
        return `
        <article class="event-card" ${over ? 'style="opacity:.6"' : ""}>
            <div class="event-top">
                <span class="event-type">${CH.escapeHtml(e.type)}</span>
                <span class="event-date">${CH.escapeHtml(e.label)}</span>
            </div>
            <h3>${CH.escapeHtml(e.title)}</h3>
            ${e.note ? `<p>${CH.escapeHtml(e.note)}</p>` : ""}
            ${over ? `<span class="badge plain" style="align-self:flex-start">Ended</span>` : ""}
        </article>`;
    }).join("");
}

/* ---------- live top 3 ---------- */
async function renderPodium() {
    const podium = document.getElementById("podium");
    const medals = ["🥇", "🥈", "🥉"];

    try {
        const response = await fetch(
            `${CH.SUPABASE_URL}/rest/v1/players?select=username,coins,title,prestige&order=prestige.desc,coins.desc&limit=3`,
            { headers: { apikey: CH.SUPABASE_KEY, Authorization: `Bearer ${CH.SUPABASE_KEY}` } }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const players = await response.json();
        if (!Array.isArray(players) || !players.length) throw new Error("empty");

        podium.innerHTML = players.map((p, i) => `
            <article class="podium-card" data-pod>
                <div class="pr">${medals[i]}</div>
                <h3>${CH.escapeHtml(p.username)}</h3>
                <div class="title">${CH.escapeHtml(p.title || "Rookie")}${Number(p.prestige) > 0 ? ` · Prestige ${Number(p.prestige)}` : ""}</div>
                <div class="coins">
                    <span data-count="${Number(p.coins) || 0}">${CH.full(p.coins)}</span>
                    <small>coins (${CH.short(p.coins)})</small>
                </div>
            </article>
        `).join("");

        return true;
    } catch (error) {
        podium.innerHTML = `<div class="podium-card podium-state">Could not load the leaderboard right now. <a href="leaderboard.html">Try the full page</a>.</div>`;
        return false;
    }
}

/* ---------- ScrollCraft ---------- */
async function startScrollCraft(hasPodium) {
    let ScrollCraft, scene;
    try {
        ({ ScrollCraft, scene } =
            await import("https://cdn.jsdelivr.net/npm/scroll-craft@0.1.0/+esm"));
    } catch (error) {
        console.warn("ScrollCraft could not be loaded - page is shown without scroll effects.", error);
        return;
    }

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches ||
        localStorage.getItem("reduceMotion") === "on";
    if (reduced) return;

    const step = (label, fn) => { try { fn(); } catch (e) { console.warn(`ScrollCraft: ${label} failed`, e); } };
    const sc = new ScrollCraft();

    step("title reveal",  () => sc.textReveal("#heroTitle", { type: "letters", stagger: 35 }));
    step("lead reveal",   () => sc.blurReveal("#heroLead", { blur: "10px", distance: "14px", duration: 800 }));
    step("badge parallax",() => sc.parallax("[data-parallax]", { speed: 0.25, axis: "y", clamp: 60 }));
    step("chapter titles",() => sc.textReveal(".split-title", { type: "words", stagger: 60 }));
    step("chapter panels",() => sc.blurReveal("[data-blur]", { blur: "12px", distance: "18px", duration: 700 }));
    step("game cards",    () => sc.stagger("#gameGrid", { children: ".feature-card", direction: "up", stagger: 90, duration: 600 }));
    step("info cards",    () => sc.stagger("#infoGrid", { children: ".feature-card", direction: "up", stagger: 90, duration: 600 }));
    step("events",        () => sc.stagger("#eventsGrid", { children: ".event-card", direction: "up", stagger: 90, duration: 600 }));
    step("panels",        () => sc.zoom(".panel[data-zoom]", { from: 0.95, duration: 650 }));

    if (hasPodium) {
        step("podium", () => sc.stagger("#podium", { children: ".podium-card", direction: "up", stagger: 120, duration: 650 }));
        step("coin counters", () => sc.counter("#podium [data-count]", {
            duration: 1400,
            formatter: n => Math.round(n).toLocaleString()
        }));
    }

    /* the hero fades while you leave the surface */
    step("hero scene", () => scene("#hero", [
        { target: ".hero-inner", from: { opacity: 1 }, to: { opacity: 0 }, start: 0.35, end: 0.95 }
    ]));
}

renderEvents();
const podiumLoaded = await renderPodium();
startScrollCraft(podiumLoaded);
