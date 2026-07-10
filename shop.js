const shops = {

    titles: [
        ["🐟 Rookie 🐟", 100],
        ["🌱 Novice 🌱", 200],
        ["🧭 Wanderer 🧭", 300],
        ["🎣 Fisherman 🎣", 500],
        ["📖 Collector 📖", 750],
        ["🧭 Adventurer 🧭", 750],
        ["🎣 Angler 🎣", 1500],
        ["⚔ Gladiator ⚔", 1500],
        ["👑 King 👑", 2500],
        ["💰 Merchant 💰", 5000],
        ["🏹 Expert 🏹", 5000],
        ["⚓ Captain ⚓", 15000],
        ["🔥 Master 🔥", 15000],
        ["🌊 Sea Emperor 🌊", 25000],
        ["✨🔥 Mythic Lord 🔥✨", 50000],
        ["💼 Tycoon 💼", 75000],
        ["💎 Millionaire 💎", 1000000],
        ["🌌 Reminisce 🌌", 2500000],
        ["🕰 Nostalgia 🕰", 5000000000],
        ["🌠 Celestial 🌠", 25000000000],
        ["♾ Infinite ♾", 100000000000],
        ["🌀 Transcendent 🌀", 500000000000],
        ["🥢 GOD OF CHOPSTICKS 🥢", 1000000000000],
        ["🌑 Unfathomable 🌑", 2500000000000],
        ["👁 Omniscient 👁", 5000000000000],
        ["🎰 Slot Addict 🎰", 7777777777777],
        ["🐟 Fishillionaire 🐟", 9999999999999],
        ["🏗 Architect of Reality 🏗", 10000000000000],
        ["💸 Tax Evasion Expert 💸", 420000000000000000]
    ],


    general: [
        ["🧊 Streak Freeze", 500000]
    ],


    prestige: [
        ["💰 Coin Boost", "Max: 10 Levels"],
        ["🎣 Fishing Luck", "Max: 10 Levels"],
        ["🎰 Slot Luck", "Max: 10 Levels"],
        ["📈 Cap Boost", "Max: 10 Levels"],
        ["🏷 Custom Title", "Max: 1 Level"]
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

            <div class="card">


                <h2>
                    ${item[0]}
                </h2>


                <p>

                ${
                    typeof item[1] === "number"
                    ? `💰 Cost: ${item[1].toLocaleString()} coins
                        (${formatCoins(item[1])})`
                    : item[1]
                }

                </p>


            </div>

        `;


    });

}




const searchBar = document.getElementById("shop-search");


searchBar.addEventListener("input", () => {


    const search = searchBar.value.toLowerCase();



    document.querySelectorAll("#shop-container .card")
    .forEach(card => {


        const name =
        card.querySelector("h2")
        .textContent
        .toLowerCase();



        card.style.display =
        name.includes(search)
        ? "flex"
        : "none";


    });


});
