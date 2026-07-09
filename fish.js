const fishTable = {

    common: [
        ["🐚 Seashell", 8],
        ["🐟 Anchovy", 9],
        ["🐟 Minnow", 10],
        ["🐟 Guppy", 11],
        ["🐠 Goldfish", 12]
    ],

    uncommon: [
        ["🐠 Silver Minnow", 35],
        ["🐟 Stream Carp", 40]
    ],

    rare: [
        ["🦑 Squid", 90],
        ["🐠 Neon Tetra", 95],
        ["🐠 Angelfish", 100]
    ],

    epic: [
        ["🦈 Shark", 220],
        ["🐬 Dolphin", 260]
    ],

    legendary: [
        ["🐉 Sea Serpent", 600],
        ["👑 Golden Koi", 850]
    ],

    mythic: [
        ["💎 Ocean Diamond", 1000],
        ["🥢 Chopsticks Fish", 20000]
    ],

    secret: [
        ["👑 King Salmon", 30000],
        ["👁 Abyss Watcher", 50000]
    ],

    godly: [
        ["⚡ Eternal Seraph", 50000000]
    ],

    divine: [
        ["🌌 Divine Reminiscence", 1000000000000]
    ]

};


const container = document.getElementById("fish-container");


for (let rarity in fishTable) {

    container.innerHTML += `
        <h1>${rarity.toUpperCase()}</h1>
    `;


    fishTable[rarity].forEach(fish => {

        container.innerHTML += `
            <div class="card">
                <h2>${fish[0]}</h2>
                <p>⭐ Rarity: ${rarity}</p>
                <p>💰 Value: ${fish[1]} coins</p>
            </div>
        `;

    });

}
