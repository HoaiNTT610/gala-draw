const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");

const users = [
  {name:"Nguyễn A", department:"Sales"},
  {name:"Trần B", department:"Marketing"},
  {name:"Lê C", department:"IT"},
  {name:"Phạm D", department:"HR"},
];

// Sử dụng biến toàn cục window.winners
console.log(window.winners); // kiểm tra danh sách người trúng giải

// Lấy danh sách người trúng từ localStorage nếu cần
window.winners = window.winners || JSON.parse(localStorage.getItem("winners")) || [];

function drawWheel() {
    const wheel = document.getElementById("wheel");
    wheel.innerHTML = ""; 

    const totalSlices = 15;
    const sliceAngle = 360 / totalSlices;

    for (let i = 0; i < totalSlices; i++) {
        const slice = document.createElement("div");
        slice.classList.add("slice");
        slice.style.transform = `rotate(${i * sliceAngle}deg)`;
        slice.style.background = i % 2 === 0 ? "#ff9800" : "#ffc107";

        const label = document.createElement("span");
        label.classList.add("label");
        label.innerText = `Giải ${i + 1}`;

        slice.appendChild(label);
        wheel.appendChild(slice);
    }
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


