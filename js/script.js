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
          open = document.querySelectorAll('[data-modal]'), //кнопка окрытия модального окна
          modalTimerId = setTimeout(openModal, 300000); //Таймер появления модального окна

    open.forEach(item =>{
        item.addEventListener('click', openModal);
    });
        
    function openModal() { //функция показа модального окна
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; //убирает скролл при открытом модальном окне
        clearInterval(modalTimerId); //очищает интервал если юзер самостоятельно его открыл
    }

    function closeModal() { //функция закрытия модального окна
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; //Ставится по умолчанию браузером
    }
   
    //Обработчик события на закрытие по клику на подложку (вне модального окна) или по кнопке
    modal.addEventListener('click', (e)=>{
        if(e.target === modal || e.target.getAttribute('data-close') == ''){
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
        constructor (src, alt, title, text, price, parentSelector, ...classes){ //Создание конструктора свойств карточки
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.text = text;
            this.price = price;
            this.classes = classes; //rest оператор
            this.parent = document.querySelector(parentSelector); //свойство родитель (элемент родитель в HTML структуре)
            this.transfer = 27; //гривна
            this.changeToUAH(); 
        }
        //метод который переводит доллар в гривну   
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
    }
    // axios 

    axios.get('http://localhost:3000/menu')
        .then(data => createCard(data));

    function createCard(data) {
        data.data.forEach(({img, altimg, title, descr, price}) =>{
            const element = document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML = `
                <img src="${img}" alt="${altimg}">
                <h3 class="menu__item-subtitle">Меню ${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price *= 27}</span> грн/день</div>
                </div>
            `;

            document.querySelector('.menu .container').append(element);
        });
    }

    //forms

    const forms = document.querySelectorAll('form'); // формы

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, мы скоро с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item); //подвязка функции на все формы
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST', //метод передачи данных
            headers: { //заголовки для JSON
                'Content-type' :  'application/json'
            },
            body: data //данные из формы в JSON
        });

        return await res.json();
    };


    function bindPostData(form) { //функция отправки данных с формы
        form.addEventListener('submit', (e) =>{ //обработчик на форму (отправить)
            e.preventDefault(); //убрать дефолтное поведение
            
            //спиннер
            let statusMess = document.createElement('img');
            statusMess.src = message.loading;
            statusMess.style.cssText = `
                display: block;
                margin: 0 auto;            
            `;
            form.insertAdjacentElement('afterend', statusMess);

            const formData = new FormData(form); // объект для передачи данных форм на сервер
            //Собираем все данные с формы в массив массивов, затем преобразуем его в объект и только потом в JSON
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data =>{ //выводим
                console.log(data);
                showThanksModal(message.success);
                statusMess.remove(); //удаление спиннера
            })
            .catch(() =>{ //ошибка
                showThanksModal(message.failure);
            })
            .finally(() =>{ 
                form.reset(); //очистка форм
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog'); //Получаем контент модального окна

        prevModalDialog.classList.add('hide'); //прячем его
        openModal();//вызываем функцию открытия окна

        const thanksModal = document.createElement('div'); //создаем новый контейнер для сообщения
        thanksModal.classList.add('modal__dialog'); //добавляем ему класс обертки контента
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div> 
        `;//верстаем сообщение

        document.querySelector('.modal').append(thanksModal); //добавляем его в модальное окно
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000); //устанавливаем задержку удаления сообщения модального
    }
  

    //slider

    //Получить все элементы для работы
    //Индекс, который определяет слайд
    //написание функции, которая будет показывать слайд

    const slides = document.querySelectorAll('.offer__slide'), //слайды
          prev = document.querySelector('.offer__slider-prev'), //кнопка назад
          next = document.querySelector('.offer__slider-next'), //кнопка вперед 
          total = document.querySelector('#total'), //всего слайдов
          current = document.querySelector('#current'); //текущий слайд

    let index = 1; //индекс слайда
    showSlides(index);//вызов функции для показа первого слайда

    if(slides.length < 10) { //проверка если слайдов меньше 10 то подставить 0 в общее кол-во
        total.textContent  = getZero(slides.length);
    } else {
        total.textContent  = slides.length;
    }

    function showSlides(n){

        if(n>slides.length) {
            index = 1;
        } //проверка на индекс если он равен кол-ву слайдов, то возвращаем его к 1
        
        if(n < 1){ //Обратная ситуация
            index = slides.length;
        }
        //Прячем слайды и показываем только 1 
        slides.forEach(slide => slide.classList.add('hide'));
        slides[index - 1].classList.remove('hide');
        slides[index - 1].classList.add('show');

        //проверка если слайдов меньше 10 то подставить 0 к текущему слайду
        if(slides.length < 10) {
            current.textContent  = getZero(index);
        } else {
            current.textContent  = index;
        }

    }
    //функция которая меняет индекс
    function plusSlide(n) {
        showSlides(index += n);
    }

    prev.addEventListener('click', () =>{
        plusSlide(-1);
    });

    next.addEventListener('click', () =>{
        plusSlide(+1);
    });
});