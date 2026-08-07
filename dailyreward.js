function openDailyReward(){

    document
    .getElementById("dailyRewardModal")
    .classList.add("active");

}

document.addEventListener("DOMContentLoaded", () => {

    const closeBtn =
    document.getElementById("dailyClose");

    if(closeBtn){

        closeBtn.onclick = () => {

            document
            .getElementById("dailyRewardModal")
            .classList.remove("active");

        };

    }

});
