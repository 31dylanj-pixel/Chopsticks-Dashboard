/* Card Library - rendering only. Card names and values live in data/cards.js */

const cardContainer = document.getElementById("card-container");
const cardChips = document.getElementById("card-chips");

cardChips.innerHTML = CH.chipHtml(Object.keys(cards), CH.cap);

for (const rarity in cards) {
    const section = document.createElement("section");
    section.className = "block";
    section.dataset.rarity = rarity;

    section.innerHTML = `
        <div class="block-head">
            <div>
                <span class="block-label rarity-name">RARITY</span>
                <h2 class="rarity-name">${CH.escapeHtml(CH.cap(rarity))}</h2>
            </div>
            <span class="count-pill">${cards[rarity].length} CARDS</span>
        </div>
        <div class="grid"></div>
    `;

    const grid = section.querySelector(".grid");

    cards[rarity].forEach(([name, value]) => {
        const tile = document.createElement("article");
        tile.className = "tile hoverable";
        tile.dataset.rarity = rarity;
        tile.dataset.group = rarity;
        tile.dataset.search = `${name} ${rarity}`.toLowerCase();
        tile.innerHTML = `
            <h3>${CH.escapeHtml(name)}</h3>
            <span class="meta">Sell value</span>
            <span class="value">💰 ${value.toLocaleString()} coins
                ${value >= 1000 ? `<small>(${CH.short(value)})</small>` : ""}
            </span>
        `;
        grid.appendChild(tile);
    });

    cardContainer.appendChild(section);
}

CH.makeFilter({
    items: [...cardContainer.querySelectorAll(".tile")],
    sections: [...cardContainer.querySelectorAll(".block")],
    searchInput: document.getElementById("card-search"),
    chips: cardChips,
    countEl: document.getElementById("card-count"),
    emptyEl: document.getElementById("emptyState"),
    itemName: "cards"
});
