const shops = {

    titles: [

        {
            name: "🐟 Rookie 🐟",
            cost: 100,
            status: "available"
        },

        {
            name: "🌱 Novice 🌱",
            cost: 200,
            status: "available"
        },

        {
            name: "🧭 Wanderer 🧭",
            cost: 300,
            status: "available"
        },

        {
            name: "🎣 Fisherman 🎣",
            cost: 500,
            status: "available"
        },

        {
            name: "📖 Collector 📖",
            cost: 750,
            status: "available"
        },

        {
            name: "🧭 Adventurer 🧭",
            cost: 750,
            status: "available"
        },

        {
            name: "🎣 Angler 🎣",
            cost: 1500,
            status: "available"
        },

        {
            name: "⚔ Gladiator ⚔",
            cost: 1500,
            status: "available"
        },

        {
            name: "👑 King 👑",
            cost: 2500,
            status: "available"
        },

        {
            name: "💰 Merchant 💰",
            cost: 5000,
            status: "available"
        },

        {
            name: "🏹 Expert 🏹",
            cost: 5000,
            status: "available"
        },

        {
            name: "⚓ Captain ⚓",
            cost: 15000,
            status: "available"
        },

        {
            name: "🔥 Master 🔥",
            cost: 15000,
            status: "available"
        },

        {
            name: "🌊 Sea Emperor 🌊",
            cost: 25000,
            status: "available"
        },

        {
            name: "✨🔥 Mythic Lord 🔥✨",
            cost: 50000,
            status: "available"
        },

        {
            name: "💼 Tycoon 💼",
            cost: 75000,
            status: "available"
        },

        {
            name: "💎 Millionaire 💎",
            cost: 1000000,
            status: "available"
        },

        {
            name: "🌌 Reminisce 🌌",
            cost: 2500000,
            status: "available"
        },

        {
            name: "🕰 Nostalgia 🕰",
            cost: 5000000000,
            status: "available"
        },

        {
            name: "🌠 Celestial 🌠",
            cost: 25000000000,
            status: "available"
        },

        {
            name: "♾ Infinite ♾",
            cost: 100000000000,
            status: "available"
        },

        {
            name: "🌀 Transcendent 🌀",
            cost: 500000000000,
            status: "available"
        },

        {
            name: "🥢 GOD OF CHOPSTICKS 🥢",
            cost: 1000000000000,
            status: "available"
        },

        {
            name: "🌑 Unfathomable 🌑",
            cost: 2500000000000,
            status: "available"
        },

        {
            name: "👁 Omniscient 👁",
            cost: 5000000000000,
            status: "available"
        },

        {
            name: "🎰 Slot Addict 🎰",
            cost: 7777777777777,
            status: "available"
        },

        {
            name: "🐟 Fishillionaire 🐟",
            cost: 9999999999999,
            status: "available"
        },

        {
            name: "🏗 Architect of Reality 🏗",
            cost: 10000000000000,
            status: "available"
        },

        {
            name: "💸 Tax Evasion Expert 💸",
            cost: 420000000000000000,
            status: "available"
        }

    ],

    general: [

        {
            name: "🧊 Streak Freeze",
            cost: 500000,
            info: "Allows you to perserve your streak even if you miss 1 day<br>Max: 10",
            status: "available"
        },

        {
            name: "🪙 Lucky Wave Token",
            cost: 100000000000000,
            info: "Allows you to call a Lucky Wave for 1 minute<br>Max: 1",
            status: "coming soon"
        }

    ],

    prestige: [

        {
            name: "💰 Coin Boost",
            info: "Max: 10 Levels",
            status: "available"
        },

        {
            name: "🎣 Fishing Luck",
            info: "Max: 10 Levels",
            status: "available"
        },

        {
            name: "🎰 Slot Luck",
            info: "Max: 10 Levels",
            status: "available"
        },

        {
            name: "📈 Cap Boost",
            info: "Max: 10 Levels",
            status: "available"
        },

        {
            name: "🏷 Custom Title",
            info: "Max: 1 Level",
            status: "available"
        }

    ]

};

function formatCoins(amount) {

    const units = [
        { value: 1e18, symbol: "Qi" }, // Quintillion
        { value: 1e15, symbol: "Qa" }, // Quadrillion
        { value: 1e12, symbol: "T" },  // Trillion
        { value: 1e9, symbol: "B" },   // Billion
        { value: 1e6, symbol: "M" },   // Million
        { value: 1e3, symbol: "K" }    // Thousand
    ];


    for (let unit of units) {

        if (amount >= unit.value) {

            return (amount / unit.value)
                .toFixed(1)
                .replace(".0", "") + unit.symbol;

        }

    }


    return amount;

}

const container = document.getElementById("shop-container");



for (let shop in shops) {

    container.innerHTML += `

        <div class="rarity-section">

            <h1 class="rarity-title">
                ${shop}
            </h1>

            <div class="fish-grid"></div>

        </div>

    `;

    const section =
        container.lastElementChild.querySelector(".fish-grid");

    shops[shop].forEach(item => {

        section.innerHTML += `

            <div class="card shop-card"
        
            data-search="${`
            ${item.name}
            ${typeof item.cost === "number" ? item.cost : item.info}
            ${item.status}
            ${shop}
            `.toLowerCase()}">
        
                <h2>
                    ${item.name}
                </h2>

                <p>

                ${
                    typeof item.cost === "number"

                    ? `💰 Cost: ${item.cost.toLocaleString()} coins
                    <br>
                    (${formatCoins(item.cost)})`

                    : item.info
                }

                </p>

                ${
                    item.status === "coming soon"

                    ?

                    `<span class="coming-soon">
                    🟡 Coming Soon
                    </span>`

                    :

                    `<span class="available">
                    🟢 Available
                    </span>`
                }

            </div>

        `;

    });

}


const searchBar = document.getElementById("shop-search");


searchBar.addEventListener("input", () => {


    const search = searchBar.value.toLowerCase();



    document.querySelectorAll("#shop-container .shop-card")
    .forEach(card => {


        const text =
        card.dataset.search;



        card.style.display =
        text.includes(search)
        ? "flex"
        : "none";


    });


});
