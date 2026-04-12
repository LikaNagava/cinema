const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург'];
let currentCity = 'Москва';
const savedCity = localStorage.getItem('selectedCity');
if (savedCity && cities.includes(savedCity)) {
    currentCity = savedCity;
}
window._currentCity = currentCity;

// ========== ВЫБОР ГОРОДА ==========
function populateCitySelect() {
    const citySelectHeader = document.getElementById('citySelectHeader');
    if (!citySelectHeader) return;

    citySelectHeader.innerHTML = '';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        if (city === currentCity) option.selected = true;
        citySelectHeader.appendChild(option);
    });
}

function initCitySelector() {
    const citySelectHeader = document.getElementById('citySelectHeader');
    if (!citySelectHeader) return;

    citySelectHeader.addEventListener('change', (e) => {
        currentCity = e.target.value;
        window._currentCity = currentCity;
        localStorage.setItem('selectedCity', currentCity);

        if (typeof window.updateCinemasByCity === 'function') {
            window.updateCinemasByCity(currentCity);
        }
        if (window.selectedDateObj && typeof window.updateSessionsForDate === 'function') {
            window.updateSessionsForDate(window.selectedDateObj);
        }
    });
}

// ========== ПОИСК ==========
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.includes('афиш')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            searchInput.value = '';
        } else if (query.includes('фильм')) {
            const movieSection = document.querySelector('.movie-grid');
            if (movieSection) movieSection.scrollIntoView({ behavior: 'smooth' });
            searchInput.value = '';
        } else if (query.includes('кинотеатр')) {
            const scheduleSection = document.querySelector('.schedule-wrapper');
            if (scheduleSection) scheduleSection.scrollIntoView({ behavior: 'smooth' });
            searchInput.value = '';
        } else if (query.includes('акци')) {
            alert('Акции появятся позже');
            searchInput.value = '';
        }
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function initHeader() {
    if (savedCity && cities.includes(savedCity)) {
        currentCity = savedCity;
        window._currentCity = currentCity;
    }

    populateCitySelect();
    initCitySelector();
    initSearch();
}

document.addEventListener('DOMContentLoaded', initHeader);

window.getCurrentCity = () => window._currentCity;
window.setCurrentCity = (city) => {
    currentCity = city;
    window._currentCity = currentCity;
    localStorage.setItem('selectedCity', currentCity);
};