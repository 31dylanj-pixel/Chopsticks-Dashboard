const SUPABASE_URL = "https://rualkoaojvjiqsudzgah.supabase.co";
const SUPABASE_KEY = "sb_publishable_oxTVjZfp9wvrrmG60Qm-cg_WsBD1pIE";

const accountBar = document.querySelector(".account-bar");

let currentUser =
    localStorage.getItem("currentUser") || null;


// ==========================
// COIN FORMATTER
// ==========================

function formatCoins(num){

    num = Number(num);

    const suffixes = [

        { value:1e33, suffix:"Dc" },
        { value:1e30, suffix:"No" },
        { value:1e27, suffix:"Oc" },
        { value:1e24, suffix:"Sp" },
        { value:1e21, suffix:"Sx" },
        { value:1e18, suffix:"Qi" },
        { value:1e15, suffix:"Qa" },
        { value:1e12, suffix:"T" },
        { value:1e9, suffix:"B" },
        { value:1e6, suffix:"M" },
        { value:1e3, suffix:"K" }

    ];

    for(let i = 0; i < suffixes.length; i++){

        if(num >= suffixes[i].value){

            return (
                num / suffixes[i].value
            ).toFixed(2)
            + " "
            + suffixes[i].suffix;

        }

    }

    return num.toFixed(2);

}


// ==========================
// ACCOUNT DISPLAY
// ==========================

function updateAccount(){

    if(currentUser){

        const coins =
            formatCoins(
                localStorage.getItem("coins") || 0
            );

        const streak =
            localStorage.getItem("streak") || 0;

        const prestige =
            localStorage.getItem("prestige_points") || 0;

        accountBar.innerHTML = `

        <div class="player-profile">


            <div class="player-main">


                <div class="player-avatar">

                    👤

                </div>


                <div class="player-identity">

                    <span class="player-label">
                        PLAYER PROFILE
                    </span>

                    <h2>
                        ${currentUser}
                    </h2>

                    <p>
                        Chopsticks Player
                    </p>

                </div>


            </div>



            <div class="player-stats">


                <div class="player-stat">

                    <span class="stat-icon">
                        🪙
                    </span>

                    <div>

                        <span class="stat-label">
                            COINS
                        </span>

                        <strong>
                            ${coins}
                        </strong>

                    </div>

                </div>



                <div class="player-stat">

                    <span class="stat-icon">
                        🔥
                    </span>

                    <div>

                        <span class="stat-label">
                            STREAK
                        </span>

                        <strong>
                            ${streak} Days
                        </strong>

                    </div>

                </div>



                <div class="player-stat">

                    <span class="stat-icon">
                        ⭐
                    </span>

                    <div>

                        <span class="stat-label">
                            PRESTIGE
                        </span>

                        <strong>
                            ${prestige}
                        </strong>

                    </div>

                </div>


            </div>



            <div class="player-actions">


                <button
                class="profile-action"
                id="changePasswordButton">

                    🔑
                    <span>Change Password</span>

                </button>


                <button
                class="profile-action danger"
                id="logoutButton">

                    🚪
                    <span>Sign Out</span>

                </button>


            </div>


        </div>

        `;


        // CHANGE PASSWORD

        document
        .getElementById("changePasswordButton")
        .onclick = () => {

            openPasswordChange();

        };


        // LOGOUT

        document
        .getElementById("logoutButton")
        .onclick = () => {

            currentUser = null;

            localStorage.removeItem("currentUser");
            localStorage.removeItem("access_token");
            localStorage.removeItem("auth_id");
            localStorage.removeItem("currentEmail");
            localStorage.removeItem("coins");
            localStorage.removeItem("streak");

            updateAccount();

        };

    }

    else {

        accountBar.innerHTML = `

        <div class="logged-out-profile">

            <div class="logged-out-icon">
                🔐
            </div>

            <div class="logged-out-info">

                <span class="player-label">
                    CHOPSTICKS ACCOUNT
                </span>

                <h2>
                    Sign in to Chopsticks
                </h2>

                <p>
                    Access your player profile and stats.
                </p>

            </div>

            <button
            class="profile-login-button"
            id="loginButton">

                Login
                <span>→</span>

            </button>

        </div>

        `;


        document
        .getElementById("loginButton")
        .onclick = () => {

            openLogin();

        };

    }

}
// ==========================
// LOAD PLAYER DATA
// ==========================

