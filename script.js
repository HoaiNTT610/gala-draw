// --- CẤU HÌNH GIẢI THƯỞNG ---
const PRIZE_STRUCTURE = [
    { name: "Giải Đặc Biệt", image: "images/giai_dac_biet.jpg" },
    { name: "Giải Nhất", image: "images/giai_nhat.jpg" },
    { name: "Giải Nhì", image: "images/giai_nhi.jpg" },
    { name: "Giải Ba", image: "images/giai_ba.jpg" },
    /*{ name: "Giải Khuyến Khích", image: "images/giai_khuyen_khich.png" }*/
];
// --- LOCAL STORAGE KEY ---
const WINNERS_STORAGE_KEY = "lucky_draw_winners";
// --- DANH SÁCH NHÂN VIÊN (CHỈNH SỬA Ở ĐÂY) ---
const INITIAL_PARTICIPANT_LIST = [
    // Định dạng: { ten: "Tên nhân viên", bo_phan: "Bộ phận" }
    { ten: "Nguyễn Văn A", bo_phan: "Kỹ Thuật" },
    { ten: "Trần Thị B", bo_phan: "Marketing" },
    { ten: "Lê Văn C", bo_phan: "Kinh Doanh" },
    { ten: "Phạm Thu D", bo_phan: "Hành Chính" } 
];
// -----------------------------

const SPIN_DURATION_MS = 20000; // 20 giây

let allParticipants = []; 
let availableParticipants = []; 
let winnersList = []; 

let currentPrizeIndex = 0; // Dùng để chọn tên giải ngẫu nhiên/theo thứ tự khi công bố

let intervalId = null;
let timeoutId = null;
let isSpinning = false;

// DOM Elements
const display = document.getElementById('lottery-display');
const info = document.getElementById('result-info');

const prizeList = document.getElementById('prize-list');
const winnerModal = document.getElementById('winner-modal');
const winnerName = document.getElementById('winner-name');
const winnerDept = document.getElementById('winner-dept');
const winnerPrize = document.getElementById('winner-prize');
const lotteryPanel = document.getElementById('lottery-panel');
const prizePanel = document.getElementById('prize-panel');
const toggleBtn = document.getElementById('toggle-spin-btn');

const bgMusic = document.getElementById('bg-music');
const winSound = document.getElementById('win-sound');

const INITIAL_VOLUME = 0.2; // Âm lượng khởi đầu (rất nhỏ)
const MAX_VOLUME = 0.6;     // Âm lượng tối đa (lớn)
const FADE_TIME_MS = 3000;  // Thời gian chuyển đổi âm lượng (3 giây)

let currentVolume = INITIAL_VOLUME;
let fadeInterval = null;

// --- Khởi tạo và Tải Dữ liệu ---

function initializeApp() {
    // 1. Tải danh sách người đã trúng từ Local Storage
    loadWinnersFromStorage(); 
    
    // 2. HỎI XÁC NHẬN RESET
    if (winnersList.length > 0) {
        const resetConfirmed = confirm("Chương trình đang có dữ liệu quay số từ lần trước. Bạn có muốn RESET lại từ đầu (coi như chưa ai trúng) không?");
        if (resetConfirmed) {
            resetWinners(false); 
            currentPrizeIndex = 0; 
        }
    }
    
    // 3. Tải danh sách tất cả nhân viên từ code (hằng số INITIAL_PARTICIPANT_LIST)
    loadParticipantsFromCode();
    
    // 4. Render giao diện giải thưởng
    renderPrizeStructure();
	
    // 5. Cập nhật trạng thái ban đầu
    updateLotteryDisplay();
}

// Tải danh sách người đã trúng từ Local Storage
function loadWinnersFromStorage() {
    const storedWinners = localStorage.getItem(WINNERS_STORAGE_KEY);
    if (storedWinners) {
        try {
            winnersList = JSON.parse(storedWinners);
        } catch (e) {
            console.error("Lỗi khi đọc Local Storage:", e);
            winnersList = [];
        }
    } else {
        winnersList = [];
    }
}

// Lưu người trúng vào Local Storage
function saveWinnerToStorage(winner) {
    const winnerKey = `${winner.ten}|${winner.bo_phan}`;
    if (!winnersList.includes(winnerKey)) {
        winnersList.push(winnerKey);
        localStorage.setItem(WINNERS_STORAGE_KEY, JSON.stringify(winnersList));
    }
}

