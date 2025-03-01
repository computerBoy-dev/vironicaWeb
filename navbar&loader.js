window.onload = function () {
    setTimeout(function () {
        document.querySelector('.loader-container').style.opacity = '0';
        setTimeout(function () {
            document.querySelector('.loader-container').style.display = 'none';
        }, 1000);
    }, 2000);
};

document.addEventListener("DOMContentLoaded", function () {
    // Navbar Menu Toggle
    const menuButton = document.querySelector(".menu i");
    const dropdown = document.querySelector(".dropdown");

    window.toggleMenu = function () { // Expose toggleMenu globally
        if (dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
            setTimeout(() => {
                dropdown.style.display = "none";
            }, 300);
            menuButton.classList.replace("bx-x", "bx-menu"); // Change icon to menu
        } else {
            dropdown.style.display = "block";
            setTimeout(() => {
                dropdown.classList.add("show");
            }, 10);
            menuButton.classList.replace("bx-menu", "bx-x"); // Change icon to close
        }
    };

    document.addEventListener("click", function (event) {
        if (!dropdown.contains(event.target) && !menuButton.parentElement.contains(event.target)) {
            dropdown.classList.remove("show");
            setTimeout(() => {
                dropdown.style.display = "none";
            }, 300);
            menuButton.classList.replace("bx-x", "bx-menu"); // Reset icon
        }
    });

    document.querySelector(".menu").addEventListener("click", function (event) {
        event.stopPropagation();
        toggleMenu();
    });

    // Popup Logic
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const body = document.body;
    const cancelBtn = document.querySelector(".cancel-btn");

    window.openPopup = function () { // Expose function globally
        overlay.style.display = "block";
        popup.classList.add("show");
        body.classList.add("blur");
    };

    window.closePopup = function () { // Expose function globally
        overlay.style.display = "none";
        popup.classList.remove("show");
        body.classList.remove("blur");
    };

    document.querySelector(".bx-message-alt-x").parentElement.addEventListener("click", function (event) {
        event.preventDefault();
        openPopup();
    });

    cancelBtn.addEventListener("click", closePopup);
    overlay.addEventListener("click", closePopup);
});
