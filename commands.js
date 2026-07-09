const searchBar = document.getElementById("command-search");

searchBar.addEventListener("input", () => {

    const search = searchBar.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {

        const text = card.textContent.toLowerCase();

        card.style.display = text.includes(search)
            ? "flex"
            : "none";

    });

});
