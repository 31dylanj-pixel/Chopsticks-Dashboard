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
                .replace(".0", "") + unit.symbol;

        }

    }

    return amount.toString();

}

async function loadLeaderboard() {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/players?select=username,coins,title,prestige,daily_streak&order=coins.desc&limit=10`,
        {
            headers:{
                apikey: SUPABASE_KEY,
                Authorization:
                `Bearer ${SUPABASE_KEY}`
            }
        }
    );

    console.log("Status:", response.status);

    const players = await response.json();

    console.log("Players:", players);

    const container = document.getElementById("leaderboard");

    console.log("Container:", container);

    container.innerHTML = "";

    players.forEach((player,index)=>{

        container.innerHTML += `

        <div class="card">

            <h2>
            ${index + 1}.
            ${player.username}
            </h2>

            <p>
            🏷 ${player.title}
            </p>

            <p>
            💰 ${player.coins.toLocaleString()} coins
            </p>

            <p>
            ⭐ Prestige:
            ${player.prestige}
            </p>

            <p>
            🔥 Streak:
            ${player.daily_streak}
            </p>

        </div>

        `;

    });

}
loadLeaderboard();

// Refresh every 30 seconds
setInterval(loadLeaderboard, 30000);
