let currentMovies = [...allMovies];
let currentLimit = 0;
let currentSort = 'none';
let currentGenre = 'all';
let currentAge = 'all';
let lastPerTwoRows = getCardsPerTwoRows();

const AGE_ORDER = ['18+', '16+', '12+', '6+', '0+'];

function getColumnsCount() {
    const width = window.innerWidth;
    if (width >= 1500) return 8;
    if (width >= 1200) return 5;
    if (width >= 768) return 4;
    return 2;
}

function getCardsPerTwoRows() {
    return getColumnsCount() * 2;
}

function getAgeWeight(rating) {
    const idx = AGE_ORDER.indexOf(rating);
    return idx === -1 ? 999 : idx;
}

function filterAndSortMovies(movies, genre, age, sortType) {
    let filtered = [...movies];

    if (genre !== 'all') {
        filtered = filtered.filter(m => m.genre.includes(genre));
    }

    if (age !== 'all') {
        const selectedWeight = getAgeWeight(age);
        filtered = filtered.filter(m => {
            const mWeight = getAgeWeight(m.ageRating);
            return mWeight >= selectedWeight;
        });
    }

    if (age !== 'all') {
        const selectedWeight = getAgeWeight(age);
        filtered.sort((a, b) => {
            const aExact = (getAgeWeight(a.ageRating) === selectedWeight) ? 0 : 1;
            const bExact = (getAgeWeight(b.ageRating) === selectedWeight) ? 0 : 1;
            if (aExact !== bExact) return aExact - bExact;
            if (sortType === 'az') return a.title.localeCompare(b.title);
            if (sortType === 'za') return b.title.localeCompare(a.title);
            return 0;
        });
    } else {
        if (sortType === 'az') filtered.sort((a, b) => a.title.localeCompare(b.title));
        else if (sortType === 'za') filtered.sort((a, b) => b.title.localeCompare(a.title));
        else filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
}
function updateFilterHighlight() {
    const btnAZ = document.getElementById('sortAZ');
    const btnZA = document.getElementById('sortZA');
    if (currentSort === 'az') {
        btnAZ.classList.add('active');
        btnZA.classList.remove('active');
    } else if (currentSort === 'za') {
        btnZA.classList.add('active');
        btnAZ.classList.remove('active');
    } else {
        btnAZ.classList.remove('active');
        btnZA.classList.remove('active');
    }

    const mobileBtnAZ = document.getElementById('mobileSortAZ');
    const mobileBtnZA = document.getElementById('mobileSortZA');
    if (mobileBtnAZ && mobileBtnZA) {
        if (currentSort === 'az') {
            mobileBtnAZ.classList.add('active');
            mobileBtnZA.classList.remove('active');
        } else if (currentSort === 'za') {
            mobileBtnZA.classList.add('active');
            mobileBtnAZ.classList.remove('active');
        } else {
            mobileBtnAZ.classList.remove('active');
            mobileBtnZA.classList.remove('active');
        }
    }

    const genreSelect = document.getElementById('genreFilter');
    const ageSelect = document.getElementById('ageFilter');
    if (genreSelect) {
        if (currentGenre !== 'all') genreSelect.classList.add('filter-active');
        else genreSelect.classList.remove('filter-active');
    }
    if (ageSelect) {
        if (currentAge !== 'all') ageSelect.classList.add('filter-active');
        else ageSelect.classList.remove('filter-active');
    }

    const mobileGenre = document.getElementById('mobileGenreFilter');
    const mobileAge = document.getElementById('mobileAgeFilter');
    if (mobileGenre) {
        if (currentGenre !== 'all') mobileGenre.classList.add('filter-active');
        else mobileGenre.classList.remove('filter-active');
    }
    if (mobileAge) {
        if (currentAge !== 'all') mobileAge.classList.add('filter-active');
        else mobileAge.classList.remove('filter-active');
    }
}

function applyFiltersAndSort() {
    lastPerTwoRows = getCardsPerTwoRows();
    const filtered = filterAndSortMovies(allMovies, currentGenre, currentAge, currentSort);
    currentMovies = filtered;
    const perTwoRows = getCardsPerTwoRows();
    currentLimit = Math.min(perTwoRows, currentMovies.length);
    renderMoviesGrid();
    updateFilterHighlight()
}

function renderMoviesGrid() {
    const container = document.getElementById('filmsGrid');
    if (!container) return;
    const moviesToShow = currentMovies.slice(0, currentLimit);
    container.innerHTML = moviesToShow.map(m => createMovieCardHTML(m, true)).join('');
    if (typeof attachMovieDetailsListeners === 'function') {
        attachMovieDetailsListeners();
    }
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = currentLimit < currentMovies.length ? 'flex' : 'none';
    }
}

