const music = document.getElementById("bgMusic");

const vinyl = document.querySelector(".vinyl");

document.body.addEventListener("click", () => {

    if (music.paused) {

        music.play();

        vinyl.classList.remove("paused");

    }

}, { once:true });

vinyl.addEventListener("click", () => {

    if (music.paused) {

        music.play();

        vinyl.classList.remove("paused");

    }

    else {

        music.pause();

        vinyl.classList.add("paused");

    }

});
