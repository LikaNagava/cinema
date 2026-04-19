let currentHallLayout = [];
let selectedSeat = null;
let currentSessionForModal = null;
let currentMovieForModal = null;

function renderHallLayout(layout) {
    const container = document.getElementById('seatsContainer');
    if (!container) return;
    let innerHtml = '<div class="seats-inner">';
    layout.forEach(rowSeats => {
        const rowNumber = rowSeats[0].row;
        innerHtml += `<div class="seat-row">`;
        innerHtml += `<div class="row-label"> ${rowNumber} </div>`;
        rowSeats.forEach(seat => {
            let statusClass = seat.status;
            if (selectedSeat && selectedSeat.row === seat.row && selectedSeat.seat === seat.seat) {
                statusClass = 'selected';
            }
            innerHtml += `<div class="seat ${statusClass}" data-row="${seat.row}" data-seat="${seat.seat}">${seat.seat}</div>`;
        });
        innerHtml += `</div>`;
    });
    innerHtml += '</div>';
    container.innerHTML = innerHtml;

    document.querySelectorAll('.seat.free, .seat.selected').forEach(seatEl => {
        seatEl.addEventListener('click', () => {
            const row = parseInt(seatEl.dataset.row);
            const seat = parseInt(seatEl.dataset.seat);
            if (selectedSeat && selectedSeat.row === row && selectedSeat.seat === seat) {
                selectedSeat = null;
            } else {
                selectedSeat = { row, seat };
            }
            renderHallLayout(currentHallLayout);
            updateSelectedSeatInfo();
        });
    });
}

function updateSelectedSeatInfo() {
    const infoDiv = document.getElementById('selectedSeatInfo');
    const priceDiv = document.getElementById('ticketPrice');
    const buyBtn = document.getElementById('confirmTicket');
    if (selectedSeat && currentSessionForModal) {
        const price = currentSessionForModal.price || 350;
        if (infoDiv) infoDiv.innerHTML = `<strong>Ряд: ${selectedSeat.row}, Место: ${selectedSeat.seat}</strong>`;
        if (priceDiv) priceDiv.innerHTML = `Цена: ${price} ₽`;
        if (buyBtn) buyBtn.disabled = false;
    } else {
        if (infoDiv) infoDiv.innerHTML = 'Место не выбрано';
        if (priceDiv) priceDiv.innerHTML = '';
        if (buyBtn) buyBtn.disabled = true;
    }
}

function openTicketModal(session, cinemaName = null, dateObj = null) {
    const cinema = cinemaName || (typeof currentCinema !== 'undefined' ? currentCinema : null);
    const sessionDate = dateObj || window.selectedDateObj;
    currentSessionForModal = session;
    currentHallLayout = generateHallLayout(7, 14);
    selectedSeat = null;

    const movie = allMovies.find(m => m.id === session.movieId) || {
        title: session.movieTitle,
        poster: session.poster,
        genre: 'Неизвестно',
        year: '—',
        ageRating: '12+'
    };
    currentMovieForModal = movie;

    let dateStr = 'Дата не выбрана';
    if (sessionDate) {
        const day = sessionDate.getDate();
        const month = sessionDate.getMonth() + 1;
        const year = sessionDate.getFullYear();
        dateStr = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
    } 
    else if (window.selectedDateObj) {
        const day = window.selectedDateObj.getDate();
        const month = window.selectedDateObj.getMonth() + 1;
        const year = window.selectedDateObj.getFullYear();
        dateStr = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
    }

    const hallName = session.hall;

    const movieInfoDiv = document.getElementById('movieInfoModal');
    if (movieInfoDiv) {
        movieInfoDiv.innerHTML = `
            <div class="poster"><img src="${fixPath(movie.image)}" alt="Постер фильма" /></div>
            <h3>${movie.title}</h3>
            <div class="movie-meta">
                <span>Жанр: ${movie.genre}</span>
                <span>Год выпуска: ${movie.year}</span>
            </div>
            <div class="movie-meta">
                <img src="${fixPath('media/modal/calendar.png')}" alt="календарь" class="calendar-icon">
                <span>${dateStr}  ${session.time}</span>
            </div>
            <div class="movie-meta">
                <span>Кинотеатр: ${cinema}</span>
                <span>Зал: ${hallName}</span>
            </div>
            <div class="age-restriction">
                Для зрителей ${movie.ageRating}<br>
                Кинотеатр вправе требовать предъявить удостоверение личности и отказать в просмотре лицам младше ${movie.ageRating}.
            </div>
        `;
    }

    renderHallLayout(currentHallLayout);
    updateSelectedSeatInfo();

    const emailInput = document.getElementById('userEmail');
    if (emailInput) emailInput.value = '';

    const modalEl = document.getElementById('ticketModal');
    if (!modalEl) return;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const confirmBtn = document.getElementById('confirmTicket');
    if (!confirmBtn) return;
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    newConfirmBtn.id = 'confirmTicket';

    newConfirmBtn.onclick = () => {
        const emailInput = document.getElementById('userEmail');
        const userEmail = emailInput.value.trim();
        const errorSpan = document.getElementById('emailError') || (() => {
            const span = document.createElement('div');
            span.className = 'error-message';
            span.id = 'emailError';
            emailInput.parentNode.appendChild(span);
            return span;
        })();

        if (!userEmail) {
            emailInput.classList.add('error');
            errorSpan.textContent = 'Введите email';
            errorSpan.style.display = 'block';
            return;
        } else {
            emailInput.classList.remove('error');
            errorSpan.style.display = 'none';
        }

        if (!selectedSeat) {
            showToast('Пожалуйста, выберите место.', false);
            return;
        }

        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        const modalEl = document.getElementById('ticketModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
        selectedSeat = null;
        currentSessionForModal = null;
    };
}

window.openTicketModal = openTicketModal;