// Reset Local Storage 
window.resetWinners = function(askConfirm = true) {
    let confirmed = true;
    if (askConfirm) {
        confirmed = confirm("Bạn có chắc chắn muốn XÓA DANH SÁCH NGƯỜI ĐÃ TRÚNG (RESET) không? Thao tác này không thể hoàn tác.");
    }
    
    if (confirmed) {
        localStorage.removeItem(WINNERS_STORAGE_KEY);
        winnersList = [];
        currentPrizeIndex = 0;
        loadParticipantsFromCode();
        renderPrizeStructure(); 
        updateLotteryDisplay(); 
        if (askConfirm) {
            alert("Đã reset thành công! Tất cả người tham gia đều hợp lệ.");
        }
    }
}

// Tải danh sách từ code và Lọc
function loadParticipantsFromCode() {
    allParticipants = INITIAL_PARTICIPANT_LIST;
    
    // LỌC DANH SÁCH: Loại bỏ người đã trúng (từ Local Storage)
    availableParticipants = allParticipants.filter(p => {
        const pKey = `${p.ten}|${p.bo_phan}`;
        return !winnersList.includes(pKey);
    });

    toggleBtn.disabled = availableParticipants.length === 0;
}


// --- Logic Chuyển đổi Màn hình VÀ BẮT ĐẦU QUAY ---

window.toggleSpinScreen = function() {
    if (lotteryPanel.style.display === 'flex') {
        // Quay lại màn hình giải thưởng
        lotteryPanel.style.display = 'none';
        prizePanel.style.display = 'flex';
        toggleBtn.textContent = 'QUAY';
        toggleBtn.classList.remove('back-to-prize');
        renderPrizeStructure();
    } else {
        // Chuyển sang màn hình quay số
        if (availableParticipants.length === 0) {
            alert("Danh sách hợp lệ đã hết. Vui lòng RESET để quay lại.");
            return;
        }

        prizePanel.style.display = 'none';
        lotteryPanel.style.display = 'flex';
        toggleBtn.textContent = 'XEM GIẢI';
        toggleBtn.classList.add('back-to-prize');
        
        // BẮT ĐẦU QUAY SỐ NGAY LẬP TỨC
        startLottery();
    }
}


// --- Logic Quay Số ---

function updateLotteryDisplay() {
    // 1. Kiểm tra kết thúc chương trình
    if (availableParticipants.length === 0 && winnersList.length === allParticipants.length) {
        display.textContent = "🎉 CHƯƠNG TRÌNH KẾT THÚC! 🎉";
        info.textContent = "Tất cả người tham gia đã trúng giải. Cảm ơn!";
        toggleBtn.disabled = true;
        return;
    }
    
    // 2. Cập nhật thông tin chung trên màn hình quay (chỉ hiển thị khi Sẵn sàng quay)
    if (!isSpinning) {
        display.textContent = `Sẵn sàng Quay`; 
        info.textContent = `Sẵn sàng cho lần quay tiếp theo. Đã có ${winnersList.length} người trúng giải.`; 
    }
    
    // 3. Cập nhật trạng thái nút và số lượng người còn lại
    toggleBtn.disabled = availableParticipants.length === 0;
}

// BẮT ĐẦU QUAY SỐ
function startLottery() {
    if (isSpinning) return;
    if (availableParticipants.length === 0) {
        alert("Danh sách hợp lệ đã hết. Vui lòng RESET để quay lại.");
        toggleSpinScreen();
        return;
    }

    isSpinning = true;
    toggleBtn.disabled = true;
    
    // Thêm class 'spinning' để kích hoạt hiệu ứng
    display.classList.add('spinning');
	
	// 🔊 Bắt đầu nhạc nền với âm lượng tăng dần
    fadeInMusic(); // <--- THÊM DÒNG NÀY
	
    let timeRemaining = SPIN_DURATION_MS / 1000;
    
    const timerInterval = setInterval(() => {
        timeRemaining--; 
        info.textContent = `Đang quay... Dừng sau ${timeRemaining}s`; 
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);

    intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * availableParticipants.length);
        display.textContent = availableParticipants[randomIndex].ten;
    }, 50); // Giảm thời gian để quay nhanh và mượt hơn

    timeoutId = setTimeout(() => {
        clearInterval(timerInterval);
        stopLottery();
    }, SPIN_DURATION_MS);
}

