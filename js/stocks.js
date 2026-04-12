// stocks.js
const stocksData = [
    {
        id: 'students',
        title: 'Студентам — скидка 20%',
        image: '../media/stocks/students.png',
        shortDesc: 'Скидка на все сеансы при предъявлении студенческого.',
        fullDesc: 'Акция действует с понедельника по четверг для студентов всех форм обучения. Для получения скидки необходимо предъявить действующий студенческий билет (или зачетку) кассиру перед покупкой билета. Скидка распространяется на все фильмы, кроме тех, на которые наложен меморандум от правообладателя.'
    },
    {
        id: 'children',
        title: 'Детям — скидка 50%',
        image: '../media/stocks/children.png',
        shortDesc: 'Специальная цена для самых маленьких зрителей.',
        fullDesc: 'Детский билет доступен для детей до 12 лет на фильмы с возрастным ограничением 0+, 6+ и 12+. Покупка возможна как на сайте, так и в касса в здании кинотеатра. Пожалуйста, будьте готовы предъявить свидетельство о рождении, если ребенок выглядит старше указанного возраста.'
    },
    {
        id: 'seniors',
        title: 'Пожилым гражданам — 50%',
        image: '../media/stocks/seniors.png',
        shortDesc: 'Забота о старшем поколении в SkyCinema.',
        fullDesc: 'Покупка билетов для пенсионеров осуществляется только в здании кинотеатра через кассу. Скидка 50% предоставляется при предъявлении пенсионного удостоверения. Акция действует ежедневно на утренние и дневные сеансы, начинающиеся до 17:00.'
    },
    {
        id: 'ovz',
        title: 'Людям с ОВЗ — скидка 50%',
        image: '../media/stocks/ovz.jpg',
        shortDesc: 'Доступная среда и льготные условия.',
        fullDesc: 'Мы стремимся сделать кино доступным для всех. Скидка предоставляется при предъявлении справки об инвалидности в кассе кинотеатра. Если человеку с ОВЗ требуется сопровождение, сопровождающий также получает право на покупку билета со скидкой 50%.'
    },
    {
        id: 'birthday',
        title: 'День рождения? Билет в подарок!',
        image: '../media/stocks/birthday.jpg',
        shortDesc: 'Дарим бесплатный билет именинникам.',
        fullDesc: 'Акция действует в день вашего рождения, а также 3 дня до и 3 дня после него. Вы можете получить один бесплатный билет на любой сеанс, если приходите с другом, который покупает билет за полную стоимость. Не забудьте взять с собой паспорт или водительское удостоверение.'
    }
];

let stocksInitialized = false;

function renderStocksList() {
    const container = document.getElementById('stocksContainer');
    if (!container) return false;
    if (stocksInitialized) return true;
    
    container.innerHTML = stocksData.map(stock => `
        <div class="stock-card glass" data-stock-id="${stock.id}">
            <img src="${stock.image}" alt="${stock.title}" loading="lazy">
            <div class="stock-info">
                <h3>${stock.title}</h3>
            </div>
        </div>
    `).join('');
    
    container.addEventListener('click', (e) => {
        const card = e.target.closest('.stock-card');
        if (card) {
            const id = card.getAttribute('data-stock-id');
            if (id) window.location.href = `stock.html?id=${id}`;
        }
    });
    
    container.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.stock-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);
    });
    
    stocksInitialized = true;
    return true;
}

function renderStockDetail() {
    const params = new URLSearchParams(window.location.search);
    const stockId = params.get('id');
    const stock = stocksData.find(s => s.id === stockId);
    
    const breadcrumbSpan = document.getElementById('breadcrumbActive');
    const contentDiv = document.getElementById('stockDetailContent');
    
    if (!stock || !breadcrumbSpan || !contentDiv) return;
    
    document.title = `SkyCinema — ${stock.title}`;
    breadcrumbSpan.innerText = stock.title;
    
    contentDiv.innerHTML = `
        <div class="stock-detail-two-columns">
            <div class="stock-image-col">
                <img src="${stock.image}" alt="${stock.title}">
            </div>
            <div class="stock-text-col">
                <h1>${stock.title}</h1>
                <div class="stock-full-desc">
                    <p>${stock.fullDesc}</p>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderStocksList();
    renderStockDetail();
});