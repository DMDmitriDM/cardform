import icon from '../assets/images/icon.ico';
import { objImg } from './images.js';

import { el, setChildren, mount, setAttr } from 'redom';
import IMask from 'imask';
import JustValidate from 'just-validate';
import valid from 'card-validator';

export default function createPage() {
  const linkIcon = document.createElement('link');
  linkIcon.rel = 'icon';
  linkIcon.type = 'image/x-icon';
  linkIcon.href = icon;
  document.head.append(linkIcon);

  // ---------------------------------------- //

  const container = el('div.container');
  const box = el('div.box.box--set');
  const boxTitle = el('h1.box__title', 'Заполните форму для оплаты');
  const formCard = el('form.form--set', {
    id: 'id-form',
    autocomplete: 'off',
    novalidate: '',
  });

  mount(box, boxTitle);
  mount(box, formCard);

  setChildren(container, box);
  setChildren(document.body, container);

  // ---------------------------------------- //

  const formBoxInput = el('div.form__box-inputs');

  const boxInputNumber = el('div.form__box-input');
  const boxInputDate = el('div.form__box-input');
  const boxInputCvc = el('div.form__box-input');
  const boxInputEmail = el('div.form__box-input');

  const titleNumber = el('span.form__box-title', 'Номер карты:');
  const inputNumber = el('input.form__input', {
    type: 'text',
    name: 'number',
    id: 'id-number',
  });

  const titleDate = el('span.form__box-title', 'Срок:');
  const inputDate = el('input.form__input', {
    type: 'text',
    name: 'date',
    id: 'id-date',
  });

  const titleCvc = el('span.form__box-title', 'CVC/CVV:');
  const inputCvc = el('input.form__input', {
    type: 'text',
    name: 'cvc',
    id: 'id-cvc',
  });

  const titleEmail = el('span.form__box-title', 'Email:');
  const inputEmail = el('input.form__input', {
    type: 'text',
    name: 'email',
    id: 'id-email',
    autocomplete: 'off',
  });

  mount(boxInputNumber, titleNumber);
  mount(boxInputDate, titleDate);
  mount(boxInputCvc, titleCvc);
  mount(boxInputEmail, titleEmail);

  mount(boxInputNumber, inputNumber);
  mount(boxInputDate, inputDate);
  mount(boxInputCvc, inputCvc);
  mount(boxInputEmail, inputEmail);

  mount(formBoxInput, boxInputNumber);
  mount(formBoxInput, boxInputDate);
  mount(formBoxInput, boxInputCvc);
  mount(formBoxInput, boxInputEmail);

  // ---------------------------------------- //

  const formBoxPicture = el('div.form__box-picture');
  const formBoxImgWrap = el('div.form__img-wrap');
  const formBoxImg = el('img.form__img.img-max');

  formBoxImg.style.opacity = 0;
  formBoxImg.src = objImg.card;
  formBoxImg.alt = 'card';

  mount (formBoxImgWrap, formBoxImg);
  mount (formBoxPicture, formBoxImgWrap);

  // ---------------------------------------- //

  const formBoxBtn = el('div.form__box-btn');
  const formBtn = el('button.form__btn.btn-reset', 'Оплатить', {
    type: 'button',
    disabled: true,
  });

  mount(formBoxBtn, formBtn);

  // ---------------------------------------- //

  mount(formCard, formBoxInput);
  mount(formCard, formBoxPicture);
  mount(formCard, formBoxBtn);

  // ---------------------------------------- //
  // ---------------------------------------- //
  // ---------------------------------------- //

  const inputNumberMask = IMask(inputNumber, {
    mask: 'XXXX XXXX XXXX XXXX[ XX]',
    autofix: true,
    blocks: {
      X: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 9,
        maxLength: 1,
      },
    },
  });

  IMask(inputDate, {
    mask: 'MM/YY',
    autofix: true,
    blocks: {
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
      },
      YY: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 99,
        maxLength: 2,
      },
    },
  });

  IMask(inputCvc, {
    mask: 'CVC',
    autofix: true,
    blocks: {
      CVC: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 999,
        maxLength: 3,
      },
    },
  });

  IMask(inputEmail, {
    mask: /^[-0-9A-Za-z_@\.]+$/,
    autofix: true,
  });

  // ---------------------------------------- //

  const validation = new JustValidate('#id-form', {
    focusInvalidField: false,
  });

  validation

    .addField('#id-number', [{
      rule: 'required',
      errorMessage: 'Вы не ввели номер!',
    },
    {
      validator: () => {
        const number = inputNumberMask.unmaskedValue;

        if (number.length < 12) {
          return false;
        }

        const numberValidation = valid.number(number);
        if (!numberValidation.isValid) {
          return false;
        }

        if (numberValidation.card) {
          cardType = numberValidation.card.type;
        }

        return true;
      },
      errorMessage: 'Не верный номер!',
    }])

    .addField('#id-date', [{
      rule: 'required',
      errorMessage: 'ММ/ГГ',
    },
    {
      rule: 'minLength',
      value: 5,
      errorMessage: 'ММ/ГГ',
    },
    {
      validator: (value) => {
        if (value.length < 5) {
          return false;
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = Number(String(currentDate.getFullYear()).slice(-2));

        const [month, year] = value.split('/');

        if (currentYear > Number(year) || (currentYear === Number(year) && currentMonth >= Number(month))) {
          return false;
        }

        return true;
      },
      errorMessage: 'Истёк',
    }])

    .addField('#id-cvc', [{
      rule: 'required',
      errorMessage: '3 цифры',
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: '3 цифры',
    }])

    .addField('#id-email', [{
      rule: 'required',
      errorMessage: 'Вы не ввели email',
    },
    {
      rule: 'customRegexp',
      value: /^[-0-9A-Za-z_\.]+@[-0-9A-Za-z]+\.[a-z]{2,6}$/i,
      errorMessage: 'Не корректный email',
    }]);

  // ---------------------------------------- //

    const objError = {
      number: false,
      date: false,
      cvc: false,
      email: false,
    };

    let cardType = '';

  // ---------------------------------------- //

  formCard.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  const arrInputs = document.querySelectorAll('.form__input');
  for (const input of arrInputs) {
    input.addEventListener('blur', () => {
      validation.revalidateField(`#${input.id}`).then((isValid) => {

        objError[input.name] = isValid;
        changeFormBtn();
        changeFormImg();
      });
    });

    input.addEventListener('input', () => {
      validation.revalidateField(`#${input.id}`).then((isValid) => {
        validation.showErrors({ [`#${input.id}`]: '' });

        objError[input.name] = isValid;
        changeFormBtn();
        changeFormImg();
      });
    });
  }

  function changeFormBtn() {
    for (const key in objError) {
      if (!objError[key]) {
        setAttr(formBtn, {
          disabled: true,
        });

        return;
      }
    }

    setAttr(formBtn, {
      disabled: false,
    });
  }

  function changeFormImg() {
    if (objError.number) {
      if (formBoxImg.src === objImg[cardType]) {
        formBoxImg.style.opacity = 1;
        return;
      }

      formBoxImg.src = objImg[cardType];
      formBoxImg.alt = cardType;

      formBoxImg.onerror = () => {
        formBoxImg.src = objImg.card;
        formBoxImg.alt = 'card';
      };

      formBoxImg.style.opacity = 1;
    } else {
      formBoxImg.style.opacity = 0;
    }
  }
}
