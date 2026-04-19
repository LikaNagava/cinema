const cinemasData = {
    'Москва': [
        { name: 'СкайКино', address: 'Дмитровское шоссе, д. 89, ТРЦ «ХЛ Дмитровка»', halls: 7, coords: [55.863833, 37.545581], image: '../media/cinemas/scyCinema.jpg' },
        { name: 'Водный Кинотеатр', address: 'ул. Головинское шоссе, д. 5, ТЦ «Водный»', halls: 7, coords: [55.840250, 37.491320], image: '../media/cinemas/VodnCinema.jpg' },
        { name: 'БумКино', address: 'ул. Перерва, д.43, ТРЦ «БУМ»', halls: 2, coords: [55.659653, 37.74967], image: '../media/cinemas/bumCinema.png' },
        { name: 'ПаркКино', address: 'г. Пушкино, ТРЦ «Победа»', halls: 3, coords: [56.011686, 37.847352], image: '../media/cinemas/parkCinema.png' }
    ],
    'Санкт-Петербург': [
        { name: 'АртиумКино', address: 'Невский пр., 88, ТЦ «Невский Атриум»', halls: 6, coords: [59.931549, 30.354963], image: '../media/cinemas/NevCinema.jpg' },
        { name: 'СкайКино Меркурий', address: 'ул. Савушкина, 141, ТРЦ «Меркурий»', halls: 4, coords: [59.990899, 30.205789], image: '../media/cinemas/merCinema.jpg' }
    ],
    'Казань': [
        { name: 'СкайКино Казань', address: 'ул. Петербургская, 1, ТРЦ «Кольцо»', halls: 5, coords: [55.78643, 49.124335], image: '../media/cinemas/circleCinema.jpg' }
    ],
    'Екатеринбург': [
        { name: 'СкайКино Екатеринбург', address: 'ул. Малышева, 16, ТЦ «Пассаж»', halls: 5, coords: [56.836396, 60.595804], image: '../media/cinemas/passagCinema.png' }
    ]
};


let myMap = null;
let geoCollection = null;
let markersMap = {};

function initMap() {
    if (typeof ymaps === 'undefined') return;

    ymaps.ready(() => {
        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10,
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search',
            yandexMapDisablePoiInteractivity: false
        });
        geoCollection = new ymaps.GeoObjectCollection();
        myMap.geoObjects.add(geoCollection);

        renderMarkers();
    });
}
function focusOnCinema(coords, zoomLevel, placemark) {
    if (!myMap) return;

    myMap.setCenter(coords, zoomLevel, {
        checkZoomRange: true,
        duration: 800,
        timingFunction: 'ease-in-out'
    }).then(() => {
        if (placemark) {
            placemark.balloon.open();
        }
    });
}

function renderMarkers() {
    if (!myMap || !geoCollection) return;

    geoCollection.removeAll();
    markersMap = {};

    const city = window._currentCity || 'Москва';
    const cinemas = cinemasData[city] || [];

    if (cinemas.length === 0) return;

    cinemas.forEach(cinema => {
        if (cinema.coords) {
            const placemark = new ymaps.Placemark(cinema.coords, {
                balloonContentHeader: `<div style="color:#000; font-family: Inter, sans-serif;"><b>${cinema.name}</b></div>`,
                balloonContentBody: `<div style="color:#333; font-family: Inter, sans-serif;">${cinema.address}<br><b>Залов: ${cinema.halls}</b></div>`,
                hintContent: cinema.name
            }, {
                preset: 'islands#blueMovieIcon',
                hideIconOnBalloonOpen: false,
                balloonMaxWidth: 250
            });

            markersMap[cinema.name] = placemark;
            
            placemark.events.add('click', (e) => {
                e.preventDefault();
                focusOnCinema(cinema.coords, 18, placemark);
            });

            geoCollection.add(placemark);
        }
    });
    if (geoCollection.getLength() > 0) {
        if (geoCollection.getLength() === 1) {
            myMap.setCenter(cinemas[0].coords, 15);
        } else {
            myMap.setBounds(geoCollection.getBounds(), {
                checkZoomRange: true,
                zoomMargin: 80
            });
        }
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
            <div class="cinema-card glass" data-name="${cinema.name}">
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

    const cards = container.querySelectorAll('.cinema-card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const name = card.getAttribute('data-name');
            const cinema = cinemas.find(c => c.name === name);
            const placemark = markersMap[name];

            if (cinema && cinema.coords && myMap) {
                document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
                focusOnCinema(cinema.coords, 18, placemark);
            }
        });
    });
}

window.updateCinemasByCity = function (city) {
    window._currentCity = city;
    renderCinemas();
    if (myMap) {
        renderMarkers();
    }
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

