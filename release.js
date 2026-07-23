const search =
document.getElementById("releaseSearch");


const releases =
document.querySelectorAll(".release-card");


const groups =
document.querySelectorAll(".release-group");



search.addEventListener(
"input",
() => {


    const value =
    search.value.toLowerCase().trim();



    // If search is empty
    if(value === ""){


        releases.forEach(card => {

            card.style.display = "flex";

        });



        groups.forEach(group => {

            group.open = false;

        });


        return;

    }





    groups.forEach(group => {


        let hasMatch = false;



        const cards =
        group.querySelectorAll(".release-card");



        cards.forEach(card => {


            const text =
            card.innerText.toLowerCase();



            if(text.includes(value)){


                card.style.display = "flex";

                hasMatch = true;


            }

            else{


                card.style.display = "none";


            }


        });



        // Automatically expand if found
        if(hasMatch){

            group.open = true;

        }

        else{

            group.open = false;

        }


    });





    // Normal cards outside groups

    releases.forEach(card => {


        if(card.closest(".release-group")){

            return;

        }



        const text =
        card.innerText.toLowerCase();



        if(text.includes(value)){


            card.style.display = "flex";


        }

        else{


            card.style.display = "none";


        }


    });



});
