import "/src/css/style.css";

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn')!;
const mobileMenu = document.getElementById('mobile-menu')!;

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Smooth scroll effect for header
let lastScroll = 0;
const header = document.querySelector('header')!;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('shadow-xl');
    } else {
        header.classList.remove('shadow-xl');
    }

    lastScroll = currentScroll;
});