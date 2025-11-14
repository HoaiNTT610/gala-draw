// draw.js - LOGIC VÒNG QUAY MAY MẮN VÀ KIỂM SOÁT RESET

// Danh sách người tham gia gốc (Cần cập nhật)
const participants = [
    "Nguyễn Văn A", 
    "Trần Thị B", 
    "Lê Văn C", 
    "Phạm Thị D", 
    "Hoàng Văn E",
    "Phạm Văn F",
    "Nguyễn Thị G",
    "Trần Văn H"
    // Thêm các tên khác vào đây
];

let winners = []; 
let isSpinning = false;
let luckyWheelElement = null; // Thẻ DIV có ID 'luckyWheel'

// --- A. LOGIC LƯU TRỮ VÀ RESET ---

function loadWinners() {
    const savedWinners = localStorage.getItem('galaDrawWinners');
    if (savedWinners) {
        try {
            winners = JSON.parse(savedWinners);
        } catch (e) {
            winners = []; 
        }
    } else {
        winners = [];
    }
}

function saveWinners() {
    localStorage.setItem('galaDrawWinners', JSON.stringify(winners));
}

function getAvailableParticipants() {
    const winnerNames = new Set(winners.map(w => w.name)); 
    return participants.filter(p => !winnerNames.has(p));
}

function askForReset() {
    loadWinners(); 

    if (winners.length > 0) {
        const confirmReset = confirm(
            `Đã có ${winners.length} người trúng thưởng được lưu trữ. Bạn có muốn ĐẶT LẠI (RESET) danh sách trúng thưởng không?`
        );

        if (confirmReset) {
            winners = [];
            localStorage.removeItem('galaDrawWinners');
            alert("Danh sách trúng thưởng đã được ĐẶT LẠI thành công!");
        } else {
            alert(`Tiếp tục quay thưởng với ${getAvailableParticipants().length} người chơi đủ điều kiện.`);
        }
    }
}

// --- B. LOGIC VÒNG QUAY ---

/**
 * Xây dựng các phân đoạn (segments) trên vòng quay dựa trên số lượng người chơi.
 */
function buildWheel(availableParticipants) {
    luckyWheelElement.innerHTML = '';
    const numSegments = availableParticipants.length;
    if (numSegments === 0) return;

    const degreePerSegment = 360 / numSegments; 

    availableParticipants.forEach((name, index) => {
        const segment = document.createElement('div');
        segment.className = 'wheel-segment';
        
        const rotation = index * degreePerSegment; 
        
        // CSS để xoay phân đoạn hình tam giác (wedge)
        segment.style.transform = `rotate(${rotation}deg)`;
        
        // Container cho tên để tên không bị nghiêng
        const nameContainer = document.createElement('div');
        
        // Xoay ngược tên lại để nó thẳng đứng
        nameContainer.style.transform = `rotate(${90 + rotation + (degreePerSegment / 2)}deg)`; 
        nameContainer.textContent = name;
        
        segment.appendChild(nameContainer);
        luckyWheelElement.appendChild(segment);
    });
}

/**
 * Chọn người thắng ngẫu nhiên và tính toán góc xoay cần thiết để dừng.
 */
function selectRandomWinnerAndAngle() {
    const availableParticipants = getAvailableParticipants();
    if (availableParticipants.length === 0) {
        return { index: -1, angle: 0, name: "HẾT NGƯỜI CHƠI" };
    }

    const numSegments = availableParticipants.length;
    const randomIndex = Math.floor(Math.random() * numSegments);
    const winnerName = availableParticipants[randomIndex];
    const degreePerSegment = 360 / numSegments;
    
    // Góc tâm của phân đoạn người chiến thắng
    const winnerCenterAngle = randomIndex * degreePerSegment + (degreePerSegment / 2);

    // Thêm vòng quay để đảm bảo quay nhiều vòng (ví dụ: 10-15 vòng)
    const extraTurns = Math.floor(Math.random() * 5) + 10; 
    
    // Góc cần xoay: (Số vòng * 360) + (Góc bù để người thắng dừng dưới kim chỉ 0 độ)
    const totalAngle = (extraTurns * 360) + (360 - winnerCenterAngle);
    
    return { 
        index: randomIndex, 
        angle: totalAngle, 
        name: winnerName 
    };
}


/**
 * Logic chính để khởi động hiệu ứng quay số và dừng tại người chiến thắng.
 */
function toggleSpin(wheelContainer, spinButton) {
    const availableParticipants = getAvailableParticipants();
    
    if (isSpinning || availableParticipants.length === 0) {
        if (availableParticipants.length === 0) alert("Hết người chơi!");
        return;
    }

    const winnerData = selectRandomWinnerAndAngle();
    
    // 1. CHUẨN BỊ
    isSpinning = true;
    spinButton.textContent = "ĐANG QUAY...";
    spinButton.disabled = true;
    
    // Xây dựng lại vòng quay để đảm bảo tên người thắng được đưa vào cấu trúc
    buildWheel(availableParticipants); 

    // 2. KÍCH HOẠT QUAY
    luckyWheelElement.style.transition = 'none';
    luckyWheelElement.style.transform = 'rotate(0deg)'; 

    // Chờ 50ms để CSS reset transform trước khi áp dụng góc quay cuối cùng
    setTimeout(() => {
        const totalSpinTime = 25000; // 25 giây
        
        // Áp dụng transition dừng mượt (cubic-bezier)
        luckyWheelElement.style.transition = `transform ${totalSpinTime / 1000}s cubic-bezier(0.1, 0.7, 0.9, 1)`; 
        
        // Xoay vòng quay đến góc dừng
        luckyWheelElement.style.transform = `rotate(${winnerData.angle}deg)`;
        
        // 3. LOGIC KẾT THÚC (Sau 25 giây)
        setTimeout(() => {
            
            // Lưu người chiến thắng
            winners.push({ name: winnerData.name, time: new Date().toISOString() }); 
            saveWinners(); 
            
            isSpinning = false;
            spinButton.textContent = "BẮT ĐẦU QUAY";
            spinButton.disabled = false;
            
            alert(`🎉 CHÚC MỪNG: ${winnerData.name} đã trúng thưởng!`);

        }, totalSpinTime); 

    }, 50); 
}

// --- C. HÀM KHỞI TẠO CHUNG ---

window.initDrawLogic = function() {
    // 1. HỎI RESET KHI MỞ APP 
    askForReset(); 
    
    // 2. LOGIC NÚT QUAY
    const wheelContainer = document.getElementById('wheelContainer');
    const spinButton = document.getElementById('spinButton');
    luckyWheelElement = document.getElementById('luckyWheel'); 

    if (!luckyWheelElement) {
        console.error("Lỗi: Không tìm thấy phần tử #luckyWheel.");
        return; 
    }

    // Xây dựng vòng quay lần đầu khi app khởi động
    buildWheel(getAvailableParticipants());

    if (spinButton) {
        spinButton.onclick = function() {
            toggleSpin(wheelContainer, spinButton);
        };
    }
};
