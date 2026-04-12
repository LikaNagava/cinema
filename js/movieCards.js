function createMovieCardHTML(movie, showButton = true) {
    const imagePath = fixPath(movie.image);
    return `
        <div class="movie-card glass" data-movie-id="${movie.id}">
            <div class="poster" style="background-image: url('${imagePath}'); background-size: cover; background-position: center;">
                <div class="age-badge">${movie.ageRating}</div>
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.genre}</p>
                <div class="card-footer">
                    <span class="movie-year">${movie.year}</span>
                    ${showButton ? `<button class="btn-card" data-id="${movie.id}">Подробнее</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderMovieGrid(containerId, movies) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = movies.map(m => createMovieCardHTML(m, true)).join('');
    attachMovieDetailsListeners();
}

function renderMovieCarousel(containerId, movies) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let currentIndex = 0;
    let cardsPerSlide = getCardsPerSlide();
    let carouselTrack = null;
    let prevBtn = null, nextBtn = null;

    function getCardsPerSlide() {
        const width = window.innerWidth;
        if (width >= 1500) return 8;
        if (width >= 1200) return 5;
        if (width >= 768) return 4;
        return 2;
    }

    function buildCarousel() {
        cardsPerSlide = getCardsPerSlide();
        const totalCards = movies.length;

        const visibleMovies = [];
        for (let i = 0; i < cardsPerSlide; i++) {
            const idx = (currentIndex + i) % totalCards;
            visibleMovies.push(movies[idx]);
        }

        const cardsHtml = visibleMovies.map(m => createMovieCardHTML(m, true)).join('');
        const carouselHTML = `
            <div class="custom-carousel">
                <div class="carousel-track-wrapper">
                    <div class="carousel-track">${cardsHtml}</div>
                </div>
                <button class="carousel-btn prev-btn">‹</button>
                <button class="carousel-btn next-btn">›</button>
            </div>
        `;
        container.innerHTML = carouselHTML;

        carouselTrack = container.querySelector('.carousel-track');
        prevBtn = container.querySelector('.prev-btn');
        nextBtn = container.querySelector('.next-btn');

        function slide(direction) {
            const step = direction === 'next' ? 1 : -1;
            currentIndex = (currentIndex + step + totalCards) % totalCards;
            updateCarousel();
        }

        function updateCarousel() {
            const newMovies = [];
            for (let i = 0; i < cardsPerSlide; i++) {
                const idx = (currentIndex + i) % totalCards;
                newMovies.push(movies[idx]);
            }
            const newCardsHtml = newMovies.map(m => createMovieCardHTML(m, true, '')).join('');
            carouselTrack.style.opacity = '0.5';
            setTimeout(() => {
                carouselTrack.innerHTML = newCardsHtml;
                carouselTrack.style.opacity = '1';
                attachMovieDetailsListeners();
            }, 150);
        }

        prevBtn.addEventListener('click', () => slide('prev'));
        nextBtn.addEventListener('click', () => slide('next'));
        attachMovieDetailsListeners();
    }

    function handleResize() {
        const newCardsPerSlide = getCardsPerSlide();
        if (newCardsPerSlide !== cardsPerSlide) {
            buildCarousel();
        }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });

    buildCarousel();
}

function attachMovieDetailsListeners() {
    document.querySelectorAll('.btn-card').forEach(btn => {
        btn.removeEventListener('click', handleMovieClick);
        btn.addEventListener('click', handleMovieClick);
    });
}

function handleMovieClick(e) {
    e.preventDefault();
    const movieId = this.dataset.id;
    if (movieId) {
       const isInPages = window.location.pathname.includes('/pages/');
        const path = isInPages ? `film.html?id=${movieId}` : `pages/film.html?id=${movieId}`;
        window.location.href = path;
    }
}