### Имитация оплаты кредитной картой (сборка Webpack).
* При вводе номера карты игноририруются любые символы, кроме цифр.
* Срок действия строго в формате 00/00, где первые 2 цифры — номер месяца, 3-4 цифры — год.
* CVC/CVV строго 3 цифры.
* Email должен быть указан в корректном формате.
* Проверка корректности введённого значения происходит при потере фокуса на поле.
* Кнопка «Оплатить» находится в состоянии disabled до тех пор, пока пользователь корректно не заполнит все поля.

### Библиотеки
* redom
* card-validator
* imask
* just-validate

### Необходимые требования
node.js версия не ниже 22.12.0
npm версия не ниже 10.9.0
При необходимости установить serve
npm install --global serve

### Установка и запуск проекта
1. Склонируйте данный репозиторий к себе на диск.
2. Из директории cardform выполните команду `npm i` для установки
и npm run dev для запуска проекта в режиме отладки.
Затем откройте браузер по адресу http://localhost:8080/.

3. Для создания продакшен проекта остановите сервер отладки командой CTRL+C
(если он был запущен).
4. Из директории cardform выполните команду npm run build.
5. Из директории dist выполните команду npx serve
Затем откройте браузер по адресу http://localhost:3000/.

### Внимание!!!
Директория docs в проекте создана только для демонстрации проекта.
