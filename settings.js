const thumbIcon =
document.querySelector(".thumb-icon");

const toggle =
document.getElementById("themeToggle");

const themeName =
document.getElementById("themeName");


function applyTheme(theme){

    document.documentElement.classList.remove(
        "dark-theme",
        "light-theme"
    );


    document.documentElement.classList.add(
        theme + "-theme"
    );


    localStorage.setItem(
        "theme",
        theme
    );


    if(theme === "dark"){

        themeName.textContent = "Dark Mode";

        thumbIcon.className =
        "bi bi-moon-stars thumb-icon";

        toggle.checked = true;

    }

    else{

        themeName.textContent = "Light Mode";

        thumbIcon.className =
        "bi bi-sun thumb-icon";

        toggle.checked = false;

    }

}



const currentTheme =
localStorage.getItem("theme")
|| "dark";


applyTheme(currentTheme);



toggle.addEventListener("change", () => {

    if(toggle.checked){

        applyTheme("dark");

    }

    else{

        applyTheme("light");

    }

});
