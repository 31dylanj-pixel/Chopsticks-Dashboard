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

        <button class="account-pill">
            👤 ${currentUser}
        </button>


        <button 
        class="account-pill"
        id="logoutButton">

            🚪 Sign Out

        </button>

        `;



        document
        .getElementById("logoutButton")
        .onclick = () => {


            currentUser = null;


            localStorage.removeItem(
                "currentUser"
            );


            updateAccount();


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



    const response = await fetch(

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



    const data =
    await response.json();



    console.log(data);



    if(data.error){

        alert(
            "Wrong email or password!"
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


    currentUser =
    "DylanJ";


    localStorage.setItem(
        "currentUser",
        currentUser
    );


    closeLogin();

    updateAccount();


}



updateAccount();
