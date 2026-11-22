/* Shop - rendering only. Items live in data/shop.js */

const SHOP_NAMES = {
    titles: "Title Shop",
    general: "General Shop",
    prestige: "Prestige Shop"
};

const SHOP_DESCRIPTIONS = {
    titles: "Customize your identity with exclusive Chopsticks titles.",
    general: "Useful items and consumables for your Chopsticks journey.",
    prestige: "Permanent upgrades purchased with Prestige progression."
};

const shopContainer = document.getElementById("shop-container");
const shopChips = document.getElementById("shop-chips");

/* chips: one per shop + status filters */
shopChips.innerHTML =
    CH.chipHtml(Object.keys(shops), key => SHOP_NAMES[key] || CH.cap(key)) +
    `<button class="chip" type="button" data-chip="status:available" aria-pressed="false">Available</button>` +
    `<button class="chip" type="button" data-chip="status:coming soon" aria-pressed="false">Coming soon</button>`;

for (const shop in shops) {
    const section = document.createElement("section");
    section.className = "block";

    section.innerHTML = `
        <div class="block-head">
            <div>
                <span class="block-label">${CH.escapeHtml(shop.toUpperCase())}</span>
                <h2>${CH.escapeHtml(SHOP_NAMES[shop] || CH.cap(shop))}</h2>
                <p>${CH.escapeHtml(SHOP_DESCRIPTIONS[shop] || "")}</p>
            </div>
            <span class="count-pill">${shops[shop].length} ITEMS</span>
        </div>
        <div class="grid wide"></div>
    `;

    const grid = section.querySelector(".grid");

    shops[shop].forEach(item => {
        const soon = item.status === "coming soon";
        const hasCost = item.cost !== undefined;
        const info = item.description || item.info || "";

        const tile = document.createElement("article");
        tile.className = `tile hoverable${soon ? " is-soon" : ""}`;
        tile.dataset.group = shop;
        tile.dataset.status = item.status;
        tile.dataset.search = `${item.name} ${item.cost || ""} ${info} ${item.status} ${shop}`
            .replace(/<[^>]*>/g, " ").toLowerCase();

        tile.innerHTML = `
            <div class="tile-top">
                <span class="label-sm">${CH.escapeHtml(shop.toUpperCase())}</span>
                <span class="badge ${soon ? "soon" : "ok"}">${soon ? "Coming soon" : "Available"}</span>
            </div>
            <h3>${CH.escapeHtml(item.name)}</h3>
            ${hasCost
                ? `<span class="value">💰 ${item.cost.toLocaleString()} coins <small>(${CH.short(item.cost)})</small></span>`
                : `<span class="value">⭐ Prestige upgrade</span>`}
            ${info ? `<p class="meta">${info}</p>` : ""}
        `;
        grid.appendChild(tile);
    });

    shopContainer.appendChild(section);
}

/* Shop needs the extra status chips, so extend the generic filter */
const shopItems = [...shopContainer.querySelectorAll(".tile")];
const shopSections = [...shopContainer.querySelectorAll(".block")];
const shopSearch = document.getElementById("shop-search");
const shopCount = document.getElementById("shop-count");
const shopEmpty = document.getElementById("emptyState");
const shopState = { query: "", chip: "all" };

function applyShopFilter() {
    let visible = 0;
    shopItems.forEach(item => {
        const textOk = !shopState.query || item.dataset.search.includes(shopState.query);
        let chipOk = true;
        if (shopState.chip.startsWith("status:")) chipOk = item.dataset.status === shopState.chip.slice(7);
        else if (shopState.chip !== "all") chipOk = item.dataset.group === shopState.chip;
        item.hidden = !(textOk && chipOk);
        if (!item.hidden) visible++;
    });
    shopSections.forEach(s => s.hidden = !s.querySelector(".grid > :not([hidden])"));
    shopCount.textContent = `${visible} items`;
    shopEmpty.hidden = visible !== 0;
}

shopSearch.addEventListener("input", () => {
    shopState.query = shopSearch.value.toLowerCase().trim();
    applyShopFilter();
});
shopChips.addEventListener("click", event => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    shopState.chip = chip.dataset.chip;
    shopChips.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
    applyShopFilter();
});
applyShopFilter();
