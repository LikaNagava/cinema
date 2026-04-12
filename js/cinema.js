const cinemasData = {
    'Москва': [
        { name: 'СкайКино', address: 'Дмитровское шоссе, д. 89, ТРЦ «ХЛ Дмитровка»', halls: 7, coords: [55.873, 37.562], image: '../media/cinemas/scyCinema.jpg' },
        { name: 'Водный Кинотеатр', address: 'ул. Головинское шоссе, д. 5, ТЦ «Водный»', halls: 7, coords: [55.842, 37.506], image: '../media/cinemas/VodnCinema.jpg' },
        { name: 'БумКино', address: 'ул. Перерва, д.43, ТРЦ «БУМ»', halls: 2, coords: [55.642, 37.741], image: '../media/cinemas/bumCinema.png' },
        { name: 'ПаркКино', address: 'г. Пушкино, ТРЦ «Пушкин»', halls: 3, coords: [56.010, 37.847], image: '../media/cinemas/parkCinema.png' }
    ],
    'Санкт-Петербург': [
        { name: 'АртиумКино', address: 'Невский пр., 88, ТЦ «Невский Атриум»', halls: 6, coords: [59.932, 30.360], image: '../media/cinemas/NevCinema.jpg' },
        { name: 'СкайКино Меркурий', address: 'ул. Савушкина, 141, ТРЦ «Меркурий»', halls: 4, coords: [59.987, 30.267], image: '../media/cinemas/merCinema.jpg' }
    ],
    'Казань': [
        { name: 'СкайКино Казань', address: 'ул. Петербургская, 55, ТРЦ «Кольцо»', halls: 5, coords: [55.797, 49.106], image: '../media/cinemas/circleCinema.jpg' }
    ],
    'Екатеринбург': [
        { name: 'СкайКино Екатеринбург', address: 'ул. Малышева, 5, ТЦ «Пассаж»', halls: 5, coords: [56.838, 60.605], image: '../media/cinemas/passagCinema.png' }
    ]
};

let myMap = null;
let geoCollection = null;

function initMap() {
    if (typeof ymaps === 'undefined') return;

    ymaps.ready(() => {
        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10,
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем коллекцию для маркеров
        geoCollection = new ymaps.GeoObjectCollection();
        myMap.geoObjects.add(geoCollection);

        renderMarkers();
    });
}

function renderMarkers() {
    if (!myMap || !geoCollection) return;

    // Очищаем предыдущие метки
    geoCollection.removeAll();

    const city = window._currentCity || 'Москва';
    const cinemas = cinemasData[city] || [];

    if (cinemas.length === 0) return;

    cinemas.forEach(cinema => {
        if (cinema.coords) {
            const placemark = new ymaps.Placemark(cinema.coords, {                // Данные для балуна (попапа)
                balloonContentHeader: `<span style="color:#000"><b>${cinema.name}</b></span>`,
                balloonContentBody: `<span style="color:#333">${cinema.address}<br>Залов: ${cinema.halls}</span>`,
            }, {
                // Стиль метки
                preset: 'islands#blueMovieIcon'
            });
            geoCollection.add(placemark);
        }
    });

    // Центрируем карту так, чтобы были видны все метки города
    if (geoCollection.getBounds()) {
        myMap.setBounds(geoCollection.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 50 // Отступ от краев карты
        });
    }
}

function renderCinemas() {
    const container = document.getElementById('cinemasList');
    const cityNameSpan = document.getElementById('currentCityName');
    if (!container) return;

    const city = window._currentCity || 'Москва';
    const cinemas = cinemasData[city] || [];
    if (cityNameSpan) cityNameSpan.innerText = city;

    if (cinemas.length === 0) {
        container.innerHTML = '<div class="glass" style="padding: 20px; text-align: center;">Нет кинотеатров в выбранном городе</div>';
        renderMarkers();
        return;
    }

    let html = '<div class="cinemas-grid">';
    cinemas.forEach(cinema => {
        html += `
            <div class="cinema-card glass">
                <div class="cinema-card-image">
                    <img src="${cinema.image}" alt="${cinema.name}">
                </div>
                <div class="cinema-card-info">
                    <h3>${cinema.name}</h3>
                    <p>${cinema.address}</p>
                    <span class="cinema-halls">Залы: ${cinema.halls}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;

    // Обновляем маркеры на карте
    renderMarkers();
}

// Эту функцию вызывайте из вашего header.js при смене города в селекте
window.updateCinemasByCity = function (city) {
    window._currentCity = city;
    renderCinemas();
};

document.addEventListener('DOMContentLoaded', () => {
    let savedCity = window._currentCity;
    if (!savedCity || savedCity === 'Москва') {
        const lsCity = localStorage.getItem('selectedCity');
        if (lsCity && cinemasData[lsCity]) {
            savedCity = lsCity;
        } else {
            savedCity = 'Москва';
        }
    }
    window._currentCity = savedCity;
    renderCinemas();
    initMap();
});