function loadMore() {
    const perTwoRows = getCardsPerTwoRows();
    const newLimit = Math.min(currentLimit + perTwoRows, currentMovies.length);
    if (newLimit > currentLimit) {
        currentLimit = newLimit;
        lastPerTwoRows = getCardsPerTwoRows();
        renderMoviesGrid();
    }
}

function renderNowPlaying() {
    const container = document.getElementById('nowPlayingGrid');
    if (!container) return;
    const nowPlaying = allMovies.filter(m => typeof m.year === 'number');
    container.innerHTML = nowPlaying.map(m => createMovieCardHTML(m, true)).join('');
    if (typeof attachMovieDetailsListeners === 'function') attachMovieDetailsListeners();
}

function renderUpcoming() {
    const container = document.getElementById('upcomingGrid');
    if (!container) return;
    const upcoming = allMovies.filter(m => typeof m.year === 'string');
    container.innerHTML = upcoming.map(m => createMovieCardHTML(m, true)).join('');
    if (typeof attachMovieDetailsListeners === 'function') attachMovieDetailsListeners();
}

function populateFilters() {
    const genreSet = new Set();
    allMovies.forEach(movie => {
        movie.genre.split(', ').forEach(g => genreSet.add(g));
    });
    const sortedGenres = Array.from(genreSet).sort();
    const ageOptions = ['all', ...AGE_ORDER];

    const genreSelect = document.getElementById('genreFilter');
    const ageSelect = document.getElementById('ageFilter');
    const mobileGenre = document.getElementById('mobileGenreFilter');
    const mobileAge = document.getElementById('mobileAgeFilter');

    if (genreSelect) {
        genreSelect.innerHTML = '<option value="all">Все жанры</option>';
        sortedGenres.forEach(g => { genreSelect.innerHTML += `<option value="${g}">${g}</option>`; });
    }
    if (ageSelect) {
        ageSelect.innerHTML = '';
        ageOptions.forEach(opt => {
            const label = opt === 'all' ? 'Все возрасты' : opt;
            ageSelect.innerHTML += `<option value="${opt}">${label}</option>`;
        });
    }
    if (mobileGenre) {
        mobileGenre.innerHTML = '<option value="all">Все жанры</option>';
        sortedGenres.forEach(g => { mobileGenre.innerHTML += `<option value="${g}">${g}</option>`; });
    }
    if (mobileAge) {
        mobileAge.innerHTML = '';
        ageOptions.forEach(opt => {
            const label = opt === 'all' ? 'Все возрасты' : opt;
            mobileAge.innerHTML += `<option value="${opt}">${label}</option>`;
        });
    }
}

function syncFilters() {
    const genreDesktop = document.getElementById('genreFilter');
    const ageDesktop = document.getElementById('ageFilter');
    const mobileGenre = document.getElementById('mobileGenreFilter');
    const mobileAge = document.getElementById('mobileAgeFilter');
    if (genreDesktop && mobileGenre) mobileGenre.value = genreDesktop.value;
    if (ageDesktop && mobileAge) mobileAge.value = ageDesktop.value;
}

