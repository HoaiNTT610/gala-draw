const prizes = [
  {name: "Giải đặc biệt", quantity: 1, image: "images/giai_dac_biet.jpg"},
  {name: "Giải nhất", quantity: 2, image: "images/giai_nhat.jpg"},
  {name: "Giải nhì", quantity: 3, image: "images/giai_nhi.jpg"},
  {name: "Giải ba", quantity: 5, image: "images/giai_ba.jpg"},
];

const music = new Audio("sounds/open_program.mp3");
music.volume = 0.2;

function renderPrizes() {
  const container = document.getElementById("prizes-list");
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

renderPrizes();

document.getElementById("btn-draw").addEventListener("click", () => {
  document.getElementById("prizes-screen").style.display = "none";
  document.getElementById("draw-screen").style.display = "block";
  duringMusic.play();
});

let duringMusic = new Audio("sounds/during_process.mp3");
duringMusic.loop = true;

document.getElementById("btn-music").addEventListener("click", () => {
  if(music.paused) {
    music.play();
    document.getElementById("btn-music").textContent = "Dừng nhạc";
  } else {
    music.pause();
    document.getElementById("btn-music").textContent = "Phát nhạc";
  }
});
