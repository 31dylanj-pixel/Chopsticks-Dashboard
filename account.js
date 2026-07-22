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





window.fakeLogin = function(){


    console.log("fakeLogin started");



    const username =
    document
    .getElementById("loginUsername")
    .value
    .trim();



    const password =
    document
    .getElementById("loginPassword")
    .value;



    console.log(
        "Username:",
        username
    );


    console.log(
        "Password:",
        password
    );



    if(!accounts[username]){


        alert(
            "Account does not exist!"
        );


        return;


    }




    if(accounts[username].password !== password){


        alert(
            "Incorrect password!"
        );


        return;


    }





    currentUser = username;



    localStorage.setItem(
        "currentUser",
        username
    );



    console.log(
        "Saved:",
        localStorage.getItem("currentUser")
    );



    closeLogin();


    updateAccount();



};

window.changePassword = function(){

    alert(
        "Password changing coming soon!"
    );

};



updateAccount();
