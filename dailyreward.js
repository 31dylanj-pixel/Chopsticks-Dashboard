function openDailyReward(){

    const streak =
    Number(localStorage.getItem("streak") || 0);
    
    const freezes =
    Number(localStorage.getItem("streak_freezes") || 0);
    
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
    Math.floor((Math.max(streak,1) - 1) / 7) * 7 + 1;

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

        card.className = "daily-card";

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

    document.getElementById("dailyClaimArea").innerHTML = `

        <button
        id="dailyClaimButton"
        class="daily-claim-button">
    
            Claim Reward
    
        </button>
    
    `;
    
    document
    .getElementById("dailyClaimButton")
    .onclick = claimDailyReward;

    document
    .getElementById("dailyRewardModal")
    .classList
    .add("active");

}

function closeDailyReward(){

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
