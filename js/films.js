let currentMovies = [...allMovies];
let currentLimit = 0;
let currentSort = 'none';
let currentGenre = 'all';
let lastPerTwoRows = getCardsPerTwoRows();

function getColumnsCount() {
    const width = window.innerWidth;
    if (width >= 1500) return 8;
    if (width >= 1200) return 5;
    if (width >= 768) return 4;
    return 2;
}

// Количество карточек для двух строк
function getCardsPerTwoRows() {
    return getColumnsCount() * 2;
}

// Заполнить select жанров
function populateGenreFilter() {
    const genreSet = new Set();
    allMovies.forEach(movie => {
        const genres = movie.genre.split(', ');
        genres.forEach(g => genreSet.add(g));
    });
    const sortedGenres = Array.from(genreSet).sort();
    const select = document.getElementById('genreFilter');
    if (!select) return;
    select.innerHTML = '<option value="all">Все жанры</option>';
    sortedGenres.forEach(genre => {
        select.innerHTML += `<option value="${genre}">${genre}</option>`;
    });
}

// Применить фильтры и сортировку
function applyFiltersAndSort() {
    lastPerTwoRows = getCardsPerTwoRows(); // просто присваиваем, без let
    let filtered = [...allMovies];
    if (currentGenre !== 'all') {
        filtered = filtered.filter(movie => movie.genre.includes(currentGenre));
    }
    if (currentSort === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSort === 'za') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    }
    currentMovies = filtered;
    const perTwoRows = getCardsPerTwoRows();
    currentLimit = Math.min(perTwoRows, currentMovies.length);
    renderMoviesGrid();
}

// Рендер основного списка
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

// Загрузить ещё две строки
function loadMore() {
    const perTwoRows = getCardsPerTwoRows();
    const newLimit = Math.min(currentLimit + perTwoRows, currentMovies.length);
    if (newLimit > currentLimit) {
        currentLimit = newLimit;
        lastPerTwoRows = getCardsPerTwoRows();
        renderMoviesGrid();
    }
}

// Рендер блока "Скоро в прокате" (фильтруем по строковому году)
function renderUpcoming() {
    const container = document.getElementById('upcomingGrid');
    if (!container) return;
    const upcoming = allMovies.filter(m => typeof m.year === 'string');
    container.innerHTML = upcoming.map(m => createMovieCardHTML(m, true)).join('');
    if (typeof attachMovieDetailsListeners === 'function') {
        attachMovieDetailsListeners();
    }
}

// Обработчик изменения размера окна
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const newPerTwoRows = getCardsPerTwoRows();
        if (newPerTwoRows !== lastPerTwoRows) {
            const rowsShown = Math.ceil(currentLimit / lastPerTwoRows);
            let newLimit = rowsShown * newPerTwoRows;
            if (newLimit > currentMovies.length) newLimit = currentMovies.length;
            if (newLimit < newPerTwoRows && currentMovies.length >= newPerTwoRows) {
                newLimit = newPerTwoRows;
            }
            currentLimit = newLimit;
            lastPerTwoRows = newPerTwoRows;
            renderMoviesGrid();
        }
    }, 200);
});

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    populateGenreFilter();
    applyFiltersAndSort();
    renderUpcoming();

    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter) {
        genreFilter.addEventListener('change', (e) => {
            currentGenre = e.target.value;
            applyFiltersAndSort();
        });
    }
    const sortAZ = document.getElementById('sortAZ');
    if (sortAZ) {
        sortAZ.addEventListener('click', () => {
            currentSort = 'az';
            applyFiltersAndSort();
        });
    }
    const sortZA = document.getElementById('sortZA');
    if (sortZA) {
        sortZA.addEventListener('click', () => {
            currentSort = 'za';
            applyFiltersAndSort();
        });
    }
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMore);
    }
});