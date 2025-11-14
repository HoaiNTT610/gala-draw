// draw.js - LOGIC QUAY SỐ VÀ CHỌN NGẪU NHIÊN

// Danh sách người tham gia (BẠN PHẢI CẬP NHẬT DANH SÁCH NÀY)
const participants = [
    "Nguyễn Văn A", 
    "Trần Thị B", 
    "Lê Văn C", 
    "Phạm Thị D", 
    "Hoàng Văn E",
    "Phạm Văn F",
    "Nguyễn Thị G",
    "Trần Văn H"
    // THÊM TẤT CẢ TÊN NGƯỜI THAM GIA VÀO ĐÂY
];

let winners = []; 
let isSpinning = false;

/**
 * Hàm chọn ngẫu nhiên một người từ danh sách và loại bỏ họ.
 * @returns {string} Tên người chiến thắng cuối cùng.
 */
function selectRandomWinner() {
    if (participants.length === 0) {
        return "HẾT NGƯỜI CHƠI";
    }

    const randomIndex = Math.floor(Math.random() * participants.length);
    const winnerName = participants[randomIndex];

    // XÓA người này khỏi mảng participants để không bị chọn lại
    participants.splice(randomIndex, 1); 
    winners.push(winnerName); 

    return winnerName;
}


/**
 * Logic chính để khởi động hiệu ứng quay số.
 */
function toggleSpin(resultDisplay, spinButton) {
    if (isSpinning || participants.length === 0) {
        if (participants.length === 0) resultDisplay.textContent = "HẾT NGƯỜI CHƠI";
        return; 
    }

    // --- BẮT ĐẦU QUAY ---
    isSpinning = true;
    spinButton.textContent = "ĐANG QUAY...";
    spinButton.disabled = true;

    // 1. Hiệu ứng quay số (Chạy ngẫu nhiên tên trong 3 giây)
    let rotation = 0;
    const interval = setInterval(() => {
        const tempIndex = Math.floor(Math.random() * participants.length);
        // Hiển thị tên ngẫu nhiên
        resultDisplay.textContent = participants[tempIndex] || "QUAY...";
        
        // HIỆU ỨNG XOAY 3D VÀ RUNG NHẸ
        rotation += 10;
        const rotateX = Math.sin(rotation * (Math.PI / 180)) * 5; 
        const rotateY = Math.cos(rotation * (Math.PI / 180)) * 5; 
        resultDisplay.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        
    }, 100); 

    // 2. DỪNG QUAY VÀ CHỌN KẾT QUẢ CUỐI CÙNG sau 3 giây
    setTimeout(() => {
        clearInterval(interval);
        
        // Đưa hộp hiển thị về trạng thái tĩnh
        resultDisplay.style.transform = 'none'; 
        
        const finalWinner = selectRandomWinner();
        resultDisplay.textContent = finalWinner;
        
        isSpinning = false;
        spinButton.textContent = "BẮT ĐẦU QUAY";
        spinButton.disabled = false;
        
        alert(`🎉 CHÚC MỪNG: ${finalWinner} đã trúng thưởng!`);
        
    }, 3000); 
}

// Hàm khởi tạo logic nút Bắt đầu Quay
window.initDrawLogic = function() {
    const resultDisplay = document.getElementById('resultDisplay');
    const spinButton = document.getElementById('spinButton');

    if (spinButton) {
        spinButton.onclick = function() {
            toggleSpin(resultDisplay, spinButton);
        };
    }
};
