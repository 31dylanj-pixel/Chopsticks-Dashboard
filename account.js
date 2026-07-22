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


window.closeLogin = function(){

    document
    .getElementById("loginModal")
    .classList.remove("active");

};


window.fakeLogin = function(){

    const username =
    document.getElementById("loginUsername").value.trim();


    const password =
    document.getElementById("loginPassword").value;



    if(!accounts[username]){

        alert("Account does not exist!");

        return;

    }



    if(accounts[username].password !== password){

        alert("Incorrect password!");

        return;

    }



    currentUser = username;


    closeLogin();

    updateAccount();

}


updateAccount();
