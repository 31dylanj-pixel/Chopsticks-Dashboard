const shopContainer = document.getElementById("shop-container");


const shops = [

    {
        title: "🏷️ Title Shop",
        items: [
            {
                name: "🐟 Rookie 🐟",
                info: "💰 100 coins"
            },
            {
                name: "🌱 Novice 🌱",
                info: "💰 200 coins"
            },
            {
                name: "👑 King 👑",
                info: "💰 2,500 coins"
            }
        ]
    },


    {
        title: "🎁 General Shop",
        items: [
            {
                name: "🧊 Streak Freeze",
                info: "💰 500,000 coins\nProtects your daily streak if you miss one day."
            }
        ]
    },


    {
        title: "⭐ Prestige Shop",
        items: [
            {
                name: "💰 Coin Boost",
                info: "+5% coin rewards per level\n⭐ Max Level: 10"
            },
            {
                name: "🎣 Fishing Luck",
                info: "Better fishing rarity\n⭐ Max Level: 10"
            },
            {
                name: "🎰 Slot Luck",
                info: "Better slot odds\n⭐ Max Level: 10"
            },
            {
                name: "📈 Cap Boost",
                info: "+10% prestige cap per level\n⭐ Max Level: 10"
            },
            {
                name: "🏷 Custom Title",
                info: "Allows you to pick a custom reasonable title.\n⭐ Max Level: 1"
            }
        ]
    }

];



shops.forEach(shop => {


    shopContainer.innerHTML += `

    <div class="shop-section">

        <h1 class="shop-title">
            ${shop.title}
        </h1>

        <div class="shop-grid">

        ${
            shop.items.map(item => `

                <div class="card">

                    <h2>
                        ${item.name}
                    </h2>

                    <p>
                        ${item.info.replace(/\n/g, "<br>")}
                    </p>

                </div>

            `).join("")
        }

        </div>

    </div>

    `;


});
