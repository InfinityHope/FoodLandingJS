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
    
    window.addEventListener('scroll', showModalByScroll()); //Показ по завершении скролла

    // axios и создание карточек

    axios.get('http://localhost:3000/menu')
        .then(data => createCard(data));

    function createCard(data) {
        data.data.forEach(({img, altimg, title, descr, price}) =>{
            const element = document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML = `
                <img src="${img}" alt="${altimg}">
                <h3 class="menu__item-subtitle">${title}</h3>
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
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'), //кнопка назад
          next = document.querySelector('.offer__slider-next'), //кнопка вперед 
          total = document.querySelector('#total'), //всего слайдов
          current = document.querySelector('#current'),//текущий слайд
          slidesWrapper = document.querySelector('.offer__slider-wrapper'), //Обертка всего слайдера
          slidesField = document.querySelector('.offer__slider-inner'), //Обертка слайдов
          width = window.getComputedStyle(slidesWrapper).width; //Ширина обертки слайдера

    let index = 1,//индекс слайда
        offset = 0; //Переменная по которой сдвигается слайдер

    if(slides.length < 10) { //проверка если слайдов меньше 10 то подставить 0 в общее кол-во
        total.textContent  = getZero(slides.length);
        current.textContent = getZero(index);
    } else {
        total.textContent  = slides.length;
        current.textContent = index;
    }

    slidesField.style.width = 100 * slides.length + '%'; //Устанавливаем ширину обертки по всем слайдам
    slidesField.style.display = 'flex'; //Выставляем флекс для обертки
    slidesField.style.transition = '0.5s'; //задержка

    slidesWrapper.style.overflow = 'hidden'; //прямчем все что вне обертки

    slides.forEach(slide => {
        slide.style.width = width; //Фиксированная ширина для всех слайдов по ширине обертки 
    });

    slider.style.position = 'relative';
    
    const indicators = document.createElement('ol'), //Массив точек и список
          dots = [];

    indicators.classList.add('carousel-dots');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators); //добавление точек к слайдеру

    for (let i = 0; i < slides.length; i++){
        const dot = document.createElement('li'); //создание точек по кол-ву слайдов
        dot.setAttribute('data-slide-to', i + 1); //установка аттрибута (слайд = точка)
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if(i == 0) {
            dot.style.opacity = 1; //Для первой точки opacity 1 при загрузке стр
        }
        indicators.append(dot); //аппендим точки 
        dots.push(dot); //заносим их в массив для дальнейшей работы с ними
    }
    //Функция нуля перед индексом
    const  indexZero = (currentSlide) =>{
        if(slides.length < 10){
            currentSlide.textContent = getZero(index);
        } else {
            currentSlide.textContent = index;
        }
    };
    //изменение стиля точек при выбранном слайде
    const dotOpacityTo = () => {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[index - 1].style.opacity = 1;
    };

    const deleteNotDigits = str => +str.replace(/\D/g, '');

    next.addEventListener('click', ()=> {
        if(offset == deleteNotDigits(width) * (slides.length   - 1)){ //если дошел до последнего слайда, к началу
            offset = 0;
        } else { 
            offset += deleteNotDigits(width); //прибавляем к offset ширину слайда
        }
        slidesField.style.transform = `translateX(-${offset}px)`; //смещаем его по переменной offset

        if(index == slides.length){ //если индекс будет равен последнему слайду
            index = 1; //выставляем его в 1
        } else {
            index++; //иначе прибавляем
        }

        indexZero(current);
        dotOpacityTo();
    });
    //аналогично, но с другими условиями
    prev.addEventListener('click', ()=> {
        if(offset == 0){
            offset = deleteNotDigits(width) * (slides.length   - 1);
        } else {
            offset -= deleteNotDigits(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(index == 1){
            index = slides.length;
        } else {
            index--;
        }

        indexZero(current);
        dotOpacityTo();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to'); //получаем объект события и его аттрибут

            index = slideTo; //Записываем его в индекс
            offset = deleteNotDigits(width) * (slideTo   - 1); //изменяем оффсет и сдвигаем слайд и меняем точку

            slidesField.style.transform = `translateX(-${offset}px)`;

            indexZero(current);
            dotOpacityTo();
        });
    });

    //Calculator

    const res = document.querySelector('.calculating__result span'); //результат
    let sex, height, weight, age, ratio;

    //Функция проверки значений из LocalStorage
    const checkLocalValues = (variable, key, value) => {
        if(localStorage.getItem(`${key}`)){
            variable = localStorage.getItem(`${key}`); //если лежит то записать в переменную
        } else {//если нет то выставить по умолчанию
            variable = `${value}`;
            localStorage.setItem(`${key}`, `${value}`);
        }
    };
   
    checkLocalValues(sex, 'sex', 'female');
    checkLocalValues(ratio, 'ratio', 1.375);


    //Выгрузка значений из LocalStorage
    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector); //Получаем элемент

        elements.forEach(elem => {
            elem.classList.remove(activeClass); //Убираем класс актив у всех
            if(elem.getAttribute('id') === localStorage.getItem('sex')){
                elem.classList.add(activeClass); //добавляем класс активности у того, которое прописано в LocalStorage
            }
            if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                elem.classList.add(activeClass); //добавляем класс активности у того, которое прописано в LocalStorage
            }
        });
    }
    
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    //функция подсчета
    const calcTotal = () => {
        if(!sex || !height || !weight || !age || !ratio) {
            res.textContent = '____';
            return;
        } //если ничего не выбрано не запускать код дальше
        //рассчет по формулам в зависимости от пола
        if(sex === 'female') {
            res.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            res.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    };

    calcTotal();
    //получение информации
    const getStaticInfo = (selector, activeClass) => {
        const elems = document.querySelectorAll(`${selector}`); //получение элементов 

        elems.forEach(elem => {
            elem.addEventListener('click', (e) => {
                const value = e.target; //объект события
                if(value.getAttribute('data-ratio')){ 
                    ratio = +value.getAttribute('data-ratio'); //получаем коэф активности
                    localStorage.setItem('ratio', +value.getAttribute('data-ratio')); //запись в локалСтор
                } else {
                    sex = value.getAttribute('id'); //получаем пол
                    localStorage.setItem('sex', value.getAttribute('id')); //запись в локалСтор
                }
    
                elems.forEach(elem => {
                    elem.classList.remove(activeClass); //убираем класс актив у всех не выбранных элементов
                });
    
                value.classList.add(activeClass); //добавляем выбранному
                
                calcTotal(); //считаем
            });
        });
              
    };

    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');


    const getDynamicInfo = (selector) => { //получение динамических данных из инпутов
        const input = document.querySelector(selector); //Получаем инпут
        
        input.addEventListener('input', () => { //обработчик на изменение в инпуте

            if(input.value.match(/\D/g)){
                input.style.border = '2px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')){ //проверяем id инпута и присваиваем переменным значение этого инпута
                case 'height':
                    height = +input.value; 
                    break;
                case 'weight':
                    weight = +input.value; 
                    break;
                case 'age':
                    age = +input.value; 
                    break;
            }
            calcTotal(); //считаем
        });
        
    };

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
});