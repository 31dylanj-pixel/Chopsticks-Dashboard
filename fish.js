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


     secret: [
        ["👑 King Salmon", 30000],
        ["🧿 Memory Eater", 60000],
        ["👁 Abyss Watcher", 50000],
        ["🌑 Lost Depth Hydra", 90000],
        ["🌀 Forgotten Leviathan", 75000],
        ["🌌 Void Serpent", 100000],
        ["🌌 Reminisce Fish", 1000000],
        ["🕳 Void Whale", 10000000],
        ["🌠 Celestial Koi", 25000000],
        ["👁 Eye of the Abyss", 40000000]
    ],


    godly: [
        ["⚡ Eternal Seraph", 50000000],
        ["⚡ Reality Breaker Fish", 75000000],
        ["👑 Crowned Leviathan", 10000000],
        ["🌌 Astral Emperor Eel", 200000000],
        ["🌌 Godfish of Reality", 1000000000],
        ["🌌 Cosmic Remnant", 10000000000],
        ["🌀 Chronofish", 25000000000],
        ["🌠 Starborn Leviathan", 50000000000],
        ["♾ Infinite Angler", 100000000000]
    ],


    divine: [
        ["🌌 Divine Reminiscence", 1000000000000],
        ["⚡ Eternal Creator", 2500000000000],
        ["👑 Throne of Oceans", 5000000000000],
        ["🌠 Celestial Founder", 10000000000000],
        ["♾ Origin of Reality", 25000000000000],
        ["🌀 The Big Bang", 50000000000000],
        ["🌊 Waves of Creation", 60000000000000],
        ["🕰 Ancient Reminiscence", 70000000000000],
        ["⚜ Crown of Creation", 80000000000000],
        ["🌌 Cosmic Genesis", 90000000000000],
        ["✨ Divine Leviathan", 100000000000000],
        ["🌠 Singularity Fish", 120000000000000],
        ["🌀 Void Architect", 150000000000000]
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

const container = document.getElementById("fish-container");


for (let rarity in fishTable) {


    container.innerHTML += `

        <div class="rarity-section">
    
            <h1 class="rarity-title ${rarity}">
                ${rarity}
            </h1>
    
    
            <div class="fish-grid">
    
            </div>
    
        </div>
    
    `;


    let section =
        container.lastElementChild.querySelector(".fish-grid");



    fishTable[rarity].forEach(fish => {


        section.innerHTML += `

            <div class="card ${rarity}">
        
                <h2>
                    ${fish[0]}
                </h2>
        
        
                <p>
                    💰 Value: ${fish[1]} coins
                    ${fish[1] >= 1000 ? `(${formatCoins(fish[1])})` : ""}
                </p>
        
            </div>
        
        `;


    });


}

const searchBar = document.getElementById("fish-search");


searchBar.addEventListener("input", function() {

    let search = searchBar.value.toLowerCase();


    document.querySelectorAll(".card").forEach(card => {

        let name = card.querySelector("h2").textContent.toLowerCase();


        if (name.includes(search)) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});
