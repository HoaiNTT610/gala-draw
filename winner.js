function showWinner(winner) {
document.getElementById("draw-screen").classList.add("hidden");
document.getElementById("winner-screen").classList.remove("hidden");


document.getElementById("winner-name").innerText = winner.name;
document.getElementById("winner-dept").innerText = winner.dept;


const winSound = document.getElementById("win-sound");
winSound.currentTime = 0;
winSound.play();
}


document.getElementById("btn-close").onclick = () => {
window.close();
};


document.getElementById("btn-next-spin").onclick = () => {
document.getElementById("winner-screen").classList.add("hidden");
document.getElementById("draw-screen").classList.remove("hidden");
during.currentTime = 0;
during.play();
spinWheel();
};
