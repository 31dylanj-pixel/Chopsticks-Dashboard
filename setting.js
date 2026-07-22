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

        themeName.innerHTML = "🌙 Dark";
        document.querySelector(".thumb-icon").textContent = "🌙";
    }

    else {

        themeName.innerHTML = "☀️ Light";
        document.querySelector(".thumb-icon").textContent = "☀️";
    }

}



const currentTheme =
localStorage.getItem("theme")
|| "dark";


applyTheme(currentTheme);
toggle.checked = currentTheme === "dark";


toggle.addEventListener("change", () => {

    if(toggle.checked){

        applyTheme("dark");

    }

    else{

        applyTheme("light");

    }

});
