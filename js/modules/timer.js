function timer() {
    
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
}

module.exports = timer;