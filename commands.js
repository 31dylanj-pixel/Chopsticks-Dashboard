/* Commands - rendering only. Commands live in data/commands.js */

const categoryNames = {
    games: "Games",
    social: "Social",
    profile: "Profile",
    prestige: "Prestige",
    shops: "Shops",
    cards: "Cards",
    utilities: "Utilities"
};

const commandContainer = document.getElementById("commands-container");
const commandChips = document.getElementById("command-chips");

commandChips.innerHTML =
    CH.chipHtml(Object.keys(commands), key => categoryNames[key] || CH.cap(key)) +
    `<button class="chip" type="button" data-chip="status:available" aria-pressed="false">Available</button>` +
    `<button class="chip" type="button" data-chip="status:coming soon" aria-pressed="false">Coming soon</button>`;

for (const category in commands) {
    const section = document.createElement("section");
    section.className = "block";

    section.innerHTML = `
        <div class="block-head">
            <div>
                <span class="block-label">${CH.escapeHtml(category.toUpperCase())}</span>
                <h2>${CH.escapeHtml(categoryNames[category] || CH.cap(category))}</h2>
            </div>
            <span class="count-pill">${commands[category].length} COMMANDS</span>
        </div>
        <div class="grid wide"></div>
    `;

    const grid = section.querySelector(".grid");

    commands[category].forEach(command => {
        const soon = command.status === "coming soon";

        const tile = document.createElement("article");
        tile.className = `tile hoverable${soon ? " is-soon" : ""}`;
        tile.dataset.group = category;
        tile.dataset.status = command.status;
        tile.dataset.search = `${command.name} ${command.usage} ${command.description} ${command.status} ${category}`.toLowerCase();

        tile.innerHTML = `
            <div class="tile-top">
                <span class="label-sm">${CH.escapeHtml(category.toUpperCase())}</span>
                <span class="badge ${soon ? "soon" : "ok"}">${soon ? "Coming soon" : "Available"}</span>
            </div>
            <h3>${CH.escapeHtml(command.name)}</h3>
            <code class="usage">${CH.escapeHtml(command.usage)}</code>
            <p class="meta">${CH.escapeHtml(command.description)}</p>
            <button class="chip copy-btn" type="button" data-copy="${CH.escapeHtml(command.usage)}" style="align-self:flex-start;margin-top:auto">Copy usage</button>
        `;
        grid.appendChild(tile);
    });

    commandContainer.appendChild(section);
}

/* copy-to-clipboard button */
commandContainer.addEventListener("click", async event => {
    const btn = event.target.closest(".copy-btn");
    if (!btn) return;
    try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copied!";
    } catch {
        btn.textContent = "Copy failed";
    }
    setTimeout(() => (btn.textContent = "Copy usage"), 1500);
});

/* search + category / status filter */
const cmdItems = [...commandContainer.querySelectorAll(".tile")];
const cmdSections = [...commandContainer.querySelectorAll(".block")];
const cmdSearch = document.getElementById("command-search");
const cmdCount = document.getElementById("command-count");
const cmdEmpty = document.getElementById("emptyState");
const cmdState = { query: "", chip: "all" };

function applyCommandFilter() {
    let visible = 0;
    cmdItems.forEach(item => {
        const textOk = !cmdState.query || item.dataset.search.includes(cmdState.query);
        let chipOk = true;
        if (cmdState.chip.startsWith("status:")) chipOk = item.dataset.status === cmdState.chip.slice(7);
        else if (cmdState.chip !== "all") chipOk = item.dataset.group === cmdState.chip;
        item.hidden = !(textOk && chipOk);
        if (!item.hidden) visible++;
    });
    cmdSections.forEach(s => s.hidden = !s.querySelector(".grid > :not([hidden])"));
    cmdCount.textContent = `${visible} commands`;
    cmdEmpty.hidden = visible !== 0;
}

cmdSearch.addEventListener("input", () => {
    cmdState.query = cmdSearch.value.toLowerCase().trim();
    applyCommandFilter();
});
commandChips.addEventListener("click", event => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    cmdState.chip = chip.dataset.chip;
    commandChips.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
    applyCommandFilter();
});
applyCommandFilter();
