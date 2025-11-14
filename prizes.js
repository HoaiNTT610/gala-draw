// Danh sách giải thưởng
const prizes = [
  {name: "Giải đặc biệt", quantity: 1, image: "images/giai_dac_biet.jpg"},
  {name: "Giải nhất", quantity: 2, image: "images/giai_nhat.jpg"},
  {name: "Giải nhì", quantity: 3, image: "images/giai_nhi.jpg"},
  {name: "Giải ba", quantity: 5, image: "images/giai_ba.jpg"},
];

// Biến lưu danh sách người trúng giải
window.winners = window.winners || [];

// Kiểm tra danh sách người trúng giải khi mở app
window.addEventListener("load", () => {
  const storedWinners = JSON.parse(localStorage.getItem("winners")) || [];
  if(storedWinners.length > 0){
    if(confirm("Có muốn reset lại danh sách người đã trúng giải không?")){
      localStorage.removeItem("winners");
      window.winners = [];
    } else {
      window.winners = storedWinners;
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

  // Giải đặc biệt riêng hàng đầu tiên, căn giữa
  const firstPrize = prizes[0];
  const firstDiv = document.createElement("div");
  firstDiv.className = "prize first-prize";
  firstDiv.innerHTML = `
    <img src="${firstPrize.image}" alt="${firstPrize.name}">
    <div>${firstPrize.name} (${firstPrize.quantity})</div>
  `;
  container.appendChild(firstDiv);

  // Container cho các giải còn lại
  const otherContainer = document.createElement("div");
  otherContainer.id = "other-prizes";

  for(let i=1; i<prizes.length; i++){
    const prize = prizes[i];
    const div = document.createElement("div");
    div.className = "prize";
    div.innerHTML = `
      <img src="${prize.image}" alt="${prize.name}">
      <div>${prize.name} (${prize.quantity})</div>
    `;
    otherContainer.appendChild(div);
  }

  container.appendChild(otherContainer);
}

// =======================
// Nhạc nền
// =======================
const music = new Audio("sounds/open_program.mp3");
music.volume = 0.2;
let duringMusic = new Audio("sounds/during_process.mp3");
duringMusic.loop = true;

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

// =======================
// Nút Quay
// =======================
// Tạo nút Quay mới nếu chưa có
let btnDraw = document.getElementById("btn-draw");
if(!btnDraw){
  btnDraw = document.createElement("button");
  btnDraw.id = "btn-draw";
  btnDraw.className = "floating-btn";
  btnDraw.textContent = "Quay";
  document.body.appendChild(btnDraw);
}

btnDraw.addEventListener("click", () => {
  if(!music.paused) music.pause();
  if(!duringMusic.paused) duringMusic.pause();

  document.getElementById("prizes-screen").style.display = "none";
  document.getElementById("draw-screen").style.display = "block";

  duringMusic.currentTime = 0;
  duringMusic.play();
});
