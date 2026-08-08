let dailyCountdownInterval = null;

function openDailyReward(){

    const streak =
    Number(localStorage.getItem("streak") || 0);

    const freezes =
    Number(localStorage.getItem("streak_freezes") || 0);

    const lastDaily =
    localStorage.getItem("last_daily") || "";

    document.getElementById(
        "dailyStreakDisplay"
    ).textContent =
    `🔥 Streak: ${streak}`;

    document.getElementById(
        "freezeDisplay"
    ).textContent =
    `❄️ Freezes: ${freezes}`;


    const grid =
    document.getElementById("dailyGrid");

    grid.innerHTML = "";


    const blockStart =
    Math.floor(
        (Math.max(streak,1) - 1) / 7
    ) * 7 + 1;


    const baseRewards = [

        500000,
        750000,
        1000000,
        1250000,
        1500000,
        2000000,
        5000000

    ];


    for(let i = 0; i < 7; i++){

        const day =
        blockStart + i;


        const rewardIndex =
        (day - 1) % 7;


        const reward =
        baseRewards[rewardIndex];


        const card =
        document.createElement("div");


        card.className =
        "daily-card";


        if(day <= streak){

            card.classList.add("claimed");

        }

        else if(day === streak + 1){

            card.classList.add("next");

        }


        if(day % 7 === 0){

            card.classList.add("weekly");

        }


        card.innerHTML = `

            <div class="daily-day">

                Day ${day}

            </div>

            <div class="daily-coins">

                💰 ${reward.toLocaleString()}

            </div>

            <div class="daily-pp">

                ${
                    day % 7 === 0
                    ? "⭐ 10 PP"
                    : "⭐ 1 PP"
                }

            </div>

        `;


        grid.appendChild(card);

    }


    const claimArea =
    document.getElementById("dailyClaimArea");


    claimArea.innerHTML = `

        <button
        id="dailyClaimButton"
        class="daily-claim-button">
    
            Claim Reward
    
        </button>
    
    `;


    document
    .getElementById("dailyClaimButton")
    .onclick =
    claimDailyReward;


    updateDailyCountdown(lastDaily);


    document
    .getElementById("dailyRewardModal")
    .classList
    .add("active");

}

function updateDailyCountdown(lastDaily){

    if(dailyCountdownInterval){

        clearInterval(
            dailyCountdownInterval
        );

    }


    const claimButton =
    document.getElementById("dailyClaimButton");


    if(!claimButton)
        return;


    if(!lastDaily){

        claimButton.disabled = false;

        claimButton.textContent =
        "Claim Reward";

        claimButton.classList.remove("cooldown");

        return;

    }


    const lastClaim =
    new Date(lastDaily).getTime();


    if(isNaN(lastClaim)){

        claimButton.disabled = false;

        claimButton.textContent =
        "Claim Reward";

        claimButton.classList.remove("cooldown");

        return;

    }


    function update(){

        const now =
        Date.now();


        const nextClaim =
        lastClaim +
        (22 * 60 * 60 * 1000);


        const remaining =
        nextClaim - now;


        if(remaining <= 0){

            claimButton.disabled =
            false;

            claimButton.textContent =
            "Claim Reward";

            claimButton.classList.remove(
                "cooldown"
            );


            clearInterval(
                dailyCountdownInterval
            );


            dailyCountdownInterval =
            null;


            return;

        }


        claimButton.disabled =
        true;


        claimButton.classList.add(
            "cooldown"
        );


        const hours =
        Math.floor(
            remaining / 3600000
        );


        const minutes =
        Math.floor(
            (remaining % 3600000) / 60000
        );


        const seconds =
        Math.floor(
            (remaining % 60000) / 1000
        );


        claimButton.textContent =
        `Next Reward in: ${
            String(hours).padStart(2,"0")
        }:${
            String(minutes).padStart(2,"0")
        }:${
            String(seconds).padStart(2,"0")
        }`;

    }


    update();


    dailyCountdownInterval =
    setInterval(
        update,
        1000
    );

}

function closeDailyReward(){

    if(dailyCountdownInterval){

        clearInterval(
            dailyCountdownInterval
        );

        dailyCountdownInterval =
        null;

    }


    document
    .getElementById("dailyRewardModal")
    .classList
    .remove("active");

}

async function claimDailyReward(){

    alert(
        "Claim system not connected yet."
    );

}
