function tabs() {
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
}

module.exports = tabs;