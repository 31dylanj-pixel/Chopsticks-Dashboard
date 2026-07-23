const SUPABASE_URL =
"https://rualkoaojvjiqsudzgah.supabase.co";

const SUPABASE_KEY =
"sb_publishable_oxTVjZfp9wvrrmG60Qm-cg_WsBD1pIE";


const accountBar =
document.querySelector(".account-bar");


let currentUser =
localStorage.getItem("currentUser") || null;



function updateAccount(){

    if(currentUser){


        accountBar.innerHTML = `

        <div class="user-pill">

            <div>

                <h3>
                    👤 ${currentUser}
                </h3>

                <p>
                    Coins: ${localStorage.getItem("coins") || 0}
                </p>

                <p>
                    Daily Streak: ${localStorage.getItem("streak") || 0}
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


        /*
            DAILY REWARD WILL GO HERE
        */

        document
        .getElementById("dailyRewardButton")
        .onclick = () => {

            alert(
                "Daily rewards coming soon!"
            );

        };


    } else {


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



    let response;



    try{


        response = await fetch(

            `${SUPABASE_URL}/auth/v1/token?grant_type=password`,

            {


                method:"POST",


                headers:{


                    apikey:SUPABASE_KEY,

                    "Content-Type":"application/json"


                },


                body:JSON.stringify({

                    email:email,

                    password:password

                })


            }

        );


    }


    catch(error){


        alert(
            "❌ Connection error!"
        );


        console.error(error);

        return;


    }




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


        `${SUPABASE_URL}/rest/v1/players?auth_id=eq.${data.user.id}&select=username,coins,streak`,


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
            "❌ No Chopsticks profile linked to this account!"
        );


        return;


    }






    const player =
    players[0];





    currentUser =
    player.username;





    localStorage.setItem(
        "currentUser",
        currentUser
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
        player.streak || 0
    );





    closeLogin();


    updateAccount();



};








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


    const currentPassword =
    document
    .getElementById("currentPassword")
    .value;



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





    if(newPassword.length < 6){


        alert(
            "❌ Password must be at least 6 characters!"
        );


        return;


    }







    const verifyResponse = await fetch(


        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,


        {


            method:"POST",


            headers:{


                apikey:SUPABASE_KEY,

                "Content-Type":"application/json"


            },


            body:JSON.stringify({


                email:
                localStorage.getItem("currentEmail"),


                password:
                currentPassword


            })


        }


    );






    const verifyData =
    await verifyResponse.json();





    if(!verifyData.access_token){


        alert(
            "❌ Current password is incorrect!"
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
            "✅ Password changed successfully!"
        );


        closePasswordChange();


    }


    else{


        alert(
            "❌ Failed to change password!"
        );


    }


};







updateAccount();







window.togglePassword = function(inputId, icon){


    const input =
    document.getElementById(inputId);




    if(input.type === "password"){


        input.type = "text";

        icon.textContent = "visibility_off";


    } else {


        input.type = "password";

        icon.textContent = "visibility";


    }


};
