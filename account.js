const accountBar = document.querySelector(".account-bar");

let currentUser = null;


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


function closeLogin(){

    document
    .getElementById("loginModal")
    .classList.remove("active");

}


function fakeLogin(){

    const username =
    document.getElementById("loginUsername").value;


    if(username.trim() === ""){

        alert("Enter a username!");

        return;

    }


    currentUser = username;


    closeLogin();

    updateAccount();

}


updateAccount();