function initMobileFilterDropdown() {
    const btn = document.getElementById('mobileFilterBtn');
    const dropdown = document.getElementById('mobileFilterDropdown');
    const closeBtn = document.getElementById('closeFilterDropdown');
    const mobileGenre = document.getElementById('mobileGenreFilter');
    const mobileAge = document.getElementById('mobileAgeFilter');
    const mobileSortAZ = document.getElementById('mobileSortAZ');
    const mobileSortZA = document.getElementById('mobileSortZA');

    if (!btn || !dropdown) return;

    function openDropdown(event) {
        event.stopPropagation();
        const rect = btn.getBoundingClientRect();
        let left = rect.left;
        if (window.innerWidth - rect.right < 280) left = rect.right - 280;
        dropdown.style.display = 'block';
        dropdown.style.position = 'fixed';
        dropdown.style.top = (rect.bottom + 8) + 'px';
        dropdown.style.left = Math.max(8, left) + 'px';
        dropdown.classList.add('active');
        if (mobileGenre) mobileGenre.value = currentGenre;
        if (mobileAge) mobileAge.value = currentAge;
        updateFilterHighlight();
    }

    function closeDropdown() {
        dropdown.style.display = 'none';
        dropdown.classList.remove('active');
    }

    btn.addEventListener('click', openDropdown);
    if (closeBtn) closeBtn.addEventListener('click', closeDropdown);

    if (mobileGenre) {
        mobileGenre.addEventListener('change', (e) => {
            currentGenre = e.target.value;
            const genreDesktop = document.getElementById('genreFilter');
            if (genreDesktop) genreDesktop.value = currentGenre;
            applyFiltersAndSort();
        });
    }
    if (mobileAge) {
        mobileAge.addEventListener('change', (e) => {
            currentAge = e.target.value;
            const ageDesktop = document.getElementById('ageFilter');
            if (ageDesktop) ageDesktop.value = currentAge;
            applyFiltersAndSort();
        });
    }
    if (mobileSortAZ) {
        mobileSortAZ.addEventListener('click', () => {
            currentSort = 'az';
            applyFiltersAndSort();
            closeDropdown();
        });
    }
    if (mobileSortZA) {
        mobileSortZA.addEventListener('click', () => {
            currentSort = 'za';
            applyFiltersAndSort();
            closeDropdown();
        });
    }
    document.addEventListener('click', (e) => {
        if (dropdown.style.display === 'block' && !dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            closeDropdown();
        }
    });
    window.addEventListener('resize', () => {
        if (dropdown.style.display === 'block') closeDropdown();
    });
}

function toggleFiltersVisibility() {
    const desktopFilters = document.querySelectorAll('.desktop-filter');
    const mobileBtn = document.getElementById('mobileFilterBtn');
    if (!mobileBtn) return;
    const isMobile = window.innerWidth <= 767;
    desktopFilters.forEach(el => {
        if (el.tagName === 'SELECT') el.style.display = isMobile ? 'none' : 'inline-block';
    });
    mobileBtn.style.display = isMobile ? 'flex' : 'none';
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const newPerTwoRows = getCardsPerTwoRows();
        if (newPerTwoRows !== lastPerTwoRows) {
            const rowsShown = Math.ceil(currentLimit / lastPerTwoRows);
            let newLimit = rowsShown * newPerTwoRows;
            if (newLimit > currentMovies.length) newLimit = currentMovies.length;
            if (newLimit < newPerTwoRows && currentMovies.length >= newPerTwoRows) newLimit = newPerTwoRows;
            currentLimit = newLimit;
            lastPerTwoRows = newPerTwoRows;
            renderMoviesGrid();
        }
        toggleFiltersVisibility();
    }, 200);
});

document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    applyFiltersAndSort();
    renderNowPlaying();
    renderUpcoming();
    initMobileFilterDropdown();
    toggleFiltersVisibility();
    const genreFilter = document.getElementById('genreFilter');
    const ageFilter = document.getElementById('ageFilter');
    const sortAZ = document.getElementById('sortAZ');
    const sortZA = document.getElementById('sortZA');

    if (genreFilter) {
        genreFilter.addEventListener('change', (e) => {
            currentGenre = e.target.value;
            const mobileGenre = document.getElementById('mobileGenreFilter');
            if (mobileGenre) mobileGenre.value = currentGenre;
            applyFiltersAndSort();
        });
    }
    if (ageFilter) {
        ageFilter.addEventListener('change', (e) => {
            currentAge = e.target.value;
            const mobileAge = document.getElementById('mobileAgeFilter');
            if (mobileAge) mobileAge.value = currentAge;
            applyFiltersAndSort();
        });
    }
    if (sortAZ) {
        sortAZ.addEventListener('click', () => {
            currentSort = 'az';
            applyFiltersAndSort();
        });
    }
    if (sortZA) {
        sortZA.addEventListener('click', () => {
            currentSort = 'za';
            applyFiltersAndSort();
        });
    }
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMore);
});
