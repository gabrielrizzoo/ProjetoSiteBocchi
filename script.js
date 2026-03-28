const mobileBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.main-nav');
const icon = mobileBtn.querySelector('span');

mobileBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    icon.textContent = nav.classList.contains('active') ? 'close' : 'menu';
});