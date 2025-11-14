const winSound = new Audio("sounds/win_sound.mp3");

function showWinner(winner) {
  document.getElementById("winner-name").textContent = winner.name;
  document.getElementById("winner-department").textContent = winner.department;
  document.getElementById("winner-screen").style.display = "block";
  winSound.play();
}

document.getElementById("btn-next").addEventListener("click", () => {
  document.getElementById("winner-screen").style.display = "none";
  document.getElementById("draw-screen").style.display = "block";
  duringMusic.currentTime = 0;
  duringMusic.play();
});

document.getElementById("btn-close").addEventListener("click", () => {
  window.close();
});
