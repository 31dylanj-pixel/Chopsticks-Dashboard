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
            name: "☠️ Russian Roulette",
            usage: "roulette",
            description: "Six chambers. One massive jackpot.",
            status: "coming soon"
        }

    ],


    Profile: [

        {
            name: "💰 balance",
            usage: "balance <user>",
            description: "View your balance.",
            status: "available"
        },

        {
            name: "📊 stats",
            usage: "stats <user>",
            description: "View your statistics.",
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

        <div class="fish-grid"></div>

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


            <p>
                ${command.usage}
            </p>


            <p>
                ${command.description}
            </p>


            ${
            command.status === "coming soon"

            ?

            `<span class="coming-soon">
            🚧 Coming Soon
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

const search =
document.getElementById("command-search");


search.addEventListener("input", ()=>{


    let value =
    search.value.toLowerCase();



    document.querySelectorAll(".command-card")
    .forEach(card=>{


        let keywords =
        card.dataset.search.toLowerCase();



        if(keywords.includes(value)){

            card.style.display="flex";

        }

        else {

            card.style.display="none";

        }


    });


});
