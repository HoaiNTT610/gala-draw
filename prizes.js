// Danh sách giải thưởng
const prizes = [
  {name: "Giải đặc biệt", quantity: 1, image: "images/giai_dac_biet.jpg"},
  {name: "Giải nhất", quantity: 2, image: "images/giai_nhat.jpg"},
  {name: "Giải nhì", quantity: 3, image: "images/giai_nhi.jpg"},
  {name: "Giải ba", quantity: 5, image: "images/giai_ba.jpg"},
];

// Biến lưu danh sách người trúng giải
let winners = [];

// Kiểm tra danh sách người trúng giải khi mở app
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

  renderPrizes();
});

// =======================
// Render danh sách giải thưởng
// =======================
function renderPrizes() {
  const container = document.getElementById("prizes-list");
  container.innerHTML = "";

  // Giải đầu tiên riêng trên hàng đầu tiên
  const firstPrize = prizes[0];
  const firstDiv = document.createElement("div");
  firstDiv.className = "prize first-prize";
  firstDiv.innerHTML = `
    <img src="${firstPrize.image}" alt="${firstPrize.name}">
    <div>${firstPrize.name} (${firstPrize.quantity})</div>
  `;
  container.appendChild(firstDiv);

  // Các giải còn lại
  for(let i=1; i<prizes.length; i++){
    const prize = prizes[i];
    const div = document.createElement("div");
    div.className = "prize";
    div.innerHTML = `
      <img src="${prize.image}" alt="${prize.name}">
      <div>${prize.name} (${prize.quantity})</div>
    `;
    container.appendChild(div);
  }
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
  if(!music.paused) music.pause();
  if(!duringMusic.paused) duringMusic.pause();

  document.getElementById("prizes-screen").style.display = "none";
  document.getElementById("draw-screen").style.display = "block";

  duringMusic.currentTime = 0;
  duringMusic.play();
});

// =======================
// Nút Phát nhạc / Dừng nhạc
// =======================
const btnMusic = document.getElementById("btn-music");
btnMusic.addEventListener("click", () => {
  if(music.paused){
    music.play();
    btnMusic.textContent = "Dừng nhạc";
  } else {
    music.pause();
    btnMusic.textContent = "Phát nhạc";
  }
});
