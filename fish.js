const fishTable = {

    common: [
        ["🐚 Seashell", 8],
        ["🐟 Anchovy", 9],
        ["🐟 Minnow", 10],
        ["🐟 Guppy", 11],
        ["🐠 Goldfish", 12],
        ["🐟 Mud Minnow", 13],
        ["🐠 Bluegill", 14],
        ["🐠 Reef Guppy", 15],
        ["🦀 Hermit Crab", 16],
        ["🦀 Pebble Crab", 17],
        ["🐡 Baby Blowfish", 18],
        ["🐡 Small Blowfish", 19],
        ["🦐 Shrimp", 20],
        ["🦀 Crab", 22],
        ["🐠 Clownfish", 24],
        ["🐟 Sardine", 26],
        ["🪼 Tiny Jelly", 28],
        ["🐡 Pufferfish", 30],
        ["🪸 Coral Shrimp", 32],
        ["🪼 Jellyfish", 34]
    ],


    uncommon: [
        ["🐠 Silver Minnow", 35],
        ["🐟 Stream Carp", 40],
        ["🐟 Emerald Carp", 42],
        ["🦐 Lagoon Shrimp", 44],
        ["🦑 Baby Squid", 46],
        ["🐠 Coral Minnow", 48],
        ["🦀 Tide Crab", 50],
        ["🐠 Rainbow Guppy", 54],
        ["🐟 Blue Tang", 58],
        ["🦀 Rock Crab", 62],
        ["🦀 Drift Crab", 65],
        ["🐠 Amberstream Guppy", 68],
        ["🦑 Spotted Puffer", 75],
        ["🐡 Bubblefish", 85]
    ],


    rare: [
        ["🦑 Squid", 90],
        ["🐠 Neon Tetra", 95],
        ["🐠 Angelfish", 100],
        ["🦐 Glass Prawn", 105],
        ["🐟 Deepwater Eel", 110],
        ["🐡 Lionfish", 115],
        ["🦞 Lobster", 120],
        ["🦀 Razor Crab", 125],
        ["🐠 Basslet", 130],
        ["🐠 Prism Fish", 135],
        ["🐟 Tuna", 140],
        ["🦐 Crystal Shrimp", 155],
        ["🦑 Cuttlefish", 150],
        ["🐟 Swordfish", 165],
        ["🦑 Electric Squid", 175],
        ["🐠 Coral Angelfish", 180]
    ],

    
    epic: [
        ["🦑 Abyss Stalker", 300],
        ["🐬 Porpoise Pup", 200],
        ["🦈 Shark", 220],
        ["🐬 Dolphin", 260],
        ["🐠 Storm Ray", 360],
        ["🦈 Reef Shark", 320],
        ["🐙 Giant Octopus", 380],
        ["🐠 Manta Ray", 420],
        ["🦈 Deep Sea Hunter", 470],
        ["🦈 Great White", 500],
        ["🐋 Whale", 550],
        ["🐋 Blue Titan Whale", 650],
        ["🐙 Krakenling", 700]
    ],

    
    legendary: [
        ["🐉 Sea Serpent", 600],
        ["🐉 Ember Serpent", 950],
        ["👑 Golden Koi", 850],
        ["🐉 Abyss Drakefish", 700],
        ["👑 Crown Eel", 900],
        ["👑 Abyssal Emperor Fish", 1300],
        ["🐉 Storm Leviathan", 1200],
        ["👑 Pearl Kingfish", 1500]
    ],

    
    mythic: [
        ["💎 Ocean Diamond", 1000],
        ["🌠 Nebula Carp", 3000],
        ["✨ Halo", 2500],
        ["🌀 Rift Guardian Fish", 6000],
        ["🌌 Void Eel", 5000],
        ["💎 Crystal Seraph Fish", 8000],
        ["🥢 Chopsticks Fish", 20000]
    ],
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
