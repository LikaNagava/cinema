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
    if (!container || !movies.length) return;

    let currentIndex = 0;
    let autoPlayInterval = null;
    let lastCardsCount = 0;

    function getCardsPerSlide() {
        const width = window.innerWidth;
        if (width >= 1500) return 8;
        if (width >= 1200) return 5;
        if (width >= 992) return 4;
        if (width >= 768) return 3;
        return 2;
    }

    function draw(withAnimation = true) {
        const cardsCount = getCardsPerSlide();
        const total = movies.length;
        const visible = [];

        for (let i = 0; i < cardsCount; i++) {
            visible.push(movies[(currentIndex + i) % total]);
        }

        const track = container.querySelector('.carousel-track');
        if (!track) return;

        if (withAnimation) {
            track.style.opacity = '0';
            setTimeout(() => {
                track.innerHTML = visible.map(m => createMovieCardHTML(m, true)).join('');
                track.style.opacity = '1';
                attachMovieDetailsListeners();
            }, 200);
        } else {
            track.innerHTML = visible.map(m => createMovieCardHTML(m, true)).join('');
            track.style.opacity = '1';
            attachMovieDetailsListeners();
        }
        lastCardsCount = cardsCount;
    }

    window.addEventListener('resize', () => {
        const currentCount = getCardsPerSlide();
        if (currentCount !== lastCardsCount) {
            draw(false);
        }
    });

    container.innerHTML = `
    <div class="custom-carousel">
        <div class="carousel-track-wrapper"><div class="carousel-track"></div></div>
        <button class="carousel-btn prev-btn">
            <img src="${fixPath('media/arrowLeft.png')}" alt="Назад" width="32" height="32">
        </button>
        <button class="carousel-btn next-btn">
            <img src="${fixPath('media/arrowRight.png')}" alt="Вперед" width="32" height="32">
        </button>
    </div>
`;

    container.querySelector('.prev-btn').onclick = () => {
        currentIndex = (currentIndex - 1 + movies.length) % movies.length;
        draw(true);
        resetAutoPlay();
    };

    container.querySelector('.next-btn').onclick = () => {
        currentIndex = (currentIndex + 1) % movies.length;
        draw(true);
        resetAutoPlay();
    };

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % movies.length;
            draw(true);
        }, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);
    draw(false);
    startAutoPlay();
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
