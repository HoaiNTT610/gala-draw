const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");

const users = [
  {name:"Nguyễn A", department:"Sales"},
  {name:"Trần B", department:"Marketing"},
  {name:"Lê C", department:"IT"},
  {name:"Phạm D", department:"HR"},
];

let winners = JSON.parse(localStorage.getItem("winners")) || [];

function drawWheel() {
  // Vẽ bánh xe may mắn (simple colors + labels)
}

function spinWheel() {
  let start = Date.now();
  const duration = 25000; // 25s
  const spin = () => {
    const elapsed = Date.now() - start;
    if(elapsed < duration) {
      // rotate wheel
      requestAnimationFrame(spin);
    } else {
      selectWinner();
    }
  };
  spin();
}

document.getElementById("btn-spin").addEventListener("click", spinWheel);

function selectWinner() {
  const availableUsers = users.filter(u => !winners.includes(u.name));
  if(availableUsers.length === 0) {
    alert("Đã hết người chưa trúng!");
    return;
  }
  const winner = availableUsers[Math.floor(Math.random()*availableUsers.length)];
  winners.push(winner.name);
  localStorage.setItem("winners", JSON.stringify(winners));

  duringMusic.pause();
  document.getElementById("draw-screen").style.display = "none";
  showWinner(winner);
}
