const prizes = [
{ name: "Giải Đặc Biệt", qty: 1, img: "images/giai_dac_biet.jpg", main: true },
{ name: "Giải Nhất", qty: 1, img: "images/giai_nhat.jpg" },
{ name: "Giải Nhì", qty: 2, img: "images/giai_nhi.jpg" },
{ name: "Giải Ba", qty: 3, img: "images/giai_ba.jpg" }
];


const music = new Audio("sounds/open_program.mp3");
music.loop = true;
music.volume = 0.1;
let musicPlaying = false;


window.onload = () => {
loadPrizeList();
checkSavedWinners();
};


function loadPrizeList() {
const list = document.getElementById("prize-list");
list.innerHTML = "";


prizes.forEach(p => {
const item = document.createElement("div");
item.className = `prize-item ${p.main ? 'prize-main' : ''}`;
item.innerHTML = `
<img src="${p.img}" />
<h3>${p.name} - ${p.qty} giải</h3>
`;
list.appendChild(item);
});
}


// ================== MUSIC CONTROL ==================
document.getElementById("btn-music").onclick = () => {
if (!musicPlaying) {
music.play();
let x = setInterval(() => {
if (music.volume < 1) music.volume += 0.05;
else clearInterval(x);
}, 200);
musicPlaying = true;
document.getElementById("btn-music").innerText = "Dừng nhạc";
} else {
music.pause();
musicPlaying = false;
document.getElementById("btn-music").innerText = "Phát nhạc";
}
};


// ================== SWITCH TO DRAW SCREEN ==================
document.getElementById("btn-start-draw").onclick = () => {
music.pause();
document.getElementById("prizes-screen").classList.add("hidden");
document.getElementById("draw-screen").classList.remove("hidden");
startDuringMusic();
};


function checkSavedWinners() {
if (localStorage.getItem("winners")) {
if (confirm("Bạn có muốn reset danh sách người trúng?")) {
localStorage.removeItem("winners");
}
}
}
