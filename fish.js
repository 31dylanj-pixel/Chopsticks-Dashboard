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
        ["🌞 Sunfish", 67],
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
        ["🦑 Giant Squid", 600],
        ["🐋 Blue Titan Whale", 650],
        ["🐙 Krakenling", 700]
    ],

    
    legendary: [
        ["🐉 Sea Serpent", 600],
        ["🐙 Kraken", 750],
        ["🐉 Ember Serpent", 950],
        ["👑 Golden Koi", 850],
        ["🐉 Abyss Drakefish", 700],
        ["👑 Crown Eel", 900],
        ["👑 Abyssal Emperor Fish", 1300],
        ["🐉 Storm Leviathan", 1200],
        ["👑 Pearl Kingfish", 1500]
    ],

    
    mythic: [
        ["🌀 Chrono Leviathan", 900],
        ["💎 Ocean Diamond", 1000],
        ["🌠 Nebula Carp", 3000],
        ["✨ Halo", 2500],
        ["🌀 Rift Guardian Fish", 6000],
        ["🌌 Void Eel", 5000],
        ["💎 Crystal Seraph Fish", 8000],
        ["🌀 Time Rift Leviathan", 15000],
        ["🥢 Chopsticks Fish", 20000],
        ["🌌 Cosmic Leviathan", 25000],
        ["👑 Crown of the Abyss", 40000]
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

/* ========================================
   FISH INFORMATION
======================================== */

const fishInfo = {

    /*
     * REAL FISH
     *
     * Add an image path when a real fish
     * image exists.
     */

    "🐚 Seashell": {
        image: "fish/seashell.jpg",
        overview: `
            <strong>Length:</strong> 1 cm–1.3 m<br>
            <strong>Weight:</strong> 0.5 g–340 kg<br><br>
        
            Congratulations! You fished a… shell. How did you even do that?
            Aren’t they inanimate? I mean, it’s better than nothing.
            Seashells are made of calcium carbonate, and are created by animals (usually mollusks) as a hard, protective layer. 
            Historically, they have been used as jewelry, currency, and even musical instruments.
        `
    },
    
    
    "🐟 Anchovy": {
        image: "images/fish/anchovy.png",
        overview: "Overview coming soon."
    },

    "🐟 Minnow": {
        image: "images/fish/minnow.png",
        overview: "Overview coming soon."
    },

    "🐠 Goldfish": {
        image: "images/fish/goldfish.png",
        overview: "Overview coming soon."
    },

    "🐠 Bluegill": {
        image: "images/fish/bluegill.png",
        overview: "Overview coming soon."
    },

    "🦀 Crab": {
        image: "images/fish/crab.png",
        overview: "Overview coming soon."
    },


    /*
     * FANTASY FISH
     *
     * No image = automatically shows
     * "This is a fantasy fish."
     */

    "🌌 Void Eel": {
        image: null,
        overview: "Overview coming soon."
    },

    "🌀 Chrono Leviathan": {
        image: null,
        overview: "Overview coming soon."
    },

    "🥢 Chopsticks Fish": {
        image: null,
        overview: "Overview coming soon."
    },

    "🌌 Cosmic Leviathan": {
        image: null,
        overview: "Overview coming soon."
    }

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

const container = document.getElementById("fish-container");


for (let rarity in fishTable) {


    container.innerHTML += `

        <div class="rarity-section">
    
            <h1 class="rarity-title rarity-${rarity}">
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
    
            <div
                class="card ${rarity} fish-card"
                data-fish="${encodeURIComponent(fish[0])}"
            >
    
                <h2>
                    ${fish[0]}
                </h2>
    
                <p>
                    💰 Value: ${fish[1].toLocaleString()} coins
                    ${fish[1] >= 1000 ? `(${formatCoins(fish[1])})` : ""}
                </p>
    
                <span class="fish-card-hint">
                    Click to view
                </span>
    
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

/* ========================================
   FISH PROFILE MODAL
======================================== */

const fishModal = document.getElementById("fish-modal");

const fishModalClose =
    document.getElementById("fish-modal-close");

const fishModalName =
    document.getElementById("fish-modal-name");

const fishModalRarity =
    document.getElementById("fish-modal-rarity");

const fishModalValue =
    document.getElementById("fish-modal-value");

const fishModalImage =
    document.getElementById("fish-modal-image");

const fishModalOverview =
    document.getElementById("fish-modal-overview-text");


/* ========================================
   FIND FISH DATA
======================================== */

function findFishData(fishName) {

    for (const rarity in fishTable) {

        const fish = fishTable[rarity].find(
            item => item[0] === fishName
        );

        if (fish) {

            return {
                name: fish[0],
                value: fish[1],
                rarity: rarity,
                info: fishInfo[fishName] || {}
            };

        }

    }

    return null;

}


/* ========================================
   OPEN FISH PROFILE
======================================== */

function openFishProfile(fishName) {

    const fish = findFishData(fishName);

    if (!fish) return;


    /* Name */

    fishModalName.textContent = fish.name;


    /* Rarity */

    fishModalRarity.textContent =
        fish.rarity.toUpperCase();

    fishModalRarity.className =
        `fish-modal-rarity rarity-${fish.rarity}`;


    /* Value */

    fishModalValue.innerHTML =
        `💰 ${fish.value.toLocaleString()} coins` +
        (fish.value >= 1000
            ? ` (${formatCoins(fish.value)})`
            : ""
        );


    /* ========================================
       IMAGE
    ======================================== */

    const image =
        fish.info.image;


    if (image) {

        fishModalImage.innerHTML = `

            <img
                src="${image}"
                alt="${fish.name}"
                class="fish-profile-image"
                onerror="this.parentElement.innerHTML =
                    '<div class=&quot;fantasy-fish-message&quot;>This is a fantasy fish.</div>'"
            >

        `;

    } else {

        fishModalImage.innerHTML = `

            <div class="fantasy-fish-message">
                This is a fantasy fish.
            </div>

        `;

    }


    /* ========================================
       OVERVIEW
    ======================================== */

    fishModalOverview.innerHTML =
        fish.info.overview ||
        "Overview coming soon.";


    /* ========================================
       SHOW MODAL
    ======================================== */

    fishModal.classList.add("active");

    document.body.classList.add("modal-open");

}


/* ========================================
   CLICK FISH CARD
======================================== */

document.addEventListener("click", function(event) {

    const card =
        event.target.closest(".fish-card");

    if (!card) return;


    const fishName =
        decodeURIComponent(card.dataset.fish);


    openFishProfile(fishName);

});


/* ========================================
   CLOSE MODAL
======================================== */

function closeFishProfile() {

    fishModal.classList.remove("active");

    document.body.classList.remove("modal-open");

}


fishModalClose.addEventListener(
    "click",
    closeFishProfile
);


/* Click outside popup */

fishModal.addEventListener(
    "click",
    function(event) {

        if (event.target === fishModal) {

            closeFishProfile();

        }

    }
);


/* Escape key */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            fishModal.classList.contains("active")
        ) {

            closeFishProfile();

        }

    }
);
