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
            openLogoutModal();
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

/* ==========================
   MODAL FEEDBACK HELPERS
========================== */

function setModalMessage(elementId, message = "", type = "info") {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.textContent = message;
    element.className = "modal-message";
    element.hidden = !message;

    if (message) {
        element.classList.add(type);
    }
}

function setButtonLoading(buttonId, loading, loadingText, normalText) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.disabled = loading;
    button.classList.toggle("is-loading", loading);
    button.textContent = loading ? loadingText : normalText;
}

async function readResponse(response) {
    try {
        return await response.json();
    } catch {
        return {};
    }
}

function getAuthErrorMessage(data) {
    const message = String(
        data?.msg || data?.message || data?.error_description || data?.error || ""
    ).toLowerCase();

    if (
        message.includes("invalid login credentials") ||
        message.includes("invalid credentials") ||
        message.includes("invalid grant")
    ) {
        return "Incorrect email or password. Please try again.";
    }

    if (message.includes("rate limit") || message.includes("too many requests")) {
        return "Too many attempts. Please wait a little and try again.";
    }

    return "";
}

/* ==========================
   LOGIN MODAL
========================== */

function openLogin() {
    setModalMessage("loginMessage");

    document.getElementById("loginModal")
        .classList.add("active");

    setTimeout(() => {
        document.getElementById("loginEmail")?.focus();
    }, 50);
}

window.closeLogin = function () {
    document.getElementById("loginModal")
        .classList.remove("active");

    setModalMessage("loginMessage");
};


/* ==========================
   LOGIN AUTHENTICATION
========================== */

