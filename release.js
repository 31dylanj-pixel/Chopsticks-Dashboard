const search =
document.getElementById("releaseSearch");


const releases =
document.querySelectorAll(".release-card");



search.addEventListener(
"input",
() => {


    const value =
    search.value.toLowerCase();



    releases.forEach(card => {


        const text =
        card.innerText.toLowerCase();



        if(text.includes(value)){

            card.style.display =
            "flex";

        }

        else{

            card.style.display =
            "none";

        }


    });


});
