function slider () {
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
        total.textContent  = `0${slides.length}`;
        current.textContent = `0${index}`;
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
            currentSlide.textContent = `0${index}`;
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
}

module.exports = slider;