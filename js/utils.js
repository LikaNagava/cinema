function getRootPath() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
}

function fixPath(path) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('//')) return path;
    return getRootPath() + path;
}

function showToast(message, isSuccess = true, linkText = null, linkHref = null) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-notification ${isSuccess ? 'success' : 'error'}`;
    toast.innerHTML = `
        <div class="toast-title">${isSuccess ? '✅ Успешно' : '❌ Ошибка'}</div>
        <div class="toast-message">${message}</div>
        ${linkText && linkHref ? `<a href="${linkHref}" target="_blank" class="toast-link">${linkText}</a>` : ''}
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function generateHallLayout(rows = 7, seatsPerRow = 14) {
    const layout = [];
    for (let row = 1; row <= rows; row++) {
        const seats = [];
        for (let seat = 1; seat <= seatsPerRow; seat++) {
            const isTaken = Math.random() < 0.2;
            seats.push({
                row: row,
                seat: seat,
                status: isTaken ? 'taken' : 'free'
            });
        }
        layout.push(seats);
    }
    return layout;
}