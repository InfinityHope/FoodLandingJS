function calc() {
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
}

module.exports = calc;