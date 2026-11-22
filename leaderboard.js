/* Leaderboard - live data from the bot (Supabase), refreshed every 15 seconds */

const lbEl = document.getElementById("leaderboard");
const lbSearch = document.getElementById("lb-search");
const lbCount = document.getElementById("lb-count");
const lbUpdated = document.getElementById("lb-updated");

let players = [];
let openName = null;

function showSkeleton() {
    lbEl.innerHTML = Array.from({ length: 6 }, () => `<div class="skeleton"></div>`).join("");
}

function showError(message) {
    lbEl.innerHTML = `
        <div class="empty-state">
            <strong>Leaderboard unavailable</strong>
            ${CH.escapeHtml(message)}<br><br>
            <button class="btn" type="button" id="lb-retry">Try again</button>
        </div>`;
    document.getElementById("lb-retry").addEventListener("click", () => { showSkeleton(); loadLeaderboard(); });
    lbCount.textContent = "";
}

async function loadLeaderboard() {
    try {
        const response = await fetch(
            `${CH.SUPABASE_URL}/rest/v1/players?select=username,coins,title,prestige,daily_streak,stats&order=prestige.desc,coins.desc&limit=50`,
            { headers: { apikey: CH.SUPABASE_KEY, Authorization: `Bearer ${CH.SUPABASE_KEY}` } }
        );
        if (!response.ok) throw new Error(`The server answered with status ${response.status}.`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response from the server.");

        players = data;
        lbUpdated.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
        renderLeaderboard();
    } catch (error) {
        /* keep showing old data if we already have some */
        if (!players.length) showError(error.message || "Could not reach the server.");
        else lbUpdated.textContent = "Offline - showing last known data";
    }
}

function renderLeaderboard() {
    const query = lbSearch.value.toLowerCase().trim();
    const medals = ["🥇", "🥈", "🥉"];
    const rows = players
        .map((player, index) => ({ player, rank: index + 1 }))
        .filter(({ player }) => !query || String(player.username).toLowerCase().includes(query));

    lbCount.textContent = `${rows.length} player${rows.length === 1 ? "" : "s"}`;

    if (!rows.length) {
        lbEl.innerHTML = `<div class="empty-state"><strong>${players.length ? "No players match" : "No players yet"}</strong>${players.length ? "Try a different name." : "Be the first to earn coins!"}</div>`;
        return;
    }

    lbEl.innerHTML = rows.map(({ player, rank }) => {
        const coins = Number(player.coins) || 0;
        const streak = Number(player.daily_streak) || 0;
        const prestige = Number(player.prestige) || 0;
        const fish = Number(player.stats?.fish_caught) || 0;
        const slots = Number(player.stats?.slots_played) || 0;
        const earned = Number(player.stats?.coins_earned) || 0;
        const name = String(player.username ?? "Unknown");
        const open = openName === name;
        const cls = rank === 1 ? "top-one" : rank === 2 ? "top-two" : rank === 3 ? "top-three" : "";

        return `
        <article class="lb-card ${cls} ${open ? "open" : ""}" data-name="${CH.escapeHtml(name)}">
            <button class="lb-row" type="button" aria-expanded="${open}">
                <span class="lb-rank">${medals[rank - 1] || "#" + rank}</span>
                <span class="lb-name">
                    <strong class="lb-title">${CH.escapeHtml(name)}</strong>
                    <span>${CH.escapeHtml(player.title || "Rookie")}</span>
                </span>
                <span class="lb-prestige ${prestige > 0 ? "has" : ""}">${prestige > 0 ? "PRESTIGE " + prestige : "NO PRESTIGE"}</span>
                <span class="lb-coins">💰 ${CH.full(coins)}<small>${CH.short(coins)}</small></span>
            </button>
            <div class="lb-details">
                <div class="lb-detail"><span>🔥 DAILY STREAK</span><strong>${streak}</strong> <small>${streak === 1 ? "day" : "days"}</small></div>
                <div class="lb-detail"><span>🎣 FISH CAUGHT</span><strong>${CH.full(fish)}</strong></div>
                <div class="lb-detail"><span>🎰 SLOTS PLAYED</span><strong>${CH.full(slots)}</strong></div>
                <div class="lb-detail"><span>💰 COINS EARNED</span><strong>${CH.full(earned)}</strong> <small>(${CH.short(earned)})</small></div>
            </div>
        </article>`;
    }).join("");
}

lbEl.addEventListener("click", event => {
    const card = event.target.closest(".lb-card");
    if (!card || !event.target.closest(".lb-row")) return;
    openName = openName === card.dataset.name ? null : card.dataset.name;
    renderLeaderboard();
});

lbSearch.addEventListener("input", renderLeaderboard);

showSkeleton();
loadLeaderboard();
setInterval(() => { if (!document.hidden) loadLeaderboard(); }, 15000);
