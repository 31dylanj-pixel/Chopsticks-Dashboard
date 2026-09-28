const shops = {

    titles: [
        {
            name: "🐟 Rookie 🐟",
            cost: 100,
            description: "Every legend starts somewhere.",
            status: "available"
        },
        {
            name: "🌱 Novice 🌱",
            cost: 200,
            description: "The first steps toward something greater.",
            status: "available"
        },
        {
            name: "🧭 Wanderer 🧭",
            cost: 300,
            description: "For those who never stop exploring.",
            status: "available"
        },
        {
            name: "🎣 Fisherman 🎣",
            cost: 500,
            description: "Patience is its own reward.",
            status: "available"
        },
        {
            name: "📖 Collector 📖",
            cost: 750,
            description: "Those who collect, remember.",
            status: "available"
        },
        {
            name: "🧭 Adventurer 🧭",
            cost: 750,
            description: "For those who seek what lies beyond.",
            status: "available"
        },
        {
            name: "🎣 Angler 🎣",
            cost: 1500,
            description: "For those who have mastered the waiting game.",
            status: "available"
        },
        {
            name: "⚔ Gladiator ⚔",
            cost: 1500,
            description: "Earned through competition.",
            status: "available"
        },
        {
            name: "👑 King 👑",
            cost: 2500,
            description: "A crown means nothing without a kingdom.",
            status: "available"
        },
        {
            name: "💰 Merchant 💰",
            cost: 5000,
            description: "Know the value of every coin.",
            status: "available"
        },
        {
            name: "🏹 Expert 🏹",
            cost: 5000,
            description: "Precision comes with experience.",
            status: "available"
        },
        {
            name: "⚓ Captain ⚓",
            cost: 15000,
            description: "The sea follows those who lead.",
            status: "available"
        },
        {
            name: "🔥 Master 🔥",
            cost: 15000,
            description: "Skill refined beyond the ordinary.",
            status: "available"
        },
        {
            name: "🌊 Sea Emperor 🌊",
            cost: 25000,
            description: "The depths recognize their ruler.",
            status: "available"
        },
        {
            name: "✨🔥 Mythic Lord 🔥✨",
            cost: 50000,
            description: "Some titles become legends.",
            status: "available"
        },
        {
            name: "💼 Tycoon 💼",
            cost: 75000,
            description: "Fortune favors those who build it.",
            status: "available"
        },
        {
            name: "💎 Millionaire 💎",
            cost: 1000000,
            description: "A fortune worthy of recognition.",
            status: "available"
        },
        {
            name: "🌌 Reminisce 🌌",
            cost: 2500000,
            description: "Owned by those who have seen and thought the past, present, and future.",
            status: "available"
        },
        {
            name: "🕰 Nostalgia 🕰",
            cost: 5000000000,
            description: "For those who remember what others have forgotten.",
            status: "available"
        },
        {
            name: "🌠 Celestial 🌠",
            cost: 25000000000,
            description: "A title reserved for those who look beyond the ordinary.",
            status: "available"
        },
        {
            name: "♾ Infinite ♾",
            cost: 100000000000,
            description: "Beyond limits. Beyond measure.",
            status: "available"
        },
        {
            name: "🌀 Transcendent 🌀",
            cost: 500000000000,
            description: "Those who rise beyond what was thought possible.",
            status: "available"
        },
        {
            name: "🥢 GOD OF CHOPSTICKS 🥢",
            cost: 1000000000000,
            description: "There are players. There are legends. Then there is you.",
            status: "available"
        },
        {
            name: "🌑 Unfathomable 🌑",
            cost: 2500000000000,
            description: "Some depths were never meant to be understood.",
            status: "available"
        },
        {
            name: "👁 Omniscient 👁",
            cost: 5000000000000,
            description: "Those who know what others have yet to discover.",
            status: "available"
        },
        {
            name: "🎰 Slot Addict 🎰",
            cost: 7777777777777,
            description: "The reels always have one more spin.",
            status: "available"
        },
        {
            name: "🐟 Fishillionaire 🐟",
            cost: 9999999999999,
            description: "A fortune built one catch at a time.",
            status: "available"
        },
        {
            name: "🏗 Architect of Reality 🏗",
            cost: 10000000000000,
            description: "Why play within reality when you can design it?",
            status: "available"
        },
        {
            name: "💸 Tax Evasion Expert 💸",
            cost: 420000000000000000,
            description: "The less said, the better.",
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
            info: "+5% coin rewards per level<br>Max: 10 Levels",
            status: "available"
        },

        {
            name: "🎣 Fishing Luck",
            info: "Better fishing rarity<br>Max: 10 Levels",
            status: "available"
        },

        {
            name: "🎰 Slot Luck",
            info: "Better slot odds<br>Max: 10 Levels",
            status: "available"
        },

        {
            name: "📈 Cap Boost",
            info: "+10% prestige cap per level<br>Max: 10 Levels",
            status: "available"
        },

        {
            name: "🏷 Custom Title",
            info: "Allows you to pick a custom reasonable title.<br>Max: 1 Level",
            status: "available"
        }

    ]

};


