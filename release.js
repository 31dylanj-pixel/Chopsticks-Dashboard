document.addEventListener("DOMContentLoaded", () => {


const search =
document.getElementById("releaseSearch");


const releases =
document.querySelectorAll(".release-card");


const groups =
document.querySelectorAll(".release-group");



search.addEventListener("input", () => {


    const value =
    search.value.toLowerCase().trim();



    // Reset everything

    if(value === ""){


        releases.forEach(card => {

            card.style.display = "";

        });



        groups.forEach(group => {

            group.open = false;

        });


        return;

    }




    groups.forEach(group => {


        let groupMatch = false;



        const cards =
        group.querySelectorAll(".release-card");



        cards.forEach(card => {


            const text =
            card.innerText.toLowerCase();



            if(text.includes(value)){


                card.style.display = "";


                groupMatch = true;


            }

            else{


                card.style.display = "none";


            }


        });



        if(groupMatch){

            group.open = true;

        }

        else{

            group.open = false;

        }


    });




    // Cards NOT inside details

    releases.forEach(card => {


        if(card.closest(".release-group")){

            return;

        }



        const text =
        card.innerText.toLowerCase();



        if(text.includes(value)){


            card.style.display = "";


        }

        else{


            card.style.display = "none";


        }


    });


});


});
