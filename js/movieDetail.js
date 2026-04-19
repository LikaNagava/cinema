(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = parseInt(urlParams.get('id'));
    const movie = allMovies.find(m => m.id === movieId);
    if (!movie) {
        document.getElementById('movieMain').innerHTML = '<div class="glass" style="padding:40px; text-align:center;">Фильм не найден. <a href="films.html">Вернуться к фильмам</a></div>';
        return;
    }
    document.title = `SkyCinema — ${movie.title}`;

    document.getElementById('detailPoster').src = fixPath(movie.image);
    document.getElementById('detailAge').innerText = movie.ageRating;
    document.getElementById('detailTitle').innerText = movie.title;
    const breadcrumbSpan = document.getElementById('breadcrumbMovieTitle');
    if (breadcrumbSpan) breadcrumbSpan.innerText = movie.title;
    document.getElementById('detailGenre').innerText = movie.genre;
    document.getElementById('detailYear').innerText = movie.year;
    document.getElementById('detailDuration').innerText = movie.duration;
    document.getElementById('detailAgeText').innerText = movie.ageRating;
    document.getElementById('detailActors').innerText = movie.actors || 'Информация скоро появится';
    document.getElementById('detailDesc').innerText = movie.description || 'Описание отсутствует';

    if (movie.gallery && movie.gallery.length) {
    const galleryTrack = document.querySelector('.gallery-track');
    if (galleryTrack) {
        galleryTrack.innerHTML = movie.gallery.map(img => `<img src="${fixPath(img)}" alt="Кадр из фильма" class="gallery-img">`).join('');
        let currentGalleryIndex = 0;
        const galleryImgs = document.querySelectorAll('.gallery-img');
        const showImage = (index) => {
            galleryImgs.forEach((img, i) => img.style.display = i === index ? 'block' : 'none');
        };
        if (galleryImgs.length) {
            showImage(0);
            const prevBtn = document.querySelector('.gallery-prev');
            const nextBtn = document.querySelector('.gallery-next');
            
            if (prevBtn) {
                prevBtn.innerHTML = `<img src="${fixPath('media/arrowLeft.png')}" alt="Назад" width="28" height="28">`;
                prevBtn.classList.add('gallery-nav-btn');
            }
            if (nextBtn) {
                nextBtn.innerHTML = `<img src="${fixPath('media/arrowRight.png')}" alt="Вперед" width="28" height="28">`;
                nextBtn.classList.add('gallery-nav-btn');
            }
            
            prevBtn?.addEventListener('click', () => {
                currentGalleryIndex = (currentGalleryIndex - 1 + galleryImgs.length) % galleryImgs.length;
                showImage(currentGalleryIndex);
            });
            nextBtn?.addEventListener('click', () => {
                currentGalleryIndex = (currentGalleryIndex + 1) % galleryImgs.length;
                showImage(currentGalleryIndex);
            });
        }
    }
}
    
    const galleryTrack = document.querySelector('.gallery-track');
    if (galleryTrack) {
        galleryTrack.addEventListener('click', (e) => {
            const img = e.target.closest('.gallery-img');
            if (img) {
                const modal = new bootstrap.Modal(document.getElementById('imageModal'));
                document.getElementById('modalImage').src = img.src;
                modal.show();
            }
        });
    }

    const sessionsListMovie = document.getElementById('sessionsListMovie');

    function getAllSessionsForMovie() {
        const result = [];
        for (const cinema in sessionsMock) {
            for (const dateStr in sessionsMock[cinema]) {
                const sessions = sessionsMock[cinema][dateStr];
                sessions.forEach(session => {
                    if (session.movieId === movieId) {
                        result.push({
                            cinema: cinema,
                            date: dateStr,
                            time: session.time,
                            hall: session.hall,
                            price: session.price,
                            movieTitle: session.movieTitle
                        });
                    }
                });
            }
        }
        result.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
        return result;
    }

    function renderSessionsForMovie() {
        const allSessions = getAllSessionsForMovie();
        if (allSessions.length === 0) {
            sessionsListMovie.innerHTML = '<p class="placeholder">Доступных сеансов нет</p>';
            return;
        }

        const city = window.getCurrentCity ? window.getCurrentCity() : 'Москва';
        const cinemasInCity = cinemasByCity[city] || [];
        const groupedByDate = {};

        allSessions.forEach(session => {
            if (!cinemasInCity.includes(session.cinema)) return;
            if (!groupedByDate[session.date]) groupedByDate[session.date] = {};
            if (!groupedByDate[session.date][session.cinema]) groupedByDate[session.date][session.cinema] = [];
            groupedByDate[session.date][session.cinema].push(session);
        });
        if (Object.keys(groupedByDate).length === 0) {
            sessionsListMovie.innerHTML = '<p class="placeholder">Доступных сеансов нет</p>';
            return;
        }

        let html = '';
        for (const [date, cinemas] of Object.entries(groupedByDate)) {
            const formattedDate = new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' });
            html += `<div class="session-date-group"><strong>${formattedDate}</strong></div>`;
            for (const [cinemaName, sessions] of Object.entries(cinemas)) {
                html += `<div class="session-cinema-group"><strong>${cinemaName}</strong>`;
                sessions.forEach(s => {
                    const available = new Date(date + 'T' + s.time) > new Date();
                    html += `
                        <div class="session-item">
                            <span class="session-time">${s.time}</span>
                            <span class="session-price">${s.price} ₽</span>
                            <button class="btn-buy" data-session='${JSON.stringify(s)}' ${!available ? 'disabled' : ''}>Купить билет</button>
                        </div>
                    `;
                });
                html += `</div>`;
            }
        }
        sessionsListMovie.innerHTML = html;

        document.querySelectorAll('#sessionsListMovie .btn-buy').forEach(btn => {
            btn.addEventListener('click', () => {
                const session = JSON.parse(btn.dataset.session);
                const fakeSession = {
                    time: session.time,
                    hall: session.hall,
                    price: session.price,
                    movieId: movieId,
                    movieTitle: session.movieTitle
                };
                if (typeof window.openTicketModal === 'function') {
                    window.openTicketModal(fakeSession, session.cinema, new Date(session.date));
                }
            });
        });
    }

    window.updateCinemasByCity = function (city) {
        renderSessionsForMovie();
    };

    document.addEventListener('DOMContentLoaded', () => {
        renderSessionsForMovie();
    });
})();

document.addEventListener('click', function (e) {
    const star = e.target.closest('#ratingStars span');
    if (!star) return;
    const stars = document.querySelectorAll('#ratingStars span');
    const value = star.dataset.value;
    stars.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < value; i++) {
        stars[i].classList.add('active');
    }
    if (typeof showToast === 'function') {
        showToast('Спасибо за оценку!', true);
    } else {
        alert('Спасибо за оценку!');
    }
});
