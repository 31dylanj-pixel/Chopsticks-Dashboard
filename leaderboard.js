const SUPABASE_URL =
"https://rualkoaojvjiqsudzgah.supabase.co";

const SUPABASE_KEY =
"sb_publishable_oxTVjZfp9wvrrmG60Qm-cg_WsBD1pIE";


async function loadLeaderboard(){

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


    const players = await response.json();


    const container =
    document.getElementById(
        "leaderboard-container"
    );


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
            💰 ${player.coins.toLocaleString()}
            coins
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
