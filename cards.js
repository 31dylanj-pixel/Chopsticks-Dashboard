const cards = {

    common: [
        ["🌿 Seaweed Card",20],
        ["🐟 Minnow Card",25],
        ["🍋 Lemon Card",25],
        ["🎣 Fisherman Card",25],
        ["🦀 Crab Card",25],
        ["🐡 Pufferfish Card",25],
        ["🐠 Baitfish Card",25],
        ["⭐ Starfish Card",30]
    ],

    rare: [
        ["🦑 Squid Card",100],
        ["💎 Diamond Card",100],
        ["🐙 Octopus Card",100],
        ["🦞 Lobster Card",100],
        ["🪼 Jellyfish Card",110],
        ["⚡ Eel Card",120],
        ["💡 Anglerfish Card",150],
        ["🔱 Trident Card",200]
    ],

    epic: [
        ["🦈 Shark Card",500],
        ["🐋 Whale Card",500],
        ["🌊 Tsunami Card",500],
        ["🐙 Kraken Card",600],
        ["⛈️ Storm Whale Card",650],
        ["🪸 Coral Guardian Card",700]
    ],

    legendary: [
        ["🐉 Leviathan Card",2000],
        ["👑 Sea Emperor Card",2000],
        ["🐲 Abyss Dragon Card",2500],
        ["👁 Kraken Lord Card",3000]
    ],

    mythic: [
        ["✨ Halo Card",7500],
        ["🥢 Chopsticks God Card",10000],
        ["🌌 Void Leviathan Card",12000],
        ["🌊 Ocean Prime Card",15000]
    ]
};

function formatCoins(amount) {

    if (amount >= 1000000000000) {

        return (amount / 1000000000000).toFixed(1).replace(".0", "") + "T";

    }

    if (amount >= 1000000000) {

        return (amount / 1000000000).toFixed(1).replace(".0", "") + "B";

    }


    if (amount >= 1000000) {

        return (amount / 1000000).toFixed(1).replace(".0", "") + "M";

    }


    if (amount >= 1000) {

        return (amount / 1000).toFixed(1).replace(".0", "") + "K";

    }


    return amount;

}

const container = document.getElementById("card-container");

for (let rarity in cards) {

    container.innerHTML += `
        <div class="rarity-section">

            <h1 class="rarity-title rarity-${rarity}">
                ${rarity}
            </h1>

            <div class="fish-grid"></div>

        </div>
    `;

    const section =
        container.lastElementChild.querySelector(".fish-grid");

    cards[rarity].forEach(card => {

        section.innerHTML += `
            <div class="card ${rarity}">

                <h2>${card[0]}</h2>

                <p>
                    💰 Sell Value:
                    ${card[1]} coins
                    ${card[1] >= 1000
                        ? `(${formatCoins(card[1])})`
                        : ""}
                </p>

            </div>
        `;
    });
}

const searchBar = document.getElementById("card-search");

searchBar.addEventListener("input", function () {

    const search = searchBar.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {

        const name =
            card.querySelector("h2").textContent.toLowerCase();

        card.style.display =
            name.includes(search) ? "flex" : "none";

    });

});
