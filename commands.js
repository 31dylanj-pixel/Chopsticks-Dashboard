const commands = {

    games: [

        {
            name: "🎣 Fish",
            usage: "fish <user>",
            description: "Catch fish and earn coins.",
            status: "available"
        },

        {
            name: "🎰 Slot Machine",
            usage: "slot <user> <bet>",
            description: "Spin the slot machine.",
            status: "available"
        },

        {
            name: "🪙 Coin Bet",
            usage: "bet <user> coin <heads/tails> <bet>",
            description: "Flip a coin.",
            status: "available"
        },

        {
            name: "🎲 Roll",
            usage: "roll <faces>",
            description: "Roll a custom die with the specified number of faces.",
            status: "available"
        },

        {
            name: "☠️ Russian Roulette",
            usage: "roulette <user> <bet>",
            description: "Russian Roulette. Six chambers. One bullet. One massive jackpot. Do you trust your luck?",
            status: "coming soon"
        }

    ],


    social: [

        {
            name: "🏆 Leaderboard",
            usage: "leaderboard",
            description: "View the richest players.",
            status: "available"
        },

        {
            name: "💰 Give",
            usage: "give <from> <to> <amount>",
            description: "Give coins to another player.",
            status: "coming soon"
        },

        {
            name: "💰 Take",
            usage: "take <from> <amount>",
            description: "Take coins from target player at a 10% chance of success (Maximum 10% of their balance).",
            status: "coming soon"
        }

    ],


    profile: [

        {
            name: "💰 Balance",
            usage: "balance <user>",
            description: "View your balance.",
            status: "available"
        },

        {
            name: "📖 Collection",
            usage: "collection <user>",
            description: "View your fish collection.",
            status: "available"
        },

        {
            name: "🃏 Cards",
            usage: "cards <user>",
            description: "View your card collection.",
            status: "available"
        },

        {
            name: "🎁 Daily",
            usage: "daily <user>",
            description: "Claim today's reward.",
            status: "available"
        },

        {
            name: "📜 Quests",
            usage: "quests <user>",
            description: "View your daily quests.",
            status: "coming soon"
        },

        {
            name: "📊 Stats",
            usage: "stats <user>",
            description: "View your statistics.",
            status: "available"
        }

    ],


    prestige: [

        {
            name: "⭐ Prestige",
            usage: "prestige <user>",
            description: "Prestige to the next tier and gain Prestige Points.",
            status: "available"
        },

        {
            name: "🛒 Prestige Shop",
            usage: "prestigeshop <user>",
            description: "View the Prestige Shop.",
            status: "available"
        },

        {
            name: "📈 Prestige Info",
            usage: "prestigeinfo <user>",
            description: "View your Prestige information.",
            status: "available"
        },

        {
            name: "⬆ Upgrade",
            usage: "upgrade <user> <upgrade>",
            description: "Purchase a Prestige upgrade.",
            status: "available"
        }

    ],


    shops: [

        {
            name: "🏪 Title Shop",
            usage: "titleshop",
            description: "View all available titles.",
            status: "available"
        },

        {
            name: "🛒 Buy Title",
            usage: "buytitle <user> <title>",
            description: "Purchase a title from the Title Shop.",
            status: "available"
        },

        {
            name: "✨ Use Title",
            usage: "usetitle <user> <title>",
            description: "Equip one of your owned titles.",
            status: "available"
        },

        {
            name: "🛒 Shop",
            usage: "shop <user>",
            description: "View the general shop.",
            status: "available"
        },

        {
            name: "💰 Buy",
            usage: "buy <user> <item>",
            description: "Purchase an item from the shop.",
            status: "available"
        }

    ],


    cards: [

        {
            name: "🃏 openpack",
            usage: "openpack <user> <basic/rare/epic/legendary/mythic>",
            description: "Open a card pack.",
            status: "available"
        },

        {
            name: "💰 sellcard",
            usage: "sellcard <user> <card>",
            description: "Sell one of your cards.",
            status: "available"
        }

    ],


    utilities: [

        {
            name: "🌤 weather",
            usage: "weather <city>",
            description: "Get the current weather for a city.",
            status: "available"
        },

        {
            name: "⏱ timer",
            usage: "timer <seconds>",
            description: "Set a countdown timer.",
            status: "available"
        },

        {
            name: "❔ help",
            usage: "help",
            description: "View the command categories.",
            status: "available"
        },

        {
            name: "🧠 fact",
            usage: "fact",
            description: "Get a random fun fact.",
            status: "available"
        }

    ]

};


