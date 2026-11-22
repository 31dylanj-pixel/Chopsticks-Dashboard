/* Fish Library - rendering only.
   Fish names, values and overviews live in data/fish.js */

const fishContainer = document.getElementById("fish-container");
const fishChips = document.getElementById("fish-chips");

fishChips.innerHTML = CH.chipHtml(Object.keys(fishTable), CH.cap);

for (const rarity in fishTable) {
    const section = document.createElement("section");
    section.className = "block";
    section.dataset.rarity = rarity;

    section.innerHTML = `
        <div class="block-head">
            <div>
                <span class="block-label rarity-name">RARITY</span>
                <h2 class="rarity-name">${CH.escapeHtml(CH.cap(rarity))}</h2>
            </div>
            <span class="count-pill">${fishTable[rarity].length} FISH</span>
        </div>
        <div class="grid"></div>
    `;

    const grid = section.querySelector(".grid");

    fishTable[rarity].forEach(([name, value]) => {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "tile";
        tile.dataset.rarity = rarity;
        tile.dataset.group = rarity;
        tile.dataset.fish = name;
        tile.dataset.search = `${name} ${rarity}`.toLowerCase();
        tile.innerHTML = `
            <h3>${CH.escapeHtml(name)}</h3>
            <span class="value">💰 ${value.toLocaleString()}
                ${value >= 1000 ? `<small>(${CH.short(value)})</small>` : ""}
            </span>
            <span class="hint">View profile</span>
        `;
        grid.appendChild(tile);
    });

    fishContainer.appendChild(section);
}

CH.makeFilter({
    items: [...fishContainer.querySelectorAll(".tile")],
    sections: [...fishContainer.querySelectorAll(".block")],
    searchInput: document.getElementById("fish-search"),
    chips: fishChips,
    countEl: document.getElementById("fish-count"),
    emptyEl: document.getElementById("emptyState"),
    itemName: "fish"
});

/* ---------- profile popup ---------- */

const fishModal = document.getElementById("fish-modal");
const fishModalName = document.getElementById("fish-modal-name");
const fishModalRarity = document.getElementById("fish-modal-rarity");
const fishModalValue = document.getElementById("fish-modal-value");
const fishModalImage = document.getElementById("fish-modal-image");
const fishModalOverview = document.getElementById("fish-modal-overview-text");
const fishModalClose = document.getElementById("fish-modal-close");
let lastFocus = null;

const FANTASY_HTML = `<div class="fantasy-fish-message">This is a fantasy fish.</div>`;

function findFishData(fishName) {
    for (const rarity in fishTable) {
        const fish = fishTable[rarity].find(item => item[0] === fishName);
        if (fish) {
            return { name: fish[0], value: fish[1], rarity, info: fishInfo[fishName] || {} };
        }
    }
    return null;
}

function openFishProfile(fishName) {
    const fish = findFishData(fishName);
    if (!fish) return;

    fishModalName.textContent = fish.name;

    fishModalRarity.textContent = fish.rarity.toUpperCase();
    fishModalRarity.dataset.rarity = fish.rarity;

    fishModalValue.textContent =
        `💰 ${fish.value.toLocaleString()} coins` +
        (fish.value >= 1000 ? ` (${CH.short(fish.value)})` : "");

    fishModalImage.innerHTML = FANTASY_HTML;
    if (fish.info.image) {
        const img = new Image();
        img.className = "fish-profile-image";
        img.alt = fish.name;
        img.onload = () => fishModalImage.replaceChildren(img);   /* only swap in when the file really exists */
        img.src = fish.info.image;
    }

    /* Overview text is written by the fish author in data/fish.js */
    fishModalOverview.innerHTML = fish.info.overview || "Overview coming soon.";

    lastFocus = document.activeElement;
    fishModal.classList.add("active");
    document.body.classList.add("modal-open");
    fishModalClose.focus();
}

function closeFishProfile() {
    fishModal.classList.remove("active");
    document.body.classList.remove("modal-open");
    lastFocus?.focus?.();
}

fishContainer.addEventListener("click", event => {
    const tile = event.target.closest(".tile");
    if (tile) openFishProfile(tile.dataset.fish);
});
fishModalClose.addEventListener("click", closeFishProfile);
fishModal.addEventListener("click", event => {
    if (event.target === fishModal) closeFishProfile();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && fishModal.classList.contains("active")) closeFishProfile();
});