// DỪNG QUAY SỐ và công bố kết quả
function stopLottery() {
    if (!isSpinning) return;
	
	// 🔊 Giảm âm lượng nhạc nền ngay lập tức để chuyển sang công bố
    fadeOutMusic();
	
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    isSpinning = false;
    
	display.classList.remove('spinning');
	
    const winnerIndex = Math.floor(Math.random() * availableParticipants.length);
    const winner = availableParticipants[winnerIndex];
    
    // Chọn Tên Giải thưởng lặp lại cho pop-up
    const prizeCount = winnersList.length + 1; 
    const prizeIndex = (prizeCount - 1) % PRIZE_STRUCTURE.length; 
    const winningPrizeName = PRIZE_STRUCTURE[prizeIndex].name;


    // 1. LƯU VÀO LOCAL STORAGE
    saveWinnerToStorage(winner);
    
    // 2. HIỂN THỊ KẾT QUẢ CUỐI CÙNG TRÊN MÀN HÌNH CHÍNH (QUAN TRỌNG)
    display.textContent = winner.ten; 
    info.textContent = `CHÚC MỪNG: ${winner.ten} đã trúng giải ${winningPrizeName}!`; // Hiển thị rõ ràng

    // 3. LOẠI BỎ NGƯỜI TRÚNG
    availableParticipants.splice(winnerIndex, 1);
    
    // 4. Hiển thị thông báo Pop-up trúng thưởng
    showWinnerModal(winner, winningPrizeName);
    
    // 5. Cập nhật trạng thái nút/số người còn lại (Không cập nhật display.textContent nữa)
    toggleBtn.disabled = availableParticipants.length === 0;
    
	// 🔊 Phát âm thanh chúc mừng khi công bố
    bgMusic.pause(); // Tạm dừng nhạc nền
    bgMusic.currentTime = 0;
    winSound.play().catch(e => console.log("Lỗi phát âm thanh chúc mừng:", e)); 
}

// --- Hiển thị Giao diện Giải thưởng ---

function renderPrizeStructure() {
    prizeList.innerHTML = '';
    PRIZE_STRUCTURE.forEach((prize) => {
        const item = document.createElement('div');
        item.className = 'prize-item';
        
        item.innerHTML = `
            <img src="${prize.image}" alt="${prize.name}">
            <div class="prize-name">${prize.name}</div>
        `;

        prizeList.appendChild(item);
    });
}


// Hàm hiển thị Pop-up trúng thưởng
function showWinnerModal(winner, prizeName) {
	
    document.getElementById('winner-prize').textContent = `🎉 CHÚC MỪNG - ${prizeName}! 🎉`; // Gán tên giải thưởng vào thẻ h2 trong modal
    document.getElementById('winner-name').textContent = winner.ten;
    document.getElementById('winner-dept').textContent = winner.bo_phan;
    
    winnerModal.style.display = 'flex';
}

// --- HÀM MỚI: QUAY TIẾP (Liên tục) ---
window.continueSpin = function() {
    winnerModal.style.display = 'none';
    
    if (availableParticipants.length > 0) {
        startLottery(); 
    } else {
        // Nếu không còn người, thông báo kết thúc
        alert("Danh sách hợp lệ đã hết. Vui lòng RESET để quay lại.");
        toggleSpinScreen(); 
    }
}

// --- HÀM MỚI: ĐÓNG (Quay về màn hình giải thưởng) ---
window.closeAndBackToPrize = function() {
    winnerModal.style.display = 'none';
    // Chuyển từ màn hình quay -> màn hình giải
    toggleSpinScreen(); 
}

// Tăng âm lượng dần
function fadeInMusic() {
    // Đảm bảo nhạc bắt đầu từ âm lượng nhỏ nhất
    bgMusic.volume = INITIAL_VOLUME;
    bgMusic.play().catch(e => console.log("Lỗi phát nhạc nền:", e)); // Bắt lỗi autoplay
    
    // Xóa interval cũ nếu có
    if (fadeInterval) clearInterval(fadeInterval);
    
    const step = (MAX_VOLUME - INITIAL_VOLUME) / (FADE_TIME_MS / 50); // Tăng 50ms một lần
    
    fadeInterval = setInterval(() => {
        currentVolume += step;
        if (currentVolume >= MAX_VOLUME) {
            currentVolume = MAX_VOLUME;
            clearInterval(fadeInterval);
        }
        bgMusic.volume = currentVolume;
    }, 50);
}

// Giảm âm lượng dần
function fadeOutMusic() {
    if (fadeInterval) clearInterval(fadeInterval);
    
    const step = (MAX_VOLUME - INITIAL_VOLUME) / (FADE_TIME_MS / 50);
    
    fadeInterval = setInterval(() => {
        currentVolume -= step;
        if (currentVolume <= INITIAL_VOLUME) {
            currentVolume = INITIAL_VOLUME;
            clearInterval(fadeInterval);
        }
        bgMusic.volume = currentVolume;
    }, 50);
}