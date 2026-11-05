// кнопка меню
const toggle = document.querySelector('.menu-button');
const nav = document.querySelector('#nav');

// слушаем событие клика и меняем отображение меню
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';

  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});

// при нажатии кнопки esc закрываем меню
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
});

const filterButtons = document.querySelectorAll('[data-filter]');
const entries = document.querySelectorAll('[data-type]');
const counter = document.querySelector('#count');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const chosen = button.dataset.filter;

    // Выделение нажатой кнопки
    filterButtons.forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });

    // Показываем только записи подходящего
    let count = 0;

    entries.forEach(entry => {
      entry.hidden = chosen !== 'Все' && entry.dataset.type !== chosen;

      if (!entry.hidden) {
        count++;
      }
    });

    counter.textContent = `Показано занятий: ${count}`;
  });
});


// Кнопка назад
document.querySelectorAll('.crumbs__back').forEach(link => {
  link.addEventListener('click', event => {
    const cameFromThisSite = document.referrer
      && new URL(document.referrer).origin === location.origin
      && history.length > 1;

    if (cameFromThisSite) {
      event.preventDefault();
      history.back();
    }
  });
});


// Кнопка наверх, появляется когда прокручено хотя бы 60%
const toTop = document.querySelector('.to-top');

if (toTop) {
  addEventListener('scroll', () => {
    toTop.classList.toggle('is-visible', scrollY > innerHeight * 0.6);
  }, { passive: true });
}
