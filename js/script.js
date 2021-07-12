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

    const deadline = '2021-08-10';

    function getTimeRemaning(endtime) {
        const t = Date.parse(endtime) - new Date(),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);
        
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if(num >= 0 && num < 10){
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds= timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaning(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0){
                clearInterval(timeInterval);
            }
        }   
    }

    setClock('.timer', deadline);
});