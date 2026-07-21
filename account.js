const accountBar =
document.querySelector(".account-bar");


let loggedIn = false;


function updateAccount(){

    if(loggedIn){

        accountBar.innerHTML = `

        <button class="account-pill">
            👤 Dylan
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

            loggedIn = false;
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

            loggedIn = true;
            updateAccount();

        };


    }

}


updateAccount();
