// prizes.js - LOGIC HIỂN THỊ GIẢI THƯỞNG VÀ ĐIỀU KHIỂN CHUYỂN ĐỔI MÀN HÌNH

// Dữ liệu giải thưởng (Cần được cập nhật với thông tin chính xác của bạn)
const prizeData = [
    { 
        name: "Giải Đặc Biệt", 
        description: "Nồi chiên không dầu Daewoo",
        quantity: "01", 
        image: "images/airfryer.jpg", 
        isSpecial: true,
        specs: "SỬ DỤNG 5L, 1350W - CÀI ĐẶT TỐI ĐA 200°C, 60 PHÚT" // Cập nhật specs để khắc phục lỗi undefined
    },
    { 
        name: "Giải Nhất", 
        description: "Nồi cơm điện tử Philips",
        quantity: "03", 
        image: "images/ricecooker.jpg", 
        isSpecial: false,
        specs: "Dung tích 1.8L, Công suất 700W"
    },
    { 
        name: "Giải Nhì", 
        description: "Máy xay sinh tố đa năng",
        quantity: "05", 
        image: "images/blender.jpg", 
        isSpecial: false,
        specs: "Công suất 350W, Cối thủy tinh 1.5L"
    },
    // Thêm các giải thưởng khác vào đây
];

// Hàm tạo thẻ giải thưởng (Card)
function createPrizeCard(prize) {
    const card = document.createElement('div');
    card.className = prize.isSpecial ? 'prize-card special-prize' : 'prize-card';

    // Đảm bảo sử dụng thuộc tính 'specs' hoặc 'description'
    const specsHtml = prize.specs ? `<p class="specs">${prize.specs}</p>` : '';

    card.innerHTML = `
        <img src="${prize.image}" alt="${prize.name}">
        <div class="prize-info">
            ${specsHtml}
            <h3>${prize.name}</h3>
            <p class="quantity">Số lượng: <strong>${prize.quantity}</strong></p>
        </div>
        <div class="${prize.isSpecial ? 'special-label' : 'regular-label'}">
            ${prize.isSpecial ? 'Giải Đặc Biệt' : 'Giải'}
            <span class="quantity-number">${prize.quantity}</span>
        </div>
    `;
    return card;
}

// Hàm render tất cả giải thưởng ra màn hình
function renderPrizes() {
    const specialOutput = document.getElementById('special-prize-output');
    const regularOutput = document.getElementById('regular-prizes-output');
    
    specialOutput.innerHTML = '';
    regularOutput.innerHTML = '';

    prizeData.forEach(prize => {
        const card = createPrizeCard(prize);
        if (prize.isSpecial) {
            specialOutput.appendChild(card);
        } else {
            regularOutput.appendChild(card);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // RENDER GIẢI THƯỞNG
    renderPrizes();

    // KHAI BÁO BIẾN CHO CÁC NÚT VÀ AUDIO (Đảm bảo CHỈ KHAI BÁO MỘT LẦN!)
    const backgroundMusic = document.getElementById('backgroundMusic');
    const rollMusic = document.getElementById('rollMusic');
    const floatingBackButton = document.getElementById('floatingBackButton');
    const musicToggleButton = document.getElementById('musicToggleButton');
    const bodyElement = document.body;

    let isMusicPlaying = false; // Trạng thái nhạc nền

    // --- LOGIC AUDIO ---
    function toggleMusic() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicToggleButton.textContent = 'Phát nhạc';
        } else {
            backgroundMusic.play().catch(error => {
                console.log("Không thể tự động phát nhạc. Vui lòng tương tác với trang.");
            });
            musicToggleButton.textContent = 'Dừng nhạc';
        }
        isMusicPlaying = !isMusicPlaying;
    }
    
    if (musicToggleButton) {
        musicToggleButton.onclick = toggleMusic;
    }

    // --- LOGIC CHUYỂN ĐỔI MÀN HÌNH QUAY THƯỞNG (Quan trọng) ---
    if (floatingBackButton) {
        floatingBackButton.onclick = function() {
            // 1. CHUYỂN ĐỔI GIAO DIỆN
            bodyElement.classList.toggle('drawing-active'); 
            
            // 2. XỬ LÝ NHẠC
            if (bodyElement.classList.contains('drawing-active')) {
                // Đã chuyển sang màn hình quay thưởng
                console.log("Chuyển đổi sang giao diện quay thưởng!");
                backgroundMusic.pause();
                rollMusic.play().catch(error => console.log("Không thể phát nhạc quay thưởng."));
                
                // 3. KHỞI TẠO LOGIC QUAY SỐ (TỪ draw.js)
                if (window.initDrawLogic) {
                    window.initDrawLogic();
                }

            } else {
                // Quay lại màn hình giải thưởng
                rollMusic.pause();
                rollMusic.currentTime = 0;
                // Nếu người dùng đã bật nhạc nền, phát lại
                if (isMusicPlaying) {
                     backgroundMusic.play().catch(error => console.log("Không thể phát nhạc nền."));
                }
            }
        };
    }
    
    // Nếu hàm initDrawLogic đã được khai báo, gọi nó (chủ yếu để chạy askForReset())
    if (bodyElement.classList.contains('drawing-active') && window.initDrawLogic) {
        window.initDrawLogic();
    }
});
