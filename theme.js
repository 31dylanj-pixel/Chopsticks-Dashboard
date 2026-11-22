/* Runs in <head> before first paint: applies saved theme + motion prefs. */
(function () {
    var root = document.documentElement;
    var theme = localStorage.getItem("theme") || "dark";
    root.classList.add(theme + "-theme");
    if (localStorage.getItem("reduceMotion") === "on") {
        root.classList.add("reduce-motion");
    }
})();
