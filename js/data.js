const allMovies = [
    { id: 1, title: 'Моя собака – космонавт', genre: 'Комедия, Приключения', year: 2025, ageRating: '6+', image: 'media/films/dog.jpg', duration: 103, actors: 'Дмитрий Калихов, Антонина Бойко, Кирилл Зайцев', description: '1960 год. В городке у космодрома Байконур, где каждый запуск ракеты озаряет небо мечтами, живет десятилетний Миша — мальчик со светлой головой, полной космических фантазий. В свой день рождения Миша находит собаку Белку, которая предопределит не только его судьбу, но и напишет новую страницу в истории освоения космоса.', gallery: ['media/films/dog1.png', 'media/films/dog2.jpg'] },
    { id: 2, title: 'Твоё сердце будет разбито', genre: 'Мелодрама', year: 2026, ageRating: '16+', image: 'media/films/heart.png', duration: 134, actors: 'Анна Михайловская, Иван Стебунов', description: 'История о первой любви и потерях.', gallery: ['media/films/heart1.jpg', 'media/films/heart2.jpg'] },
    { id: 3, title: 'Оппенгеймер', genre: 'Драма, Биография', year: 2023, ageRating: '18+', image: 'media/films/oppengeymer.png', duration: 180, actors: 'Киллиан Мерфи, Эмили Блант', description: 'История американского физика Роберта Оппенгеймера, который руководил созданием первой атомной бомбы.', gallery: ['media/films/oppengeymer1.jpg', 'media/films/oppengeymer2.jpg', 'media/films/oppengeymer3.jpg'] },
    { id: 4, title: 'Бэтмен', genre: 'Боевик, Криминал', year: 2022, ageRating: '16+', image: 'media/films/batman.jpg', duration: 175, actors: 'Роберт Паттинсон, Зои Кравиц', description: 'Бэтмен раскрывает коррупцию в Готэме.', gallery: ['media/films/batman1.jpg', 'media/films/batman2.jpg', 'media/films/batman3.jpg'] },
    { id: 5, title: 'Интерстеллар', genre: 'Фантастика, Приключения', year: 2014, ageRating: '12+', image: 'media/films/interstrellar.jpg', duration: 169, actors: 'Мэттью МакКонахи, Энн Хэтэуэй', description: 'Группа исследователей использует недавно обнаруженный червоточину, чтобы преодолеть ограничения межзвездных путешествий и покорить огромные расстояния.', gallery: ['media/films/interstrellar1.jpg', 'media/films/interstrellar2.jpg', 'media/films/interstrellar3.jpg'] },
    { id: 6, title: 'Начало', genre: 'Фантастика, Триллер', year: 2010, ageRating: '12+', image: 'media/films/inception.jpg', duration: 148, actors: 'Леонардо ДиКаприо, Джозеф Гордон-Левитт', description: 'Вор, способный проникать в чужие сны, получает задание внедрить идею.', gallery: ['media/films/inception1.jpg', 'media/films/inception2.jpg'] },
    { id: 7, title: 'Джон Уик 4', genre: 'Боевик', year: 2023, ageRating: '18+', image: 'media/films/jon.jpg', duration: 169, actors: 'Киану Ривз, Донни Йен', description: 'Джон Уик продолжает борьбу с Правлением.', gallery: ['media/films/jon1.jpg', 'media/films/jon2.jpg', 'media/films/jon3.jpg'] },
    { id: 8, title: 'Барби', genre: 'Комедия, Приключения', year: 2023, ageRating: '12+', image: 'media/films/barbie.png', duration: 114, actors: 'Марго Робби, Райан Гослинг', description: 'Барби и Кен отправляются в реальный мир.', gallery: ['media/films/barbie1.jpg', 'media/films/barbie2.jpg', 'media/films/barbie3.jpg'] },
    { id: 9, title: 'Человек-паук: Паутина вселенных', genre: 'Мультфильм, Фантастика', year: 2023, ageRating: '6+', image: 'media/films/spider.png', duration: 140, actors: 'Шамеик Мур, Хейли Стайнфелд', description: 'Майлз Моралес снова встречает своих альтернативных версий.', gallery: ['media/films/spider1.png', 'media/films/spider2.png'] },
    { id: 10, title: 'Флэш', genre: 'Фантастика', year: 2023, ageRating: '12+', image: 'media/films/flash.png', duration: 144, actors: 'Эзра Миллер, Саша Калле', description: 'Барри Аллен путешествует во времени, чтобы спасти свою семью.', gallery: ['media/films/flash1.png', 'media/films/flash2.jpg'] },
    { id: 11, title: 'Титаник', genre: 'Драма, Мелодрама', year: 1997, ageRating: '16+', image: 'media/films/Titanic.png', duration: 194, actors: 'Леонардо ДиКаприо, Кейт Уинслет', description: 'История любви на фоне крушения «Титаника».', gallery: ['media/films/Titanic1.jpg', 'media/films/Titanic2.jpg', 'media/films/Titanic3.jpg', 'media/films/Titanic4.jpg'] },
    { id: 12, title: 'Дюна: Часть вторая', genre: 'Фантастика, Боевик', year: 2024, ageRating: '12+', image: 'media/films/dune.png', duration: 166, actors: 'Тимоти Шаламе, Зендея, Ребекка Фергюсон', description: 'Исследуйте мистическое путешествие Пола Атрейдеса, когда он объединяется с Чани и фременами на тропе войны, чтобы отомстить заговорщикам.', gallery: ['media/films/dune1.png', 'media/films/dune2.png'] },
    { id: 101, title: 'Лео и Тиг. Дорога на Байкал', genre: 'Мультфильм', year: 'С 11 мая', ageRating: '0+', image: 'media/films/Leo.jpg', duration: 0, actors: '', description: 'Скоро в прокате', gallery: ['media/films/Leo1.jpg', 'media/films/Leo2.jpg'] },
    { id: 102, title: 'Пункт назначения. Новая кровь', genre: 'Мистика, Триллер, Хоррор, Драма', year: 'Скоро', ageRating: '18+', image: 'media/films/punkt-naznaceniia.jpg', duration: 0, actors: '', description: 'Скоро в прокате', gallery: ['media/films/punkt-naznaceniia1.jpg', 'media/films/punkt-naznaceniia2.jpg'] },
    { id: 103, title: 'Толстяк Юзи', genre: 'Анимация', year: 'Скоро', ageRating: '6+', image: 'media/films/yooz.jpg', duration: 0, actors: '', description: 'Скоро в прокате', gallery: ['media/films/yooz1.jpg', 'media/films/yooz2.jpg', 'media/films/yooz3.jpg'] },
    { id: 104, title: 'Олдбой', genre: 'Боевик, Детектив, Драма, Триллер', year: 'Скоро', ageRating: '18+', image: 'media/films/old.jpg', duration: 0, actors: '', description: 'Скоро в прокате', gallery: ['media/films/old1.jpg', 'media/films/old2.jpg', 'media/films/old3.jpg'] },
    { id: 105, title: 'Операция «Панда»: Дикая миссия', genre: 'Семейный, Комедийный экшн', year: 'Скоро', ageRating: '16+', image: 'media/films/panda.jpg', duration: 0, actors: '', description: 'Скоро в прокате', gallery: ['media/films/panda1.jpg', 'media/films/panda2.jpg', 'media/films/panda3.jpg'] },
    { id: 106, title: 'Я – значит Ястреб', genre: 'Драма', year: 'Скоро', ageRating: '18+', image: 'media/films/i-am-hawk.jpg', duration: 0, actors: '', description: 'Скоро в прокате', gallery: ['media/films/i-am-hawk1.png', 'media/films/i-am-hawk2.jpg'] },
    { id: 107, title: 'Коммерсант', genre: 'Драма', year: 'С 22 апреля', ageRating: '18+', image: 'media/films/kommersant.jpg', duration: 0, actors: '', description: 'Скоро в прокате', gallery: ['media/films/kommersant1.jpg', 'media/films/kommersant2.jpg'] },
    { id: 108, title: 'Ангелы Ладоги', genre: 'Аниме, Мультфильм, Семейный', year: 'С 23 апреля', ageRating: '0+', image: 'media/films/angels-ladoga.jpg', duration: 0, actors: '', description: 'Скоро в прокате', gallery: ['media/films/angels-ladoga1.jpg', 'media/films/angels-ladoga2.jpg', 'media/films/angels-ladoga3.jpg'] },
    { id: 109, title: 'Возвращение кота', genre: 'Мультфильм, Комедия', year: 'С 25 апреля', ageRating: '6+', image: 'media/films/cat-return.jpg', duration: 0, actors: '', description: 'Скоро в прокате', gallery: ['media/films/cat-return1.jpg', 'media/films/cat-return2.jpg', 'media/films/cat-return3.jpg'] }
];

