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
        description: "Take coins from target player at a 10% chance of success(Maximum 10% of their total)<",
        status: "coming soon"
    },
    
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

const container =
document.getElementById("commands-container");


for (let category in commands) {


    container.innerHTML += `

    <div class="rarity-section">

        <h1 class="rarity-title">
            ${category}
        </h1>


        <div class="fish-grid">

        </div>


    </div>

    `;


    const section =
    container.lastElementChild.querySelector(".fish-grid");



    commands[category].forEach(command => {


        const escapeHTML = (text) => {
            return text
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;");
        };
        section.innerHTML += `


        <div class="card command-card"

        data-search="${escapeHTML(
            `${command.name}
            ${command.usage}
            ${command.description}
            ${command.status}
            ${category}`
        )}"


        <h2>
            ${escapeHTML(command.name)}
        </h2>
        
        
        <p class="usage">
            ${escapeHTML(command.usage)}
        </p>
        
        
        <p class="description">
            ${escapeHTML(command.description)}
        </p>

            ${
            command.status === "coming soon"

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

const searchBar =
document.getElementById("command-search");


searchBar.addEventListener("input", () => {


    const search =
    searchBar.value.toLowerCase();


    document.querySelectorAll(".command-card")
    .forEach(card => {


        const text =
        card.dataset.search.toLowerCase();


        if(text.includes(search)) {

            card.style.display = "flex";

        }

        else {

            card.style.display = "none";

        }


    });


});
