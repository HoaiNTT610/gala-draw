// prizes.js

const prizeData = [
    { name: "Giải Đặc Biệt", quantity: "01", image: "/gala-draw/images/giai_dac_biet.jpg", isSpecial: true },
    { name: "Giải Nhất", quantity: "03", image: "/gala-draw/images/giai_nhat.jpg", isSpecial: false },
    { name: "Giải Nhì", quantity: "10", image: "/gala-draw/images/giai_nhi.jpg", isSpecial: false },
    { name: "Giải Ba", quantity: "25", image: "/gala-draw/images/giai_ba.jpg", isSpecial: false }
];


// 2. LOGIC HIỂN THỊ VÀ CHỨC NĂNG NÚT QUAY
document.addEventListener('DOMContentLoaded', () => {
    // Lấy container cho Giải Đặc Biệt và các giải còn lại
    const specialContainer = document.getElementById('special-prize-output');
    const regularContainer = document.getElementById('regular-prizes-output');
    
    if (!specialContainer || !regularContainer) return; 

    // --- A. LOGIC HIỂN THỊ DANH SÁCH ---
    prizeData.forEach(prize => {
        const card = document.createElement('div');
        card.classList.add('prize-card');
        
        // Cấu trúc HTML (Hình ảnh trên, Tên & Số lượng dưới)
        card.innerHTML = `
            <img src="${prize.image}" alt="${prize.name}" class="prize-image" onerror="this.onerror=null; this.src='https://via.placeholder.com/350x240?text=Placeholder'">
            
            <div class="prize-info">
                <span class="prize-name">${prize.name}</span> 
                <span class="info-value">${prize.quantity}</span>
            </div>
        `;
        
        // Phân loại và chèn
        if (prize.isSpecial) {
            card.classList.add('special');
            specialContainer.appendChild(card);
        } else {
            regularContainer.appendChild(card);
        }
    });

    // --- B. LOGIC NÚT QUAY VÀ PHÁT NHẠC ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const rollMusic = document.getElementById('rollMusic');
    const floatingBackButton = document.getElementById('floatingBackButton');
    const musicToggleButton = document.getElementById('musicToggleButton');
    
    // Hàm dừng nhạc nền và cập nhật nút chuyển đổi
    function pauseBackgroundMusic() {
        if (!backgroundMusic.paused) {
            backgroundMusic.pause();
            musicToggleButton.textContent = 'Phát nhạc';
            musicToggleButton.title = 'Phát nhạc';
        }
    }

    // 1. Xử lý nút QUAY
    if (floatingBackButton) {
        floatingBackButton.onclick = function() {
            console.log('Nút Quay được nhấp. Chuyển nhạc!');
            
            // a. Dừng nhạc sự kiện (open_song)
            pauseBackgroundMusic();
            
            // b. Đặt nhạc quay thưởng về đầu và phát (roll_song)
            rollMusic.currentTime = 0; // Đặt về đầu
            rollMusic.play().catch(e => console.error("Không thể phát nhạc quay thưởng:", e));
            
            // Thêm hành động quay số tại đây
            alert('Đã chuyển sang nhạc quay thưởng!');
        };
    }

    // 2. Xử lý nút PHÁT NHẠC / DỪNG PHÁT (Chỉ điều khiển backgroundMusic)
    if (musicToggleButton && backgroundMusic) {
        musicToggleButton.onclick = function() {
            if (backgroundMusic.paused) {
                // Nếu đang dừng -> Phát nhạc sự kiện
                const playPromise = backgroundMusic.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        musicToggleButton.textContent = 'Dừng phát';
                        musicToggleButton.title = 'Dừng phát nhạc';
                    }).catch(error => {
                        alert("Không thể phát nhạc. Vui lòng kiểm tra file nhạc.");
                    });
                }
            } else {
                // Nếu đang chạy -> Dừng nhạc sự kiện
                pauseBackgroundMusic();
            }
        };
    }
});