/* ========================================
   COMMAND CONTAINER
======================================== */

const container =
    document.getElementById("commands-container");


/* ========================================
   CATEGORY NAMES
======================================== */

const categoryNames = {

    games: "Games",

    social: "Social",

    profile: "Profile",

    prestige: "Prestige",

    shops: "Shops",

    cards: "Cards",

    utilities: "Utilities"

};


/* ========================================
   ESCAPE HTML
======================================== */

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ========================================
   BUILD COMMANDS
======================================== */

for (const category in commands) {

    const categoryName =
        categoryNames[category] || category;


    container.innerHTML += `

        <section
            class="command-section"
            data-category="${escapeHTML(category)}"
        >

            <div class="command-section-header">

                <div>

                    <span class="command-section-label">
                        ${category.toUpperCase()}
                    </span>

                    <h2>
                        ${categoryName}
                    </h2>

                </div>


                <span class="command-count">
                    ${commands[category].length} COMMANDS
                </span>

            </div>


            <div class="command-grid"></div>

        </section>

    `;


    const section =
        container.lastElementChild
            .querySelector(".command-grid");


    commands[category].forEach(command => {

        const isComingSoon =
            command.status === "coming soon";


        const searchData = `
            ${command.name}
            ${command.usage}
            ${command.description}
            ${command.status}
            ${category}
        `.toLowerCase();


        section.innerHTML += `

            <article
                class="command-card"
                data-search="${escapeHTML(searchData)}"
            >

                <div class="command-card-top">

                    <span class="command-category">
                        ${category}
                    </span>


                    <span
                        class="command-status ${
                            isComingSoon
                                ? "coming-soon"
                                : "available"
                        }"
                    >
                        ${
                            isComingSoon
                                ? "COMING SOON"
                                : "AVAILABLE"
                        }
                    </span>

                </div>


                <div class="command-card-content">

                    <h3>
                        ${escapeHTML(command.name)}
                    </h3>


                    <span class="command-usage-label">
                        USAGE
                    </span>


                    <div class="command-usage">

                        <span class="command-prefix">
                            /
                        </span>

                        ${escapeHTML(command.usage)}

                    </div>


                    <p class="command-description">
                        ${escapeHTML(command.description)}
                    </p>

                </div>


                <div class="command-card-footer">

                    <span>
                        ${category.toUpperCase()}
                    </span>

                    <span class="command-arrow">
                        →
                    </span>

                </div>

            </article>

        `;

    });

}


/* ========================================
   SEARCH
======================================== */

const searchBar =
    document.getElementById("command-search");


searchBar.addEventListener("input", () => {

    const search =
        searchBar.value.toLowerCase().trim();


    document
        .querySelectorAll(".command-card")
        .forEach(card => {

            const text =
                card.dataset.search.toLowerCase();


            card.style.display =
                text.includes(search)
                    ? ""
                    : "none";

        });


    /*
       Hide category sections when
       none of their commands match.
    */

    document
        .querySelectorAll(".command-section")
        .forEach(section => {

            const visibleCards =
                section.querySelectorAll(
                    ".command-card:not([style*='display: none'])"
                );


            section.style.display =
                visibleCards.length > 0
                    ? ""
                    : "none";

        });

});
