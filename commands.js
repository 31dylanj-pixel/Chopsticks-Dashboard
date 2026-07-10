const commands = {

    Games: [

        {
            name: "🎣 fish",
            usage: "fish <user>",
            description: "Catch fish and earn coins.",
            status: "available"
        },

        {
            name: "🎰 slot",
            usage: "slot <user> <bet>",
            description: "Spin the slot machine.",
            status: "available"
        },

        {
            name: "🪙 bet",
            usage: "bet <user> coin <heads/tails> <bet>",
            description: "Flip a coin and gamble your coins.",
            status: "available"
        },

        {
            name: "🎲 roll",
            usage: "roll <faces>",
            description: "Roll a custom die with your chosen number of faces.",
            status: "available"
        },

        {
            name: "☠️ Russian Roulette",
            usage: "roulette <user>",
            description: "Six chambers. One massive jackpot. Test your luck.",
            status: "coming soon"
        }

    ],



    Social: [

        {
            name: "🏆 leaderboard",
            usage: "leaderboard",
            description: "View the richest players.",
            status: "available"
        },

        {
            name: "💰 give",
            usage: "give <from> <to> <amount>",
            description: "Give coins to another player.",
            status: "coming soon"
        }

    ],



    Profile: [

        {
            name: "💰 balance",
            usage: "balance <user>",
            description: "View your coin balance.",
            status: "available"
        },

        {
            name: "📖 collection",
            usage: "collection <user>",
            description: "View your fish collection.",
            status: "available"
        },

        {
            name: "🃏 cards",
            usage: "cards <user>",
            description: "View your card collection.",
            status: "available"
        },

        {
            name: "🎁 daily",
            usage: "daily <user>",
            description: "Claim your daily reward.",
            status: "available"
        },

        {
            name: "📜 quests",
            usage: "quests <user>",
            description: "View your daily quests.",
            status: "coming soon"
        },

        {
            name: "📊 stats",
            usage: "stats <user>",
            description: "View your statistics.",
            status: "available"
        }

    ],



    Prestige: [

        {
            name: "⭐ prestige",
            usage: "prestige <user>",
            description: "Prestige to the next tier and gain prestige points.",
            status: "available"
        },

        {
            name: "🛒 prestigeshop",
            usage: "prestigeshop <user>",
            description: "View the Prestige Shop.",
            status: "available"
        },

        {
            name: "📈 prestigeinfo",
            usage: "prestigeinfo <user>",
            description: "View your current prestige information.",
            status: "available"
        },

        {
            name: "⬆ upgrade",
            usage: "upgrade <user> <upgrade>",
            description: "Purchase a prestige upgrade.",
            status: "available"
        }

    ],



    Titles: [

        {
            name: "🏪 titleshop",
            usage: "titleshop",
            description: "View all available titles.",
            status: "available"
        },

        {
            name: "🛒 buytitle",
            usage: "buytitle <user> <title>",
            description: "Purchase a title from the Title Shop.",
            status: "available"
        },

        {
            name: "✨ usetitle",
            usage: "usetitle <user> <title>",
            description: "Equip one of your owned titles.",
            status: "available"
        }

    ],



    Shop: [

        {
            name: "🛒 shop",
            usage: "shop <user>",
            description: "View the general shop.",
            status: "available"
        },

        {
            name: "💰 buy",
            usage: "buy <user> <item>",
            description: "Purchase an item from the shop.",
            status: "available"
        }

    ],



    Cards: [

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



    Utilities: [

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


        section.innerHTML += `


        <div class="card command-card"

        data-search="
        ${command.name}
        ${command.usage}
        ${command.description}
        ${command.status}
        ${category}
        ">


            <h2>
                ${command.name}
            </h2>


            <p class="usage">
                ${command.usage}
            </p>


            <p class="description">
                ${command.description}
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
