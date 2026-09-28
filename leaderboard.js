const SUPABASE_URL =
"https://rualkoaojvjiqsudzgah.supabase.co";

const SUPABASE_KEY =
"sb_publishable_oxTVjZfp9wvrrmG60Qm-cg_WsBD1pIE";


function formatCoins(amount) {

    const units = [
        { value: 1e18, symbol: "Qi" },
        { value: 1e15, symbol: "Qa" },
        { value: 1e12, symbol: "T" },
        { value: 1e9, symbol: "B" },
        { value: 1e6, symbol: "M" },
        { value: 1e3, symbol: "K" }
    ];

    for (const unit of units) {

        if (amount >= unit.value) {

            return (amount / unit.value)
                .toFixed(1)
                .replace(".0", "")
                + unit.symbol;

        }

    }

    return amount.toString();

}


async function loadLeaderboard() {

    const response = await fetch(

        `${SUPABASE_URL}/rest/v1/players?select=username,coins,title,prestige,daily_streak,stats&order=prestige.desc,coins.desc&limit=50`,

        {

            headers: {

                apikey: SUPABASE_KEY,

                Authorization:
                `Bearer ${SUPABASE_KEY}`

            }

        }

    );


    console.log("Status:", response.status);


    const players = await response.json();


    console.log("Players:", players);


    const container =
    document.getElementById("leaderboard");


    if (!container) {

        console.error(
            "Leaderboard container missing!"
        );

        return;

    }


    container.innerHTML = "";


    players.forEach((player, index) => {


        let rank = index + 1;

        let rankDisplay = rank;


        if (index === 0) {

            rankDisplay = "🥇";

        }

        else if (index === 1) {

            rankDisplay = "🥈";

        }

        else if (index === 2) {

            rankDisplay = "🥉";

        }


        const prestige =
            Number(player.prestige || 0);


        const title =
            player.title || "Rookie";


        const coins =
            Number(player.coins || 0);


        const streak =
            Number(player.daily_streak || 0);


        const fishCaught =
            Number(
                player.stats?.fish_caught ?? 0
            );


        const slotsPlayed =
            Number(
                player.stats?.slots_played ?? 0
            );


        const coinsEarned =
            Number(
                player.stats?.coins_earned ?? 0
            );


        const prestigeDisplay =
            prestige > 0
                ? `PRESTIGE ${prestige}`
                : "NO PRESTIGE";


        container.innerHTML += `

        <div class="card leaderboard-card ${
            index === 0 ? "top-one" :
            index === 1 ? "top-two" :
            index === 2 ? "top-three" :
            ""
        }">


            <div class="leaderboard-main">


                <div class="leaderboard-rank">

                    ${rankDisplay}

                </div>


                <div class="leaderboard-player">

                    <span class="leaderboard-title">

                        ${title}

                    </span>

                    <h2>

                        ${player.username}

                    </h2>

                </div>


                <div class="leaderboard-prestige">

                    ${prestigeDisplay}

                </div>


            </div>



            <div class="leaderboard-stats">


                <div class="leaderboard-stat">

                    <span class="leaderboard-stat-icon">
                        🪙
                    </span>

                    <div>

                        <span>
                            COINS
                        </span>

                        <strong>
                            ${formatCoins(coins)}
                        </strong>

                    </div>

                </div>



                <div class="leaderboard-stat">

                    <span class="leaderboard-stat-icon">
                        🔥
                    </span>

                    <div>

                        <span>
                            STREAK
                        </span>

                        <strong>
                            ${streak} DAYS
                        </strong>

                    </div>

                </div>


            </div>



            <div class="player-details">


                <div class="detail-stat">

                    <span>
                        🎣 Fish Caught
                    </span>

                    <strong>
                        ${fishCaught.toLocaleString()}
                    </strong>

                </div>


                <div class="detail-stat">

                    <span>
                        🎰 Slots Played
                    </span>

                    <strong>
                        ${slotsPlayed.toLocaleString()}
                    </strong>

                </div>


                <div class="detail-stat">

                    <span>
                        💰 Coins Earned
                    </span>

                    <strong>
                        ${formatCoins(coinsEarned)}
                    </strong>

                </div>


            </div>


        </div>

        `;

    });

}


loadLeaderboard();


// Refresh every 10 seconds

setInterval(
    loadLeaderboard,
    10000
);
