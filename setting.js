const darkButton =
document.getElementById("darkButton");

const lightButton =
document.getElementById("lightButton");

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

        themeName.innerHTML =
        "🌙 Dark";

    }

    else {

        themeName.innerHTML =
        "☀️ Light";

    }

}



const currentTheme =
localStorage.getItem("theme")
|| "dark";


applyTheme(currentTheme);



darkButton.onclick = () => {

    applyTheme("dark");

};



lightButton.onclick = () => {

    applyTheme("light");

};
