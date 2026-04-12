let currentDate = new Date();
let selectedDay = null;
let selectedDateMonth = null;
let selectedDateYear = null;
window.selectedDateObj = null;

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekday = firstDayOfMonth.getDay();
    let startOffset = startWeekday === 0 ? 6 : startWeekday - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const monthYearSpan = document.getElementById('monthYear');
    if (monthYearSpan) monthYearSpan.innerText = `${monthNames[month]} ${year}`;

    let calendarHtml = '';
    for (let i = 0; i < startOffset; i++) {
        calendarHtml += `<div class="calendar-day empty"></div>`;
    }
    for (let d = 1; d <= daysInMonth; d++) {
        let selectedClass = '';
        if (selectedDay === d && selectedDateMonth === month && selectedDateYear === year) {
            selectedClass = 'selected';
        }
        calendarHtml += `<div class="calendar-day ${selectedClass}" data-day="${d}">${d}</div>`;
    }
    const calendarDays = document.getElementById('calendarDays');
    if (calendarDays) calendarDays.innerHTML = calendarHtml;

    document.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            const dayNum = parseInt(dayEl.dataset.day);
            selectDate(dayNum);
        });
    });
}

function selectDate(day) {
    selectedDay = day;
    selectedDateMonth = currentDate.getMonth();
    selectedDateYear = currentDate.getFullYear();
    window.selectedDateObj = new Date(selectedDateYear, selectedDateMonth, day);
    renderCalendar();

    if (typeof window.updateSessionsForDate === 'function') {
        window.updateSessionsForDate(window.selectedDateObj);
    }
}

document.getElementById('prevMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    selectedDay = null;
    selectedDateMonth = null;
    selectedDateYear = null;
    renderCalendar();
    if (typeof window.updateSessionsForDate === 'function') {
        window.updateSessionsForDate(null);
    }
});

document.getElementById('nextMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    selectedDay = null;
    selectedDateMonth = null;
    selectedDateYear = null;
    renderCalendar();
    if (typeof window.updateSessionsForDate === 'function') {
        window.updateSessionsForDate(null);
    }
});

function createMonthYearModal() {
    const existingModal = document.querySelector('.month-year-modal');
    if (existingModal) existingModal.remove();

    const monthYearSpan = document.getElementById('monthYear');
    const modal = document.createElement('div');
    modal.className = 'month-year-modal';

    const isMobile = window.innerWidth < 768;
    const rect = monthYearSpan.getBoundingClientRect();

    // Всегда добавляем в body
    document.body.appendChild(modal);

    if (isMobile) {
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '10000';
    } else {
        modal.style.position = 'fixed';
        modal.style.top = rect.bottom + 5 + 'px';
        modal.style.left = rect.left + 'px';
        modal.style.zIndex = '10000';
    }

    modal.innerHTML = `
        <div class="month-year-panel glass">
            <div class="years-row">
                <button class="prev-year-btn icon-btn">
                    <img src="media/index/влево.png" alt="Назад" width="20" height="20">
                </button>
                <span class="year-display">${currentDate.getFullYear()}</span>
                <button class="next-year-btn icon-btn">
                    <img src="media/index/вправо.png" alt="Вперёд" width="20" height="20">
                </button>
            </div>
            <div class="months-grid" id="monthsGrid"></div>
            <button class="close-modal-btn btn-primary">Отмена</button>
        </div>
    `;

    const yearSpan = modal.querySelector('.year-display');
    const monthsGrid = modal.querySelector('#monthsGrid');
    let tempYear = currentDate.getFullYear();

    function renderMonths() {
        const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        monthsGrid.innerHTML = monthNames.map((m, idx) =>
            `<button class="month-btn" data-month="${idx}">${m}</button>`
        ).join('');
        yearSpan.textContent = tempYear;
    }
    renderMonths();

    modal.querySelector('.prev-year-btn').onclick = () => { tempYear--; renderMonths(); };
    modal.querySelector('.next-year-btn').onclick = () => { tempYear++; renderMonths(); };
    modal.querySelector('.close-modal-btn').onclick = () => modal.classList.remove('active');

    modal.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-month]');
        if (btn) {
            const month = parseInt(btn.dataset.month);
            currentDate = new Date(tempYear, month, 1);
            selectedDay = null;
            selectedDateMonth = null;
            selectedDateYear = null;
            renderCalendar();
            modal.classList.remove('active');
            if (typeof window.updateSessionsForDate === 'function') {
                window.updateSessionsForDate(null);
            }
        }
    });

    function handleClickOutside(e) {
        if (!modal.contains(e.target) && e.target !== monthYearSpan && !modal.contains(e.target.parentElement)) {
            modal.classList.remove('active');
            document.removeEventListener('click', handleClickOutside);
        }
    }

    setTimeout(() => modal.classList.add('active'), 10);
    setTimeout(() => document.addEventListener('click', handleClickOutside), 20);

    modal.addEventListener('transitionend', () => {
        if (!modal.classList.contains('active')) {
            modal.remove();
            document.removeEventListener('click', handleClickOutside);
        }
    });

    return modal;
}

// Обработчик клика на заголовок месяца/года
const monthYearSpan = document.getElementById('monthYear');
if (monthYearSpan) {
    monthYearSpan.style.cursor = 'pointer';
    monthYearSpan.addEventListener('click', () => {
        const modal = createMonthYearModal();
        setTimeout(() => modal.classList.add('active'), 10);
    });
}
// Инициализация
renderCalendar();
window.selectDate = selectDate;