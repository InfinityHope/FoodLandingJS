window.addEventListener('DOMContentLoaded', ()=>{
    //tabs
    const tabs = document.querySelectorAll('.tabheader__item'), //табы (переключатели)
          tabsContent = document.querySelectorAll('.tabcontent'), //Контент вкладки
          tabsWrapper = document.querySelector('.tabheader__items'); //Обертка табов (для делегирования)


    function hideTabContent() { //Функция скрытия контента
        tabsContent.forEach(item =>{ //Перебираем весь псевдомассив с контентом 
            item.classList.add('hide'); //прячем контент с помощью класса hide
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(tab =>{ //Перебираем весь псевдомассив с табами и убираем класс активности
            tab.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) { //Функция для показа контента под индексом i, который передается в качестве агрумента
        tabsContent[i].classList.add('show', 'fade'); // добавления класса show и анимации fade
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active'); // и добавляем класс активности табу
    }
    //Вызов функций
    hideTabContent();
    showTabContent();

    tabsWrapper.addEventListener('click', (event)=>{ //Делегирование событий на обертку табов
        const target = event.target; //запись target

        if(target && target.classList.contains('tabheader__item')){ //Проверка клика на таб
            tabs.forEach((item, i) =>{ //перебор табов с их индексом
                if(target == item){ //сверяем произошел ли клик именно на таб и вызываем функции скрытия контета и показа
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //timer

    const deadline = '2021-08-10'; // константа окончания таймера

    function getTimeRemaning(endtime) { //функция которая получает разницу между текущим временем и дедлайном
        const t = Date.parse(endtime) - new Date(), //получаем разницу между датами в милисекундах 
              days = Math.floor(t / (1000 * 60 * 60 * 24)), //вычисляем дни
              hours = Math.floor((t / (1000 * 60 * 60) % 24)), //вычисляем часы
              minutes = Math.floor((t / 1000 / 60) % 60),  //вычисляем минуты
              seconds = Math.floor((t / 1000) % 60);  //вычисляем секунды
        //возвращаем переменные в виде объекта
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
    //функция для добавления нуля перед число если оно меньше 10
    function getZero(num){
        if(num >= 0 && num < 10){ //если больше нуля и меньше 10
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) { //функция установки таймера на страницу 
        const timer = document.querySelector(selector), //получение таймера со страницы
              days = timer.querySelector('#days'), //дни
              hours = timer.querySelector('#hours'), //часы
              minutes = timer.querySelector('#minutes'), //минуты
              seconds= timer.querySelector('#seconds'), //секунды
              timeInterval = setInterval(updateClock, 1000); //обновление таймера каждую секунду

        updateClock(); //Вызов функции чтобы не было задержки на странице в 1 секунду

        function updateClock() { //для обновления даты
            const t = getTimeRemaning(endtime); //получение объекта

            days.innerHTML = getZero(t.days); //Вывод дней
            hours.innerHTML = getZero(t.hours); //Вывод часов
            minutes.innerHTML = getZero(t.minutes); //Вывод минут
            seconds.innerHTML = getZero(t.seconds); //Вывод секунд
            //если дедлайн наступил, то очистить интервал
            if(t.total <= 0){
                clearInterval(timeInterval);
            }
        }   
    }
    //Вызов таймера
    setClock('.timer', deadline);


    //Modal

    const modal = document.querySelector('.modal'), //обертка модального окна
          close = document.querySelector('[data-close]'), //кнопка закрытия модального окна
          open = document.querySelectorAll('[data-modal]'), //кнопка окрытия модального окна
          modalTimerId = setTimeout(openModal, 3000); //Таймер появления модального окна
        
    function openModal() { //функция показа модального окна
        modal.classList.toggle('show');
        document.body.style.overflow = 'hidden'; //убирает скролл при открытом модальном окне
        clearInterval(modalTimerId); //очищает интервал если юзер самостоятельно его открыл
    }

    function closeModal() { //функция закрытия модального окна
        modal.classList.toggle('show');
        document.body.style.overflow = ''; //Ставится по умолчанию браузером
    }
    //обработчики события
    open.forEach(item =>{
        item.addEventListener('click', openModal);
    });
    close.addEventListener('click', closeModal);
    
    //Обработчик события на закрытие по клику на подложку (вне модального окна)
    modal.addEventListener('click', (e)=>{
        if(e.target === modal){
            closeModal();
        }
    });
    //Для закрытия по клавише ESC
    document.addEventListener('keydown', (e)=>{
        if(e.code === "Escape" && modal.classList.contains('show')){
            closeModal();
        }
    });
    //функция показа окна при завершении скролла сайта
    function showModalByScroll(){
        //Проверка что пользователь отлистал весь контент
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll', showModalByScroll());//удаление обработчика события по завершении скролла
        }
    }
    //Показ по завершении скролла
    window.addEventListener('scroll', showModalByScroll());


    //Class Card

    //Создание класса карточки
    class Card {
        constructor (src, alt, title, text, price, parentSelector){ //Создание конструктора свойств карточки
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.text = text;
            this.price = price;
            this.parent = document.querySelector(parentSelector); //свойство родитель (элемент родитель в HTML структуре)
            this.transfer = 27; //гривна
            this.changeToUAH(); 
        }
        //метод который переводит доллар в гривну   
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        //Метод который рендерит карточку на страницу
        render() {
            const element = document.createElement('div'); //создание элемента
            element.classList.add('menu__item'); //класс элемента
            element.innerHTML = `
                    <img src="${this.src}" alt="${this.alt}">
                    <h3 class="menu__item-subtitle">Меню ${this.title}</h3>
                    <div class="menu__item-descr">${this.text}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                `; //Наполнение контентом с подставлением свойств класса
            this.parent.append(element); //вставка элемента в родителя
        }
    }

    //создание объектов класса (новых карточек)
    new Card(
        "img/tabs/vegy.jpg", 
        "vegy", 
        '"Фитнес"', 
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
    ).render();
    new Card(
        "img/tabs/elite.jpg", 
        "elite", 
        '"Премиум"', 
        'В меню "Премиум" мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        5,
        ".menu .container"
    ).render();
    new Card(
        "img/tabs/post.jpg", 
        "post", 
        '"Постное"', 
        'Меню "Постное" - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        7,
        ".menu .container"
    ).render();
});