/* ==========================================================
   Chopsticks Hub - account system (runs on every page)
   - Log in / Sign up / Forgot password / Change password / Sign out
   - Account button in the navigation bar, full profile on account.html
     and on the home page
   - Backed by Supabase Auth + the `players` table
========================================================== */
(function () {

    const URL_BASE = CH.SUPABASE_URL;
    const KEY = CH.SUPABASE_KEY;
    const SESSION_KEYS = [
        "currentUser", "access_token", "refresh_token", "auth_id", "currentEmail",
        "coins", "streak", "prestige_points", "streak_freezes", "player_linked"
    ];

    const $ = id => document.getElementById(id);
    const esc = CH.escapeHtml;

    /* ---------- coin formatter ---------- */
    function formatCoins(num) {
        num = Number(num) || 0;
        const suffixes = [
            [1e33, "Dc"], [1e30, "No"], [1e27, "Oc"], [1e24, "Sp"], [1e21, "Sx"], [1e18, "Qi"],
            [1e15, "Qa"], [1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "K"]
        ];
        for (const [value, suffix] of suffixes) {
            if (num >= value) return (num / value).toFixed(2) + " " + suffix;
        }
        return num.toFixed(2);
    }

    /* ---------- tiny API helpers ---------- */
    async function readJson(response) {
        try { return await response.json(); } catch { return {}; }
    }

    function authHeaders(token) {
        return { apikey: KEY, Authorization: `Bearer ${token || KEY}`, "Content-Type": "application/json" };
    }

    function friendlyError(data, status, fallback) {
        const msg = String(data?.msg || data?.message || data?.error_description || data?.error || "").toLowerCase();
        if (msg.includes("invalid login") || msg.includes("invalid credentials") || msg.includes("invalid grant"))
            return "Incorrect email or password. Please try again.";
        if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("user_already_exists"))
            return "An account with this email already exists. Try logging in instead.";
        if (msg.includes("email not confirmed"))
            return "Please confirm your email first. Check your inbox for the confirmation link.";
        if (msg.includes("rate limit") || msg.includes("too many") || status === 429)
            return "Too many attempts. Please wait a little and try again.";
        if (msg.includes("password") && (msg.includes("weak") || msg.includes("short") || msg.includes("least") || msg.includes("characters")))
            return "That password is too weak. Use at least 8 characters.";
        if (msg.includes("signup") && msg.includes("disabled"))
            return "Sign-ups are currently disabled. Please contact the site administrator.";
        if (msg.includes("valid email") || msg.includes("invalid email"))
            return "Please enter a valid email address.";
        if (status >= 500) return "The account service is temporarily unavailable. Please try again.";
        return fallback;
    }

    const NETWORK_ERROR = "Couldn't connect to the server. Check your internet connection and try again.";

    /* ---------- session ---------- */
    const session = {
        get user() { return localStorage.getItem("currentUser"); },
        get token() { return localStorage.getItem("access_token"); },
        get loggedIn() { return !!(localStorage.getItem("auth_id") && localStorage.getItem("access_token")); },
        get linked() { return localStorage.getItem("player_linked") !== "0"; },
        clear() { SESSION_KEYS.forEach(k => localStorage.removeItem(k)); },
        save(auth, email) {
            localStorage.setItem("access_token", auth.access_token);
            localStorage.setItem("auth_id", auth.user.id);
            if (auth.refresh_token) localStorage.setItem("refresh_token", auth.refresh_token);
            if (email) localStorage.setItem("currentEmail", email);
        },
        savePlayer(player, fallbackName) {
            if (!player) {
                localStorage.setItem("player_linked", "0");
                localStorage.setItem("currentUser", fallbackName || localStorage.getItem("currentUser") || "Player");
                return;
            }
            localStorage.setItem("player_linked", "1");
            localStorage.setItem("currentUser", player.username);
            localStorage.setItem("coins", player.coins || 0);
            localStorage.setItem("streak", player.daily_streak || 0);
            localStorage.setItem("prestige_points", player.prestige_points || 0);
            localStorage.setItem("streak_freezes", player.inventory?.streak_freeze || 0);
        }
    };

    async function fetchPlayer(authId, token) {
        const response = await fetch(
            `${URL_BASE}/rest/v1/players?auth_id=eq.${encodeURIComponent(authId)}&select=username,coins,daily_streak,prestige_points,inventory`,
            { headers: authHeaders(token) }
        );
        if (response.status === 401) return { expired: true };
        if (!response.ok) throw new Error("HTTP " + response.status);
        const rows = await readJson(response);
        return { player: Array.isArray(rows) && rows.length ? rows[0] : null };
    }

    async function refreshSession() {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) return false;
        try {
            const response = await fetch(`${URL_BASE}/auth/v1/token?grant_type=refresh_token`, {
                method: "POST", headers: authHeaders(), body: JSON.stringify({ refresh_token: refresh })
            });
            const data = await readJson(response);
            if (!response.ok || !data.access_token) return false;
            session.save(data);
            return true;
        } catch { return false; }
    }

    /* keep stats fresh on every page load */
    async function syncPlayer() {
        if (!session.loggedIn) return;
        try {
            let result = await fetchPlayer(localStorage.getItem("auth_id"), session.token);
            if (result.expired) {
                if (!(await refreshSession())) { session.clear(); render(); return; }
                result = await fetchPlayer(localStorage.getItem("auth_id"), session.token);
                if (result.expired) { session.clear(); render(); return; }
            }
            session.savePlayer(result.player);
            render();
        } catch (error) {
            console.warn("Could not refresh the player profile.", error);
        }
    }

    /* ---------- modals (injected so every page has them) ---------- */
    const pwField = (id, label, auto) => `
        <div class="password-box">
            <input id="${id}" type="password" autocomplete="${auto}" placeholder="${label}" aria-label="${label}">
            <button class="password-toggle" type="button" data-toggle="${id}" aria-label="Show password">Show</button>
        </div>`;

    function injectModals() {
        if ($("loginModal")) return;
        const host = document.createElement("div");
        host.innerHTML = `
        <div id="loginModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
            <form class="modal-content" id="loginForm" novalidate>
                <div class="modal-heading-icon">🥢</div>
                <span class="modal-eyebrow">WELCOME BACK</span>
                <h2 id="loginTitle">Log in</h2>
                <p class="modal-description">Sign in to see your player profile.</p>
                <input id="loginEmail" type="email" autocomplete="email" placeholder="Email" aria-label="Email">
                ${pwField("loginPassword", "Password", "current-password")}
                <div id="loginMessage" class="modal-message" role="status" aria-live="polite" hidden></div>
                <div class="modal-buttons">
                    <button class="modal-button modal-primary" id="loginSubmitButton" type="submit">Log in</button>
                    <button class="modal-button" type="button" data-close="loginModal">Cancel</button>
                </div>
                <p class="modal-switch">
                    <button type="button" class="link-btn" data-open="forgotModal">Forgot password?</button>
                    <span>No account yet? <button type="button" class="link-btn" data-open="signupModal">Sign up</button></span>
                </p>
            </form>
        </div>

        <div id="signupModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="signupTitle">
            <form class="modal-content" id="signupForm" novalidate>
                <div class="modal-heading-icon">🎣</div>
                <span class="modal-eyebrow">NEW HERE</span>
                <h2 id="signupTitle">Create account</h2>
                <p class="modal-description">Make a Chopsticks Hub account to track your profile and stats.</p>
                <input id="signupUsername" type="text" autocomplete="username" maxlength="24" placeholder="Username" aria-label="Username">
                <input id="signupEmail" type="email" autocomplete="email" placeholder="Email" aria-label="Email">
                ${pwField("signupPassword", "Password (8+ characters)", "new-password")}
                ${pwField("signupConfirm", "Confirm password", "new-password")}
                <div id="signupMessage" class="modal-message" role="status" aria-live="polite" hidden></div>
                <div class="modal-buttons">
                    <button class="modal-button modal-primary" id="signupSubmitButton" type="submit">Create account</button>
                    <button class="modal-button" type="button" data-close="signupModal">Cancel</button>
                </div>
                <p class="modal-switch"><span>Already have an account? <button type="button" class="link-btn" data-open="loginModal">Log in</button></span></p>
            </form>
        </div>

        <div id="forgotModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="forgotTitle">
            <form class="modal-content" id="forgotForm" novalidate>
                <div class="modal-heading-icon">📧</div>
                <span class="modal-eyebrow">ACCOUNT RECOVERY</span>
                <h2 id="forgotTitle">Reset password</h2>
                <p class="modal-description">Enter your email and we'll send you a reset link.</p>
                <input id="forgotEmail" type="email" autocomplete="email" placeholder="Email" aria-label="Email">
                <div id="forgotMessage" class="modal-message" role="status" aria-live="polite" hidden></div>
                <div class="modal-buttons">
                    <button class="modal-button modal-primary" id="forgotSubmitButton" type="submit">Send link</button>
                    <button class="modal-button" type="button" data-open="loginModal">Back to login</button>
                </div>
            </form>
        </div>

        <div id="passwordModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="passwordTitle">
            <form class="modal-content" id="passwordForm" novalidate>
                <div class="modal-heading-icon">🔑</div>
                <span class="modal-eyebrow">ACCOUNT SECURITY</span>
                <h2 id="passwordTitle">Change password</h2>
                <p class="modal-description">Verify your current password before choosing a new one.</p>
                ${pwField("currentPassword", "Current password", "current-password")}
                ${pwField("newPassword", "New password", "new-password")}
                ${pwField("confirmPassword", "Confirm new password", "new-password")}
                <div id="passwordMessage" class="modal-message" role="status" aria-live="polite" hidden></div>
                <div class="modal-buttons">
                    <button class="modal-button modal-primary" id="passwordSubmitButton" type="submit">Update password</button>
                    <button class="modal-button" type="button" data-close="passwordModal">Cancel</button>
                </div>
            </form>
        </div>

        <div id="logoutModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="logoutTitle">
            <div class="modal-content">
                <div class="modal-heading-icon">↗</div>
                <span class="modal-eyebrow">CHOPSTICKS ACCOUNT</span>
                <h2 id="logoutTitle">Sign out?</h2>
                <p class="modal-description">Your account data stays saved. You can log back in any time.</p>
                <div class="modal-buttons">
                    <button class="modal-button modal-primary" id="confirmLogoutButton" type="button">Yes, sign out</button>
                    <button class="modal-button" type="button" data-close="logoutModal">Cancel</button>
                </div>
            </div>
        </div>`;
        while (host.firstChild) document.body.appendChild(host.firstChild);
    }

    const MODAL_FOCUS = {
        loginModal: "loginEmail", signupModal: "signupUsername",
        forgotModal: "forgotEmail", passwordModal: "currentPassword"
    };

    function openModal(id) {
        document.querySelectorAll(".modal.active").forEach(m => closeModal(m.id));
        $(id).classList.add("active");
        document.body.classList.add("modal-open");
        setTimeout(() => ($(MODAL_FOCUS[id]) || $(id).querySelector("button"))?.focus(), 50);
    }

    function closeModal(id) {
        const modal = $(id);
        if (!modal) return;
        modal.classList.remove("active");
        modal.querySelectorAll(".modal-message").forEach(m => { m.hidden = true; m.textContent = ""; });
        modal.querySelectorAll("input[type=password], input[data-was-password]").forEach(input => {
            input.value = ""; input.type = "password";
        });
        modal.querySelectorAll(".password-toggle").forEach(b => { b.textContent = "Show"; b.setAttribute("aria-label", "Show password"); });
        if (!document.querySelector(".modal.active, .fish-modal.active")) document.body.classList.remove("modal-open");
    }

    function say(id, message, type = "info") {
        const el = $(id);
        if (!el) return;
        el.textContent = message || "";
        el.className = "modal-message" + (message ? " " + type : "");
        el.hidden = !message;
    }

    function busy(buttonId, loading, loadingText, normalText) {
        const b = $(buttonId);
        if (!b) return;
        b.disabled = loading;
        b.textContent = loading ? loadingText : normalText;
    }

    const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    /* ---------- actions ---------- */
    async function login(event) {
        event.preventDefault();
        const email = $("loginEmail").value.trim();
        const password = $("loginPassword").value;
        if (!email || !password) return say("loginMessage", "Please enter both your email and password.", "error");
        if (!validEmail(email)) return say("loginMessage", "Please enter a valid email address.", "error");

        say("loginMessage");
        busy("loginSubmitButton", true, "Signing in…", "Log in");
        try {
            const response = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
                method: "POST", headers: authHeaders(), body: JSON.stringify({ email, password })
            });
            const data = await readJson(response);
            if (!response.ok || !data.access_token || !data.user?.id) {
                return say("loginMessage", friendlyError(data, response.status, "We couldn't sign you in. Please check your details and try again."), "error");
            }
            session.save(data, email);
            await finishSignIn(data, email.split("@")[0]);
            closeModal("loginModal");
            render();
        } catch (error) {
            console.error("Login failed:", error);
            say("loginMessage", NETWORK_ERROR, "error");
        } finally {
            busy("loginSubmitButton", false, "Signing in…", "Log in");
        }
    }

    /* load the linked player; a missing player is not an error, the account just isn't linked yet */
    async function finishSignIn(auth, fallbackName) {
        try {
            const result = await fetchPlayer(auth.user.id, auth.access_token);
            session.savePlayer(result.player, fallbackName);
        } catch {
            session.savePlayer(null, fallbackName);
        }
    }

    async function signup(event) {
        event.preventDefault();
        const username = $("signupUsername").value.trim();
        const email = $("signupEmail").value.trim();
        const password = $("signupPassword").value;
        const confirm = $("signupConfirm").value;

        if (!/^[\w .-]{3,24}$/.test(username))
            return say("signupMessage", "Choose a username of 3 to 24 letters, numbers, spaces, dots, dashes or underscores.", "error");
        if (!validEmail(email)) return say("signupMessage", "Please enter a valid email address.", "error");
        if (password.length < 8) return say("signupMessage", "Your password needs at least 8 characters.", "error");
        if (password !== confirm) return say("signupMessage", "Your passwords don't match.", "error");

        say("signupMessage");
        busy("signupSubmitButton", true, "Creating…", "Create account");
        try {
            const response = await fetch(`${URL_BASE}/auth/v1/signup`, {
                method: "POST", headers: authHeaders(),
                body: JSON.stringify({ email, password, data: { username } })
            });
            const data = await readJson(response);
            if (!response.ok) {
                return say("signupMessage", friendlyError(data, response.status, "We couldn't create your account. Please try again."), "error");
            }
            /* Supabase hides duplicate emails when confirmation is on: identities come back empty */
            if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
                return say("signupMessage", "An account with this email already exists. Try logging in instead.", "error");
            }
            if (data.access_token && data.user?.id) {
                session.save(data, email);
                await finishSignIn(data, username);
                closeModal("signupModal");
                render();
            } else {
                $("signupPassword").value = ""; $("signupConfirm").value = "";
                say("signupMessage", "Account created. Check your email for a confirmation link, then log in.", "success");
            }
        } catch (error) {
            console.error("Sign-up failed:", error);
            say("signupMessage", NETWORK_ERROR, "error");
        } finally {
            busy("signupSubmitButton", false, "Creating…", "Create account");
        }
    }

    async function forgot(event) {
        event.preventDefault();
        const email = $("forgotEmail").value.trim();
        if (!validEmail(email)) return say("forgotMessage", "Please enter a valid email address.", "error");
        say("forgotMessage");
        busy("forgotSubmitButton", true, "Sending…", "Send link");
        try {
            const response = await fetch(`${URL_BASE}/auth/v1/recover`, {
                method: "POST", headers: authHeaders(), body: JSON.stringify({ email })
            });
            const data = await readJson(response);
            if (!response.ok) return say("forgotMessage", friendlyError(data, response.status, "We couldn't send the reset link. Please try again."), "error");
            say("forgotMessage", "If an account exists for that email, a reset link is on its way.", "success");
        } catch {
            say("forgotMessage", NETWORK_ERROR, "error");
        } finally {
            busy("forgotSubmitButton", false, "Sending…", "Send link");
        }
    }

    async function changePassword(event) {
        event.preventDefault();
        const current = $("currentPassword").value;
        const next = $("newPassword").value;
        const confirm = $("confirmPassword").value;
        const email = localStorage.getItem("currentEmail");

        if (!current || !next || !confirm) return say("passwordMessage", "Please fill in all three password fields.", "error");
        if (next.length < 8) return say("passwordMessage", "Your new password needs at least 8 characters.", "error");
        if (next !== confirm) return say("passwordMessage", "Your new passwords don't match.", "error");
        if (next === current) return say("passwordMessage", "Your new password must be different from your current one.", "error");
        if (!email) return say("passwordMessage", "Your saved session has no email. Please sign out and log in again first.", "error");

        say("passwordMessage");
        busy("passwordSubmitButton", true, "Updating…", "Update password");
        try {
            const verify = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
                method: "POST", headers: authHeaders(), body: JSON.stringify({ email, password: current })
            });
            const verifyData = await readJson(verify);
            if (!verify.ok || !verifyData.access_token) {
                const msg = friendlyError(verifyData, verify.status, "We couldn't verify your current password.");
                return say("passwordMessage", msg.startsWith("Incorrect") ? "Your current password is incorrect." : msg, "error");
            }
            const update = await fetch(`${URL_BASE}/auth/v1/user`, {
                method: "PUT", headers: authHeaders(verifyData.access_token), body: JSON.stringify({ password: next })
            });
            const updateData = await readJson(update);
            if (!update.ok) return say("passwordMessage", friendlyError(updateData, update.status, "Your password couldn't be updated. Please try again."), "error");

            session.save(verifyData, email);
            ["currentPassword", "newPassword", "confirmPassword"].forEach(id => { $(id).value = ""; });
            say("passwordMessage", "Your password has been changed.", "success");
        } catch {
            say("passwordMessage", NETWORK_ERROR, "error");
        } finally {
            busy("passwordSubmitButton", false, "Updating…", "Update password");
        }
    }

    function logout() {
        session.clear();
        closeModal("logoutModal");
        render();
    }

    /* ---------- rendering ---------- */
    function profileHtml() {
        const name = esc(session.user || "Player");
        const stat = (icon, label, value) => `
            <div class="player-stat">
                <span class="stat-icon">${icon}</span>
                <div><span class="stat-label">${label}</span><strong>${value}</strong></div>
            </div>`;
        const stats = session.linked
            ? `<div class="player-stats">
                ${stat("🪙", "COINS", formatCoins(localStorage.getItem("coins")))}
                ${stat("🔥", "STREAK", (localStorage.getItem("streak") || 0) + " Days")}
                ${stat("⭐", "PRESTIGE", localStorage.getItem("prestige_points") || 0)}
               </div>`
            : `<p class="unlinked-note">Your account isn't linked to a Chopsticks player yet, so there are no stats to show. Contact the site administrator to link it.</p>`;
        return `
        <div class="player-profile">
            <div class="player-main">
                <div class="player-avatar" aria-hidden="true">👤</div>
                <div class="player-identity">
                    <span class="player-label">PLAYER PROFILE</span>
                    <h2>${name}</h2>
                    <p>${esc(localStorage.getItem("currentEmail") || "Chopsticks Player")}</p>
                </div>
            </div>
            ${stats}
            <div class="player-actions">
                <button class="profile-action" type="button" data-open="passwordModal">🔑 <span>Change password</span></button>
                <button class="profile-action danger" type="button" data-open="logoutModal">🚪 <span>Sign out</span></button>
            </div>
        </div>`;
    }

    function loggedOutHtml() {
        return `
        <div class="logged-out-profile">
            <div class="logged-out-icon" aria-hidden="true">🔐</div>
            <div class="logged-out-info">
                <span class="player-label">CHOPSTICKS ACCOUNT</span>
                <h2>Sign in to Chopsticks</h2>
                <p>Log in or create an account to see your player profile and stats.</p>
            </div>
            <div class="player-actions">
                <button class="profile-login-button" type="button" data-open="loginModal">Log in <span>→</span></button>
                <button class="profile-action" type="button" data-open="signupModal">Sign up</button>
            </div>
        </div>`;
    }

    function render() {
        const panel = document.querySelector(".account-bar");
        if (panel) panel.innerHTML = session.loggedIn ? profileHtml() : loggedOutHtml();

        const slot = $("navAccount");
        if (slot) {
            slot.innerHTML = session.loggedIn
                ? `<a class="nav-account is-in" href="account.html" title="Your account"><span aria-hidden="true">👤</span><span class="nav-account-name">${esc(session.user || "Account")}</span></a>`
                : `<button class="nav-account" type="button" data-open="loginModal">Log in</button>`;
            const current = location.pathname.split("/").pop();
            if (current === "account.html") slot.querySelector("a")?.setAttribute("aria-current", "page");
        }
    }

    /* ---------- wiring ---------- */
    function init() {
        injectModals();

        document.addEventListener("click", event => {
            const open = event.target.closest("[data-open]");
            if (open) { event.preventDefault(); return openModal(open.dataset.open); }
            const close = event.target.closest("[data-close]");
            if (close) return closeModal(close.dataset.close);
            const toggle = event.target.closest("[data-toggle]");
            if (toggle) {
                const input = $(toggle.dataset.toggle);
                const show = input.type === "password";
                input.type = show ? "text" : "password";
                input.dataset.wasPassword = "1";
                toggle.textContent = show ? "Hide" : "Show";
                toggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
                return;
            }
            if (event.target.classList?.contains("modal")) closeModal(event.target.id);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") document.querySelectorAll(".modal.active").forEach(m => closeModal(m.id));
        });

        $("loginForm").addEventListener("submit", login);
        $("signupForm").addEventListener("submit", signup);
        $("forgotForm").addEventListener("submit", forgot);
        $("passwordForm").addEventListener("submit", changePassword);
        $("confirmLogoutButton").addEventListener("click", logout);

        /* keep several open tabs in sync */
        addEventListener("storage", event => {
            if (event.key === "auth_id" || event.key === "currentUser") render();
        });

        render();
        syncPlayer();
    }

    /* old inline handlers some cached pages may still call */
    window.openLogin = () => openModal("loginModal");

    /* wait for DOMContentLoaded so common.js has already built the navigation bar */
    if (document.readyState === "complete") init();
    else document.addEventListener("DOMContentLoaded", init);

})();
