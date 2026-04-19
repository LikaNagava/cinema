let currentCinema = null;

const cinemaTabsContainer = document.getElementById('cinemaTabs');
const sessionsContainer = document.getElementById('sessionsListHome');

function getCurrentCity() {
    return localStorage.getItem('selectedCity') || window._currentCity || 'Москва';
}

function getSavedCinemaForCity(city) {
    return localStorage.getItem(`selectedCinema_${city}`);
}
function saveSelectedCinema(city, cinema) {
    if (cinema) localStorage.setItem(`selectedCinema_${city}`, cinema);
}

function renderCinemaTabs() {
    const currentCityName = getCurrentCity();
    const cinemas = cinemasByCity[currentCityName] || [];
    if (cinemas.length === 0) {
        cinemaTabsContainer.innerHTML = '<div class="placeholder">Нет кинотеатров в этом городе</div>';
        sessionsContainer.innerHTML = '<p class="placeholder">Нет доступных сеансов</p>';
        return;
    }

    const savedCinema = getSavedCinemaForCity(currentCityName);
    if (savedCinema && cinemas.includes(savedCinema)) {
        currentCinema = savedCinema;
    } else if (!currentCinema || !cinemas.includes(currentCinema)) {
        currentCinema = cinemas[0];
    }

    cinemaTabsContainer.innerHTML = cinemas.map(cinema => `
        <div class="cinema-tab ${currentCinema === cinema ? 'active' : ''}" data-cinema="${cinema}">${cinema}</div>
    `).join('');

    document.querySelectorAll('.cinema-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentCinema = tab.dataset.cinema;
            saveSelectedCinema(getCurrentCity(), currentCinema);
            renderCinemaTabs();
            if (window.selectedDateObj) {
                updateSessionsForDate(window.selectedDateObj);
            } else {
                sessionsContainer.innerHTML = '<p class="placeholder">Выберите дату</p>';
            }
        });
    });
}

window.updateCinemasByCity = function (city) {
    const saved = getSavedCinemaForCity(city);
    const cinemas = cinemasByCity[city] || [];
    if (saved && cinemas.includes(saved)) {
        currentCinema = saved;
    } else if (cinemas.length) {
        currentCinema = cinemas[0];
    } else {
        currentCinema = null;
    }
    renderCinemaTabs();
    if (window.selectedDateObj) {
        updateSessionsForDate(window.selectedDateObj);
    } else {
        sessionsContainer.innerHTML = '<p class="placeholder">Выберите дату</p>';
    }
};

function isSessionAvailable(session, dateObj) {
    if (!dateObj) return false;
    const now = new Date();
    const sessionDate = new Date(dateObj);
    const [hours, minutes] = session.time.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);
    return sessionDate > now;
}

function updateSessionsForDate(dateObj) {
    if (!dateObj) {
        if (sessionsContainer) sessionsContainer.innerHTML = '<p class="placeholder">Выберите дату</p>';
        return;
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    if (!currentCinema) {
        if (sessionsContainer) sessionsContainer.innerHTML = '<p class="placeholder">Выберите кинотеатр</p>';
        return;
    }

    const sessions = (sessionsMock[currentCinema] && sessionsMock[currentCinema][dateStr]) || [];
    if (sessions.length === 0) {
        if (sessionsContainer) sessionsContainer.innerHTML = '<p class="placeholder">Нет сеансов на эту дату</p>';
        return;
    }
    let html = '';
    sessions.forEach(s => {
        const available = isSessionAvailable(s, dateObj);
        html += `
        <div class="session-item">
            <span class="session-time">${s.time}</span>
            <span class="session-movie">${s.movieTitle}</span>
            <span class="session-price">${s.price} ₽</span>
            <button class="btn-buy" data-session='${JSON.stringify(s)}' ${!available ? 'disabled' : ''}>Купить билет</button>
        </div>
    `;
    });
    if (sessionsContainer) sessionsContainer.innerHTML = html;
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', () => {
            const session = JSON.parse(btn.dataset.session);
            openTicketModal(session);
        });
    });
}

document.addEventListener('click', function (e) {
    const star = e.target.closest('#ratingStars span');
    if (!star) return;
    const stars = document.querySelectorAll('#ratingStars span');
    const value = star.dataset.value;
    stars.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < value; i++) {
        stars[i].classList.add('active');
    }
    showToast('Спасибо за оценку!', true);
});

document.addEventListener('DOMContentLoaded', () => {
    const activeCity = getCurrentCity();
    window._currentCity = activeCity;

    if (document.getElementById('cinemaTabs')) {
        renderCinemaTabs();
        if (typeof window.updateCinemasByCity === 'function') {
            window.updateCinemasByCity(activeCity);
        }
    }
    if (document.getElementById('moviesCarousel')) {
        const nowPlaying = allMovies.filter(movie => typeof movie.year === 'number');
        renderMovieCarousel('moviesCarousel', nowPlaying);
    }
    const trailerModal = document.getElementById('trailerModal');
    if (trailerModal) {
        trailerModal.addEventListener('hidden.bs.modal', function () {
            const video = document.getElementById('trailerVideo');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    }
});

window.updateSessionsForDate = updateSessionsForDate;
window.openTicketModal = openTicketModal;
window.getCurrentCity = getCurrentCity;
window.isSessionAvailable = isSessionAvailable;
window.openTrailer = function () {
    const trailerModal = new bootstrap.Modal(document.getElementById('trailerModal'));
    document.getElementById('trailerVideo').src = fixPath('media/trailer/duno.mp4');
    trailerModal.show();
};
setTimeout(() => {
    if (typeof window.selectDate === 'function') {
        const today = new Date();
        window.selectDate(today.getDate());
    }
}, 100);
