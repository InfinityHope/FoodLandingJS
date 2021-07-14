function forms() {
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
}

module.exports = forms;