const themeToggle = document.getElementById("themeToggle");
const themeName = document.getElementById("themeName");
const bgToggle = document.getElementById("bgToggle");
const motionToggle = document.getElementById("motionToggle");
const note = document.getElementById("settingsNote");

function paintTheme() {
    const dark = document.documentElement.classList.contains("dark-theme");
    themeToggle.checked = dark;
    themeName.textContent = dark ? "Dark mode is on." : "Light mode is on.";
}

function paintAll() {
    paintTheme();
    bgToggle.checked = localStorage.getItem("animatedBg") !== "off";
    motionToggle.checked = localStorage.getItem("reduceMotion") === "on";
}

function say(message) {
    note.textContent = message;
}

themeToggle.addEventListener("change", () => {
    CH.setTheme(themeToggle.checked ? "dark" : "light");
});
document.addEventListener("themechange", paintTheme);

bgToggle.addEventListener("change", () => {
    localStorage.setItem("animatedBg", bgToggle.checked ? "on" : "off");
    location.reload();
});

motionToggle.addEventListener("change", () => {
    localStorage.setItem("reduceMotion", motionToggle.checked ? "on" : "off");
    document.documentElement.classList.toggle("reduce-motion", motionToggle.checked);
    say("Motion preference saved.");
});

document.getElementById("resetSettings").addEventListener("click", () => {
    ["animatedBg", "reduceMotion"].forEach(k => localStorage.removeItem(k));
    document.documentElement.classList.remove("reduce-motion");
    CH.setTheme("dark");
    paintAll();
    say("Settings were reset. Reload to bring back the 3D background.");
});

paintAll();
