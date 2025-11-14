// =======================
// prizes.js
// =======================

// Danh sách giải thưởng
const prizes = [
  {name: "Giải đặc biệt", quantity: 1, image: "images/giai_dac_biet.jpg"},
  {name: "Giải nhất", quantity: 2, image: "images/giai_nhat.jpg"},
  {name: "Giải nhì", quantity: 3, image: "images/giai_nhi.jpg"},
  {name: "Giải ba", quantity: 5, image: "images/giai_ba.jpg"},
];

// Biến lưu danh sách người trúng giải
let winners = [];

// =======================
// Kiểm tra danh sách người trúng giải khi mở app
// =======================
window.addEventListener("load", () => {
  const storedWinners = JSON.parse(localStorage.getItem("winners")) || [];
  if(storedWinners.length > 0){
    if(confirm("Có muốn reset lại danh sách người đã trúng giải không?")){
      localStorage.removeItem("winners");
      winners = [];
    } else {
      winners = storedWinners;
    }
  }
  // Sau khi xử lý reset/load, render danh sách giải thưởng
  renderPrizes();
});

// =======================
// Render danh sách giải thưởng
// =======================
function renderPrizes() {
  const container = document.getElementById("prizes-list");
  container.innerHTML = ""; // xóa trước khi render lại
  prizes.forEach(prize => {
    const div = document.createElement("div");
    div.className = "prize";
    div.innerHTML = `
      <img src="${prize.image}" alt="${prize.name}" width="150">
      <div>${prize.name} (${prize.quantity})</div>
    `;
    container.appendChild(div);
  });
}

// =======================
// Nhạc nền
// =======================
const music = new Audio("sounds/open_program.mp3");
music.volume = 0.2;
let duringMusic = new Audio("sounds/during_process.mp3");
duringMusic.loop = true;

// =======================
// Nút Quay
// =======================
document.getElementById("btn-draw").addEventListener("click", () => {
  // Tắt nhạc nếu đang phát
  if(!music.paused) music.pause();
  if(!duringMusic.paused) duringMusic.pause();

  // Chuyển màn hình
  document.getElementById("prizes-screen").style.display = "none";
  document.getElementById("draw-screen").style.display = "block";

  // Phát nhạc during_process
  duringMusic.currentTime = 0;
  duringMusic.play();
});

// =======================
// Nút Phát nhạc / Dừng nhạc
// =======================
const btnMusic = document.getElementById("btn-music");
btnMusic.addEventListener("click", () => {
  if(music.paused){
    // Phát nhạc từ điểm dừng trước đó
    music.play();
    btnMusic.textContent = "Dừng nhạc";
  } else {
    music.pause();
    btnMusic.textContent = "Phát nhạc";
  }
});