window.fakeLogin = async function () {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const messageId = "loginMessage";
    const buttonId = "loginSubmitButton";

    if (!email || !password) {
        setModalMessage(
            messageId,
            "Please enter both your email and password.",
            "error"
        );
        return;
    }

    if (!emailInput.checkValidity()) {
        setModalMessage(
            messageId,
            "Please enter a valid email address.",
            "error"
        );
        emailInput.focus();
        return;
    }

    setModalMessage(messageId);
    setButtonLoading(buttonId, true, "Signing in…", "Login");

    try {
        const response = await fetch(
            `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
            {
                method: "POST",
                headers: {
                    apikey: SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            }
        );

        const data = await readResponse(response);

        if (!response.ok || !data.access_token || !data.user?.id) {
            const authMessage = getAuthErrorMessage(data);

            setModalMessage(
                messageId,
                authMessage ||
                (response.status >= 500
                    ? "The authentication service is temporarily unavailable. Please try again."
                    : "We couldn't sign you in. Please check your details and try again."),
                "error"
            );
            return;
        }

        // Load the linked Chopsticks player before saving the session locally.
        const playerResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/players?auth_id=eq.${encodeURIComponent(data.user.id)}&select=username,coins,daily_streak,prestige_points,inventory`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${data.access_token}`
                }
            }
        );

        if (!playerResponse.ok) {
            setModalMessage(
                messageId,
                "Your account was authenticated, but your player profile couldn't be loaded. Please try again.",
                "error"
            );
            return;
        }

        const players = await readResponse(playerResponse);

        if (!Array.isArray(players) || players.length === 0) {
            setModalMessage(
                messageId,
                "Your account doesn't have a linked Chopsticks player profile. Please contact the site administrator.",
                "error"
            );
            return;
        }

        const player = players[0];

        // Save the session only after the player profile has been found.
        currentUser = player.username;

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("auth_id", data.user.id);
        localStorage.setItem("currentUser", player.username);
        localStorage.setItem("currentEmail", email);
        localStorage.setItem("coins", player.coins || 0);
        localStorage.setItem("streak", player.daily_streak || 0);
        localStorage.setItem("prestige_points", player.prestige_points || 0);
        localStorage.setItem(
            "streak_freezes",
            player.inventory?.streak_freeze || 0
        );

        if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
        }

        closeLogin();
        updateAccount();

    } catch (error) {
        console.error("Login request failed:", error);

        setModalMessage(
            messageId,
            "Couldn't connect to the server. Check your internet connection and try again.",
            "error"
        );
    } finally {
        setButtonLoading(buttonId, false, "Signing in…", "Login");
    }
};

/* ==========================
   PASSWORD CHANGE MODAL
========================== */

function openPasswordChange() {
    setModalMessage("passwordMessage");

    document.getElementById("passwordModal")
        .classList.add("active");

    setTimeout(() => {
        document.getElementById("currentPassword")?.focus();
    }, 50);
}

window.closePasswordChange = function () {
    document.getElementById("passwordModal")
        .classList.remove("active");

    setModalMessage("passwordMessage");

    // Clear password fields when the modal closes.
    ["currentPassword", "newPassword", "confirmPassword"].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = "";
            input.type = "password";
        }
    });

    document.querySelectorAll(
        "#passwordModal .password-toggle"
    ).forEach(icon => {
        icon.textContent = "visibility";
        icon.setAttribute("aria-label", "Show password");
    });
};


/* ==========================
   CHANGE PASSWORD
========================== */

window.changePassword = async function () {
    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const messageId = "passwordMessage";
    const buttonId = "passwordSubmitButton";

    if (!currentPassword || !newPassword || !confirmPassword) {
        setModalMessage(
            messageId,
            "Please fill in all three password fields.",
            "error"
        );
        return;
    }

    if (newPassword !== confirmPassword) {
        setModalMessage(
            messageId,
            "Your new passwords don't match. Please check them and try again.",
            "error"
        );
        document.getElementById("confirmPassword").focus();
        return;
    }

    if (newPassword === currentPassword) {
        setModalMessage(
            messageId,
            "Your new password must be different from your current password.",
            "error"
        );
        return;
    }

    const email = localStorage.getItem("currentEmail");

    if (!email) {
        setModalMessage(
            messageId,
            "Your saved session doesn't include your email address. Please sign out and sign in again before changing your password.",
            "error"
        );
        return;
    }

    setModalMessage(messageId);
    setButtonLoading(
        buttonId,
        true,
        "Updating…",
        "Update Password"
    );

    try {
        /*
         * STEP 1:
         * Verify the current password by signing in again.
         * This does not update the password.
         */
        const verifyResponse = await fetch(
            `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
            {
                method: "POST",
                headers: {
                    apikey: SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password: currentPassword
                })
            }
        );

        const verifyData = await readResponse(verifyResponse);

        if (
            !verifyResponse.ok ||
            !verifyData.access_token ||
            !verifyData.user?.id
        ) {
            const authMessage = getAuthErrorMessage(verifyData);

            setModalMessage(
                messageId,
                authMessage === "Incorrect email or password. Please try again."
                    ? "Your current password is incorrect. Please try again."
                    : authMessage ||
                      "We couldn't verify your current password. Please try again.",
                "error"
            );
            return;
        }

        /*
         * STEP 2:
         * Use the newly verified session to update the password.
         */
        const updateResponse = await fetch(
            `${SUPABASE_URL}/auth/v1/user`,
            {
                method: "PUT",
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${verifyData.access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: newPassword
                })
            }
        );

        const updateData = await readResponse(updateResponse);

        if (!updateResponse.ok) {
            const serverMessage =
                updateData.msg ||
                updateData.message ||
                updateData.error_description ||
                updateData.error;

            // Avoid showing raw server errors that might contain technical details.
            const safeMessage = String(serverMessage || "").toLowerCase();

            let friendlyMessage =
                "Your password couldn't be updated. Please try again.";

            if (
                safeMessage.includes("password") &&
                (
                    safeMessage.includes("weak") ||
                    safeMessage.includes("short") ||
                    safeMessage.includes("length") ||
                    safeMessage.includes("characters")
                )
            ) {
                friendlyMessage =
                    "That password doesn't meet the password requirements. Please choose a stronger password.";
            } else if (updateResponse.status >= 500) {
                friendlyMessage =
                    "The authentication service is temporarily unavailable. Please try again later.";
            }

            setModalMessage(messageId, friendlyMessage, "error");
            return;
        }

        // Preserve the freshly issued session returned during verification.
        localStorage.setItem("access_token", verifyData.access_token);

        if (verifyData.refresh_token) {
            localStorage.setItem("refresh_token", verifyData.refresh_token);
        }

        if (verifyData.user?.id) {
            localStorage.setItem("auth_id", verifyData.user.id);
        }

        setModalMessage(
            messageId,
            "Your password has been changed successfully.",
            "success"
        );

        // Clear the fields but keep the success message visible.
        ["currentPassword", "newPassword", "confirmPassword"].forEach(id => {
            document.getElementById(id).value = "";
        });

        document.querySelectorAll(
            "#passwordModal .password-toggle"
        ).forEach(icon => {
            icon.textContent = "visibility";
            icon.setAttribute("aria-label", "Show password");
        });

    } catch (error) {
        console.error("Password change request failed:", error);

        setModalMessage(
            messageId,
            "Couldn't connect to the server. Check your internet connection and try again.",
            "error"
        );
    } finally {
        setButtonLoading(
            buttonId,
            false,
            "Updating…",
            "Update Password"
        );
    }
};

/* ==========================
   SIGN OUT CONFIRMATION
========================== */

window.openLogoutModal = function () {
    setModalMessage("logoutMessage");

    document.getElementById("logoutModal")
        .classList.add("active");
};

window.closeLogoutModal = function () {
    document.getElementById("logoutModal")
        .classList.remove("active");

    setModalMessage("logoutMessage");
};

window.confirmLogout = function () {
    currentUser = null;

    [
        "currentUser",
        "access_token",
        "refresh_token",
        "auth_id",
        "currentEmail",
        "coins",
        "streak",
        "prestige_points",
        "streak_freezes"
    ].forEach(key => localStorage.removeItem(key));

    closeLogoutModal();
    updateAccount();
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

/* ==========================
   KEYBOARD SUBMISSION
========================== */

document.querySelectorAll(
    "#loginModal input"
).forEach(input => {
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            fakeLogin();
        }
    });
});

document.querySelectorAll(
    "#passwordModal input"
).forEach(input => {
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            changePassword();
        }
    });
});
