function setTheme(theme){

    localStorage.setItem(
        "theme",
        theme
    );

    applyTheme();

}

function applyTheme(){

    const theme =
        localStorage.getItem("theme")
        || "dark";

    document.body.classList.remove(
        "light-theme",
        "dark-theme"
    );

    document.body.classList.add(
        theme + "-theme"
    );

}

applyTheme();
