document.addEventListener("DOMContentLoaded", function () {
    initKlikLinkHalaman();
    initHalamanAlbum();
    initKontrolMedia();
    cekHashUrl();
});

function initKlikLinkHalaman() {
    document.addEventListener("click", function (event) {
        const link = event.target.closest("a[href^='#page-']");
        if (!link) return;

        event.preventDefault();
        const idTujuan = link.getAttribute("href").replace("#", "");
        pindahHalaman(idTujuan);
    });

    window.addEventListener("hashchange", cekHashUrl);
}

function cekHashUrl() {
    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById(hash)) {
        pindahHalaman(hash, false);
    } else {
        pindahHalaman("page-utama", false);
    }
}

function pindahHalaman(idHalaman, updateHash = true) {
    const target = document.getElementById(idHalaman);
    if (!target) return;

    document.querySelectorAll(".halaman-section").forEach(function (sec) {
        sec.classList.remove("aktif");
    });

    hentikanSemuaMedia();

    target.classList.add("aktif");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (updateHash) {
        history.pushState(null, "", "#" + idHalaman);
    }

    document.querySelectorAll(".nav-utama .nav-link").forEach(function (nav) {
        nav.classList.remove("btn-aktif");
        if (nav.getAttribute("data-target") === idHalaman) {
            nav.classList.add("btn-aktif");
        }
    });

    if (idHalaman === "page-biodata") {
        const audioBiodata = document.getElementById("bg-music-2");
        if (audioBiodata) audioBiodata.play().catch(function () {});
    } else if (idHalaman === "page-album2") {
        const audioAlbum = document.getElementById("bg-music-album");
        if (audioAlbum) audioAlbum.play().catch(function () {});
    }
}

function initHalamanAlbum() {
    const fotoItems = document.querySelectorAll("#page-album2 .foto-item");
    if (fotoItems.length === 0) return;

    const modal = document.createElement("div");
    modal.className = "lightbox-modal";
    modal.innerHTML = `
        <img id="lightbox-img" src="" alt="Preview Foto">
        <p id="lightbox-caption"></p>
        <span>(Klik di mana saja untuk menutup)</span>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", function () {
        modal.classList.remove("tampil");
    });

    fotoItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const img = item.querySelector("img");
            const caption = item.querySelector(".caption");
            if (img) {
                document.getElementById("lightbox-img").src = img.src;
                document.getElementById("lightbox-caption").textContent = caption ? caption.textContent : "";
                modal.classList.add("tampil");
            }
        });
    });
}

function toggleMusik(idAudio, idTombol) {
    const audio = document.getElementById(idAudio);
    const tombol = document.getElementById(idTombol);
    if (!audio) return;

    if (audio.paused) {
        hentikanSemuaMedia();
        audio.play().then(function () {
            if (tombol) tombol.innerHTML = '<i class="fa-solid fa-pause"></i> Jeda Musik Latar';
        }).catch(function () {
            alert("Klik layar terlebih dahulu agar browser mengizinkan pemutaran audio.");
        });
    } else {
        audio.pause();
        if (tombol) tombol.innerHTML = '<i class="fa-solid fa-play"></i> Putar Musik Latar';
    }
}

function hentikanSemuaMedia() {
    document.querySelectorAll("audio, video").forEach(function (media) {
        if (!media.paused) media.pause();
    });

    const btnMusikUtama = document.getElementById("btn-musik-utama");
    if (btnMusikUtama) {
        btnMusikUtama.innerHTML = '<i class="fa-solid fa-play"></i> Putar Musik Latar';
    }
}

function initKontrolMedia() {
    const semuaMedia = document.querySelectorAll("audio, video");
    semuaMedia.forEach(function (mediaAktif) {
        mediaAktif.addEventListener("play", function () {
            semuaMedia.forEach(function (mediaLain) {
                if (mediaLain !== mediaAktif && !mediaLain.paused) {
                    mediaLain.pause();
                }
            });
        });
    });
}