async function loadPlayerData(){

    const authID =
        localStorage.getItem("auth_id");


    if(!authID)
        return;


    const response = await fetch(

        `${SUPABASE_URL}/rest/v1/players?auth_id=eq.${authID}&select=username,coins,daily_streak,prestige_points,inventory`,

        {

            headers:{

                apikey:SUPABASE_KEY,

                Authorization:
                `Bearer ${SUPABASE_KEY}`

            }

        }

    );


    const players =
        await response.json();


    if(players.length === 0)
        return;


    const player =
        players[0];


    console.log(player);


    currentUser =
        player.username;


    localStorage.setItem(
        "currentUser",
        player.username
    );


    localStorage.setItem(
        "coins",
        player.coins || 0
    );


    localStorage.setItem(
        "streak",
        player.daily_streak || 0
    );


    // Keep these for other Chopsticks systems

    localStorage.setItem(
        "prestige_points",
        player.prestige_points || 0
    );


    localStorage.setItem(
        "streak_freezes",
        player.inventory?.streak_freeze || 0
    );


    updateAccount();

}


// ==========================
// LOGIN
// ==========================

function openLogin(){

    document
    .getElementById("loginModal")
    .classList
    .add("active");

}


window.closeLogin = function(){

    document
    .getElementById("loginModal")
    .classList
    .remove("active");

};


// ==========================
// LOGIN AUTHENTICATION
// ==========================

window.fakeLogin = async function(){

    const email =
        document
        .getElementById("loginEmail")
        .value
        .trim();


    const password =
        document
        .getElementById("loginPassword")
        .value;


    const response = await fetch(

        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,

        {

            method:"POST",

            headers:{

                apikey:SUPABASE_KEY,

                "Content-Type":
                "application/json"

            },

            body:JSON.stringify({

                email,
                password

            })

        }

    );


    const data =
        await response.json();


    if(!data.access_token){

        alert(
            "❌ Incorrect email or password!"
        );

        return;

    }


    localStorage.setItem(
        "access_token",
        data.access_token
    );


    localStorage.setItem(
        "auth_id",
        data.user.id
    );


    // ==========================
    // LOAD CHOPSTICKS PROFILE
    // ==========================

    const playerResponse =
        await fetch(

            `${SUPABASE_URL}/rest/v1/players?auth_id=eq.${data.user.id}&select=username,coins,daily_streak,prestige_points,inventory`,

            {

                headers:{

                    apikey:SUPABASE_KEY,

                    Authorization:
                    `Bearer ${SUPABASE_KEY}`

                }

            }

        );


    const players =
        await playerResponse.json();


    if(players.length === 0){

        alert(
            "❌ No Chopsticks profile linked!"
        );

        return;

    }


    const player =
        players[0];


    currentUser =
        player.username;


    localStorage.setItem(
        "currentUser",
        player.username
    );


    localStorage.setItem(
        "currentEmail",
        email
    );


    localStorage.setItem(
        "coins",
        player.coins || 0
    );


    localStorage.setItem(
        "streak",
        player.daily_streak || 0
    );


    localStorage.setItem(
        "prestige_points",
        player.prestige_points || 0
    );


    localStorage.setItem(
        "streak_freezes",
        player.inventory?.streak_freeze || 0
    );


    closeLogin();

    updateAccount();

};


// ==========================
// PASSWORD CHANGE
// ==========================

function openPasswordChange(){

    document
    .getElementById("passwordModal")
    .classList
    .add("active");

}


window.closePasswordChange = function(){

    document
    .getElementById("passwordModal")
    .classList
    .remove("active");

};


window.changePassword = async function(){

    const newPassword =
        document
        .getElementById("newPassword")
        .value;


    const confirmPassword =
        document
        .getElementById("confirmPassword")
        .value;


    if(newPassword !== confirmPassword){

        alert(
            "❌ Passwords do not match!"
        );

        return;

    }


    const response = await fetch(

        `${SUPABASE_URL}/auth/v1/user`,

        {

            method:"PUT",

            headers:{

                apikey:SUPABASE_KEY,

                Authorization:
                `Bearer ${
                    localStorage.getItem("access_token")
                }`,

                "Content-Type":
                "application/json"

            },

            body:JSON.stringify({

                password:newPassword

            })

        }

    );


    if(response.ok){

        alert(
            "✅ Password changed!"
        );

        closePasswordChange();

    }

};


// ==========================
// PASSWORD VISIBILITY
// ==========================

window.togglePassword =
function(inputId, icon){

    const input =
        document.getElementById(inputId);


    if(input.type === "password"){

        input.type = "text";

        icon.textContent =
            "visibility_off";

    }

    else{

        input.type = "password";

        icon.textContent =
            "visibility";

    }

};


// ==========================
// START
// ==========================

updateAccount();

loadPlayerData();
