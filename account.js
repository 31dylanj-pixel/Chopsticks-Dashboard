const SUPABASE_URL =
"https://rualkoaojvjiqsudzgah.supabase.co";

const SUPABASE_KEY =
"sb_publishable_oxTVjZfp9wvrrmG60Qm-cg_WsBD1pIE";


const accountBar =
document.querySelector(".account-bar");


let currentUser =
localStorage.getItem("currentUser") || null;



// ==========================
// COIN FORMATTER
// ==========================

function formatCoins(num){

    num = Number(num);


    const suffixes = [

        { value:1e33, suffix:"Dc" }, // Decillion
        { value:1e30, suffix:"No" }, // Nonillion
        { value:1e27, suffix:"Oc" }, // Octillion
        { value:1e24, suffix:"Sp" }, // Septillion
        { value:1e21, suffix:"Sx" }, // Sextillion
        { value:1e18, suffix:"Qi" }, // Quintillion
        { value:1e15, suffix:"Qa" }, // Quadrillion
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


        accountBar.innerHTML = `


        <div class="user-pill">


            <div>


                <h3>
                    👤 ${currentUser}
                </h3>


                <p>
                    Coins:
                    ${formatCoins(
                        localStorage.getItem("coins") || 0
                    )}
                </p>


                <p>
                    Daily Streak:
                    ${localStorage.getItem("streak") || 0}
                </p>


            </div>


        </div>





        <button
        class="daily-reward"
        id="dailyRewardButton">


            🎁 Daily Reward


        </button>





        <div class="account-actions">



            <button
            class="action-button"
            id="changePasswordButton">


                🔑 Change Password


            </button>





            <button
            class="action-button"
            id="logoutButton">


                🚪 Sign Out


            </button>



        </div>


        `;



        document
        .getElementById("changePasswordButton")
        .onclick = () => {

            openPasswordChange();

        };





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





        document
        .getElementById("dailyRewardButton")
        .onclick = () => {


            alert(
                "Daily rewards coming soon!"
            );


        };



    }

    else {



        accountBar.innerHTML = `


        <button
        class="account-pill"
        id="loginButton">


            🔐 Login


        </button>


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


        `${SUPABASE_URL}/rest/v1/players?auth_id=eq.${authID}&select=username,coins,daily_streak`,


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



    updateAccount();


}







// ==========================
// LOGIN
// ==========================

function openLogin(){

    document
    .getElementById("loginModal")
    .classList.add("active");

}





window.closeLogin = function(){

    document
    .getElementById("loginModal")
    .classList.remove("active");

};






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

                "Content-Type":"application/json"


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





    const playerResponse = await fetch(


        `${SUPABASE_URL}/rest/v1/players?auth_id=eq.${data.user.id}&select=username,coins,daily_streak`,


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



    closeLogin();

    updateAccount();


};







// ==========================
// PASSWORD CHANGE
// ==========================


function openPasswordChange(){

    document
    .getElementById("passwordModal")
    .classList.add("active");

}



window.closePasswordChange = function(){

    document
    .getElementById("passwordModal")
    .classList.remove("active");

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
                `Bearer ${localStorage.getItem("access_token")}`,


                "Content-Type":"application/json"


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






window.togglePassword = function(inputId, icon){


    const input =
    document.getElementById(inputId);



    if(input.type === "password"){


        input.type="text";

        icon.textContent="visibility_off";


    }

    else{


        input.type="password";

        icon.textContent="visibility";


    }


};






// ==========================
// START
// ==========================

updateAccount();

loadPlayerData();