const cinemasByCity = {
    'Москва': ['СкайКино', 'Водный Кинотеатр', 'БумКино', 'ПаркКино'],
    'Санкт-Петербург': ['АртиумКино', 'СкайКино Меркурий'],
    'Казань': ['Казань'],
    'Екатеринбург': ['Екатеринбург']
};

const sessionsMock = {
    'СкайКино': {
        '2026-04-28': [
            { time: '10:00', hall: 'Зал 1', price: 350, movieId: 3, movieTitle: 'Оппенгеймер' },
            { time: '10:00', hall: 'Зал 2', price: 350, movieId: 12, movieTitle: 'Дюна: Часть вторая' },
            { time: '13:30', hall: 'Зал 2', price: 420, movieId: 4, movieTitle: 'Бэтмен' },
            { time: '16:50', hall: 'IMAX', price: 650, movieId: 5, movieTitle: 'Интерстеллар' },
            { time: '20:15', hall: 'Зал 3', price: 480, movieId: 6, movieTitle: 'Начало' }
        ],
        '2026-04-29': [
            { time: '11:00', hall: 'Зал 1', price: 350, movieId: 4, movieTitle: 'Бэтмен' },
            { time: '18:00', hall: 'Зал 2', price: 400, movieId: 3, movieTitle: 'Оппенгеймер' }
        ]
    },
    'Водный Кинотеатр': {
        '2026-04-29': [
            { time: '12:00', hall: 'Зал A', price: 390, movieId: 7, movieTitle: 'Джон Уик 4' },
            { time: '18:00', hall: 'Зал B', price: 450, movieId: 8, movieTitle: 'Барби' }
        ],
        '2026-04-28': [
            { time: '14:00', hall: 'Зал C', price: 380, movieId: 9, movieTitle: 'Человек-паук: Паутина вселенных' }
        ]
    },
    'БумКино': {
        '2026-04-30': [
            { time: '14:00', hall: 'Зал 1', price: 400, movieId: 9, movieTitle: 'Человек-паук: Паутина вселенных' },
            { time: '19:30', hall: 'Зал 2', price: 480, movieId: 10, movieTitle: 'Флэш' },
            { time: '10:30', hall: 'Зал 2', price: 350, movieId: 12, movieTitle: 'Дюна: Часть вторая' }
        ]
    },
    'ПаркКино': {
        '2026-04-28': [
            { time: '15:40', hall: 'Зал Premium', price: 520, movieId: 11, movieTitle: 'Титаник' }
        ],
        '2026-04-29': [
            { time: '12:00', hall: 'Зал 1', price: 440, movieId: 12, movieTitle: 'Дюна: Часть вторая' }
        ]
    },
    'АртиумКино': {
        '2026-04-28': [{ time: '17:00', hall: 'Зал 1', price: 400, movieId: 1, movieTitle: 'Моя собака – космонавт' }],
        '2026-04-30': [
            { time: '16:00', hall: 'Зал C', price: 380, movieId: 9, movieTitle: 'Человек-паук: Паутина вселенных' }
        ]
    },
    'СкайКино Меркурий': { '2026-05-01': [{ time: '12:00', hall: 'Зал 1', price: 420, movieId: 2, movieTitle: 'Твоё сердце будет разбито' }] },
    'Казань': {
        '2026-05-05': [
            { time: '14:00', hall: 'Зал A', price: 390, movieId: 7, movieTitle: 'Джон Уик 4' },
            { time: '14:00', hall: 'Зал B', price: 450, movieId: 8, movieTitle: 'Барби' }
        ],
        '2026-04-30': [{ time: '12:00', hall: 'Зал 1', price: 460, movieId: 12, movieTitle: 'Дюна: Часть вторая' }]
    },
    'Екатеринбург': {
        '2026-05-02': [
            { time: '15:40', hall: 'Зал Premium', price: 520, movieId: 11, movieTitle: 'Титаник' }
        ]
    }
};
