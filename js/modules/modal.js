function modal() {
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

}

module.exports = modal;