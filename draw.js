// draw.js

// Danh sách người tham gia (Bạn cần cập nhật danh sách này)
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

// Danh sách người chiến thắng đã chọn (để tránh chọn trùng lặp)
let winners = []; 
// Biến để theo dõi trạng thái quay
let isSpinning = false;

/**
 * Hàm chọn ngẫu nhiên một người từ danh sách và loại bỏ họ.
 * @returns {string} Tên người chiến thắng cuối cùng.
 */
function selectRandomWinner() {
    if (participants.length === 0) {
        return "HẾT NGƯỜI CHƠI";
    }

    // 1. Tạo chỉ mục (index) ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * participants.length);

    // 2. Lấy tên người chiến thắng
    const winnerName = participants[randomIndex];

    // 3. XÓA người này khỏi mảng participants để không bị chọn lại
    participants.splice(randomIndex, 1); 

    // 4. Thêm vào danh sách người thắng cuộc
    winners.push(winnerName); 

    return winnerName;
}


/**
 * Logic chính để khởi động hoặc dừng hiệu ứng quay số.
 * @param {HTMLElement} resultDisplay - Thẻ hiển thị kết quả.
 * @param {HTMLElement} spinButton - Nút bấm Quay/Dừng.
 */
function toggleSpin(resultDisplay, spinButton) {
    if (isSpinning) {
        // --- DỪNG QUAY ---
        return; // Logic dừng sẽ được xử lý trong setTimeout
    }

    if (participants.length === 0) {
        resultDisplay.textContent = "HẾT NGƯỜI CHƠI";
        alert("Đã hết người chơi trong danh sách!");
        return;
    }

    // --- BẮT ĐẦU QUAY ---
    isSpinning = true;
    spinButton.textContent = "ĐANG QUAY...";
    spinButton.disabled = true;

    // 1. Hiệu ứng quay số (Chạy ngẫu nhiên tên trong 3 giây)
    const interval = setInterval(() => {
        // Chỉ hiển thị ngẫu nhiên các tên trong danh sách còn lại
        const tempIndex = Math.floor(Math.random() * participants.length);
        // Đảm bảo không bị lỗi nếu mảng trống khi đang quay
        resultDisplay.textContent = participants[tempIndex] || "QUAY...";
    }, 100); 

    // 2. DỪNG QUAY VÀ CHỌN KẾT QUẢ CUỐI CÙNG sau 3 giây
    setTimeout(() => {
        clearInterval(interval);
        
        const finalWinner = selectRandomWinner();
        resultDisplay.textContent = finalWinner;
        
        isSpinning = false;
        spinButton.textContent = "BẮT ĐẦU QUAY";
        spinButton.disabled = false;
        
        // Thông báo kết quả
        alert(`🎉 CHÚC MỪNG: ${finalWinner} đã trúng thưởng!`);
        
        // Tùy chọn: Thêm logic lưu người thắng cuộc vào danh sách hiển thị
        // saveWinnerToDisplay(finalWinner); 
        
    }, 3000); // Quay trong 3 giây
}

// Hàm này sẽ được gọi từ prizes.js để khởi tạo nút
window.initDrawLogic = function() {
    const resultDisplay = document.getElementById('resultDisplay');
    const spinButton = document.getElementById('spinButton');

    if (spinButton) {
        spinButton.onclick = function() {
            toggleSpin(resultDisplay, spinButton);
        };
    }
};