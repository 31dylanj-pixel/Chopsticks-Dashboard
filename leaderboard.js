const SUPABASE_URL =
"https://rualkoaojvjiqsudzgah.supabase.co";

const SUPABASE_KEY =
"sb_publishable_oxTVjZfp9wvrrmG60Qm-cg_WsBD1pIE";


/* ========================================
   FORMAT COINS
======================================== */

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


/* ========================================
   FULL COIN FORMAT
======================================== */

function fullCoins(amount) {

    return Number(amount).toLocaleString();

}


/* ========================================
   LOAD LEADERBOARD
======================================== */

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

        /* ==========================
           RANK
        ========================== */

        let rankDisplay =
            `${index + 1}`;


        if (index === 0) {

            rankDisplay = "🥇";

        }

        else if (index === 1) {

            rankDisplay = "🥈";

        }

        else if (index === 2) {

            rankDisplay = "🥉";

        }


        /* ==========================
           SAFE VALUES
        ========================== */

        const coins =
            Number(player.coins) || 0;


        const streak =
            Number(player.daily_streak) || 0;


        const prestige =
            Number(player.prestige) || 0;


        const fishCaught =
            Number(player.stats?.fish_caught) || 0;


        const slotsPlayed =
            Number(player.stats?.slots_played) || 0;


        const coinsEarned =
            Number(player.stats?.coins_earned) || 0;


        const title =
            player.title || "Rookie";


        /* ==========================
           PRESTIGE
        ========================== */

        const prestigeDisplay =
            prestige > 0
                ? `PRESTIGE ${prestige}`
                : "NO PRESTIGE";


        /* ==========================
           CARD
        ========================== */

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

                <!-- COINS -->

                <div class="leaderboard-stat">

                    <div class="leaderboard-stat-icon">
                        💰
                    </div>

                    <div>

                        <span>
                            COINS
                        </span>

                        <strong>
                            ${fullCoins(coins)}
                        </strong>

                        <small>
                            ${formatCoins(coins)}
                        </small>

                    </div>

                </div>


                <!-- STREAK -->

                <div class="leaderboard-stat">

                    <div class="leaderboard-stat-icon">
                        🔥
                    </div>

                    <div>

                        <span>
                            DAILY STREAK
                        </span>

                        <strong>
                            ${streak}
                        </strong>

                        <small>
                            ${streak === 1 ? "day" : "days"}
                        </small>

                    </div>

                </div>

            </div>


            <div class="player-details">

                <div class="detail-stat">

                    <span>
                        🎣 FISH CAUGHT
                    </span>

                    <strong>
                        ${fullCoins(fishCaught)}
                    </strong>

                </div>


                <div class="detail-stat">

                    <span>
                        🎰 SLOTS PLAYED
                    </span>

                    <strong>
                        ${fullCoins(slotsPlayed)}
                    </strong>

                </div>


                <div class="detail-stat">

                    <span>
                        💰 COINS EARNED
                    </span>

                    <strong>
                      ${fullCoins(coinsEarned)}
                      <small>
                          (${formatCoins(coinsEarned)})
                      </small>
                    </strong>

                </div>

            </div>

        </div>

        `;

    });

}


/* ========================================
   INITIAL LOAD
======================================== */

loadLeaderboard();


/* ========================================
   AUTO REFRESH
======================================== */

setInterval(
    loadLeaderboard,
    10000
);
