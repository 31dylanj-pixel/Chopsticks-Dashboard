function openDailyReward(){

    const grid =
    document.getElementById("dailyGrid");

    grid.innerHTML = "";

    for(let day = 1; day <= 21; day++){

        const card =
        document.createElement("div");

        card.className = "daily-card";

        if(day <= 17){

            card.classList.add("claimed");

        }

        else if(day === 18){

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

                ${
                    day % 7 === 0
                    ? "💰 5,000,000"
                    : "💰 500,000"
                }

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

        <button class="daily-claim-button">

            Claim Reward

        </button>

    `;

    document
    .getElementById("dailyRewardModal")
    .classList
    .add("active");

}