/* ========================================
   COIN FORMAT
======================================== */

function formatCoins(amount) {

    const units = [
        { value: 1e18, symbol: "Qi" },
        { value: 1e15, symbol: "Qa" },
        { value: 1e12, symbol: "T" },
        { value: 1e9, symbol: "B" },
        { value: 1e6, symbol: "M" },
        { value: 1e3, symbol: "K" }
    ];


    for (const unit of units) {

        if (amount >= unit.value) {

            return (amount / unit.value)
                .toFixed(1)
                .replace(".0", "")
                + unit.symbol;

        }

    }


    return amount.toLocaleString();

}


/* ========================================
   SHOP CONTAINER
======================================== */

const container =
    document.getElementById("shop-container");


/* ========================================
   BUILD SHOP
======================================== */

for (const shop in shops) {

    const shopNames = {

        titles: "Title Shop",

        general: "General Shop",

        prestige: "Prestige Shop"

    };


    const shopDescriptions = {

        titles:
            "Customize your identity with exclusive Chopsticks titles.",

        general:
            "Useful items and consumables for your Chopsticks journey.",

        prestige:
            "Permanent upgrades purchased with Prestige progression."

    };


    container.innerHTML += `

        <section class="shop-section">

            <div class="shop-section-header">

                <div>

                    <span class="shop-section-label">
                        ${shop.toUpperCase()}
                    </span>

                    <h2>
                        ${shopNames[shop]}
                    </h2>

                    <p>
                        ${shopDescriptions[shop]}
                    </p>

                </div>

                <span class="shop-item-count">
                    ${shops[shop].length} ITEMS
                </span>

            </div>


            <div class="shop-grid"></div>

        </section>

    `;


    const section =
        container.lastElementChild.querySelector(".shop-grid");


    shops[shop].forEach(item => {

        const isComingSoon =
            item.status === "coming soon";


        const hasCost =
            item.cost !== undefined;


        section.innerHTML += `

            <article
                class="shop-card ${isComingSoon ? "is-coming-soon" : ""}"
                data-search="${`
                    ${item.name}
                    ${item.cost || ""}
                    ${item.description || item.info || ""}
                    ${item.status}
                    ${shop}
                `.toLowerCase()}"
            >

                <div class="shop-card-top">

                    <span class="shop-card-category">
                        ${shop}
                    </span>

                    <span class="shop-status ${item.status}">
                        ${
                            isComingSoon
                                ? "COMING SOON"
                                : "AVAILABLE"
                        }
                    </span>

                </div>


                <div class="shop-card-content">

                    <h3>
                        ${item.name}
                    </h3>


                    ${
                        hasCost

                        ?

                        `
                        <div class="shop-price">

                            <span class="shop-price-icon">
                                💰
                            </span>

                            <div>

                                <strong>
                                    ${item.cost.toLocaleString()}
                                </strong>

                                <span>
                                    coins
                                </span>

                            </div>

                        </div>

                        <div class="shop-short-price">
                            ${formatCoins(item.cost)}
                        </div>
                        `

                        :

                        `
                        <div class="shop-no-price">
                            PRESTIGE UPGRADE
                        </div>
                        `

                    }


                    ${
                        item.description || item.info
                    
                        ?
                    
                        `
                        <p class="shop-info">
                            ${item.description || item.info}
                        </p>
                        `
                    
                        :
                        
                        ""
                    }

                </div>


                <div class="shop-card-footer">

                    ${
                        isComingSoon

                        ?

                        `
                        <span class="shop-action disabled">
                            COMING SOON
                        </span>
                        `

                        :

                        `
                        <span class="shop-action">
                            AVAILABLE
                            <span>→</span>
                        </span>
                        `

                    }

                </div>

            </article>

        `;

    });

}


/* ========================================
   SEARCH
======================================== */

const searchBar =
    document.getElementById("shop-search");


searchBar.addEventListener("input", () => {

    const search =
        searchBar.value.toLowerCase().trim();


    document
        .querySelectorAll(".shop-card")
        .forEach(card => {

            const text =
                card.dataset.search;


            card.style.display =
                text.includes(search)
                    ? ""
                    : "none";

        });

});
