/* --- header.js (обновлен: сохранение города + вызов обновления кинотеатров с восстановлением вкладки) --- */
const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург'];
let currentCity = 'Москва';

function populateCitySelect() {
    const citySelectHeader = document.getElementById('citySelectHeader');
    if (!citySelectHeader) return;

    const savedCity = localStorage.getItem('selectedCity') || 'Москва';
    window._currentCity = savedCity;

    citySelectHeader.innerHTML = '';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        if (city === savedCity) option.selected = true;
        citySelectHeader.appendChild(option);
    });
}

function initCitySelector() {
    const citySelectHeader = document.getElementById('citySelectHeader');
    if (!citySelectHeader) return;

    citySelectHeader.addEventListener('change', (e) => {
        const newCity = e.target.value;
        window._currentCity = newCity;
        localStorage.setItem('selectedCity', newCity);

        const cityNameSpan = document.getElementById('currentCityName');
        if (cityNameSpan) cityNameSpan.innerText = newCity;

       if (typeof window.updateCinemasByCity === 'function') {
            window.updateCinemasByCity(newCity);
        }
        
        if (window.selectedDateObj && typeof window.updateSessionsForDate === 'function') {
            window.updateSessionsForDate(window.selectedDateObj);
        }
        
        if (typeof window.refreshCinemasList === 'function') {
            window.refreshCinemasList(newCity);
        }
    });
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.includes('афиш')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (query.includes('фильм')) {
            const movieSection = document.querySelector('.movie-grid');
            if (movieSection) movieSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function closeMenuOnOutsideClick(event) {
    const mobileNav = document.getElementById('mobileNav');
    const burgerBtn = document.getElementById('burgerBtn');
    if (!mobileNav || !burgerBtn) return;
    if (mobileNav.classList.contains('active') &&
        !burgerBtn.contains(event.target) &&
        !mobileNav.contains(event.target)) {
        burgerBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initBurgerMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const body = document.body;
    if (!burgerBtn || !mobileNav) return;

    function toggleMenu() {
        burgerBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    document.addEventListener('click', closeMenuOnOutsideClick);
    burgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    mobileNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') toggleMenu();
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991 && mobileNav.classList.contains('active')) toggleMenu();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateCitySelect();
    initCitySelector();
    initSearch();
    initBurgerMenu();
});
