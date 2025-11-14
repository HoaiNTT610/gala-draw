const during = new Audio("sounds/during_process.mp3");
during.loop = true;


const people = [
{ name: "Nguyễn Văn A", dept: "Phòng Kế Toán" },
{ name: "Trần Thị B", dept: "Phòng Nhân Sự" },
{ name: "Phạm Văn C", dept: "Kỹ Thuật" },
{ name: "Lê Thị D", dept: "Marketing" }
];


let winners = JSON.parse(localStorage.getItem("winners") || "[]");


// ===================== CANVAS WHEEL SETUP =====================
const canvas = document.getElementById("wheel-canvas");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;
let angle = 0;
let spinning = false;


function drawWheel() {
const total = people.length;
const arc = (2 * Math.PI) / total;
ctx.clearRect(0, 0, canvas.width, canvas.height);


for (let i = 0; i < total; i++) {
const start = angle + i * arc;
ctx.beginPath();
ctx.fillStyle = i % 2 === 0 ? "#ffdd57" : "#ff9a3c";
ctx.moveTo(radius, radius);
ctx.arc(radius, radius, radius, start, start + arc);
ctx.fill();


// text
ctx.save();
ctx.translate(radius, radius);
ctx.rotate(start + arc / 2);
ctx.textAlign = "right";
ctx.fillStyle = "#000";
ctx.font = "20px Arial";
ctx.fillText(people[i].name, radius - 10, 10);
ctx.restore();
}
}


drawWheel();


// ================ SMOOTH SPINNING ANIMATION ==================
let spinVelocity = 0;
let targetAngle = 0;


function animateSpin() {
if (!spinning) return;


angle += spinVelocity;
spinVelocity *= 0.985; // deceleration


drawWheel();


if (spinVelocity < 0.002) {
spinning = false;
during.pause();


// Determine winner based on final angle
const arc = (2 * Math.PI) / people.length;
let index = Math.floor(((2 * Math.PI - angle) % (2 * Math.PI)) / arc);


const available = people.filter(p => !winners.find(w => w.name === p.name));
const winner = available[Math.floor(Math.random() * available.length)];


winners.push(winner);
localStorage.setItem("winners", JSON.stringify(winners));


showWinner(winner);
return;
}


requestAnimationFrame(animateSpin);
}
};
