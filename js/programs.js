/**
 * STACKLY REHABILITATION - PROGRAMS CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initFAQAccordions();
  initProgramNavScroll();
});

// FAQ Accordion Toggle
function initFAQAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('is-active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('is-active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

// Support anchor jumping from other pages with correct offset
function initProgramNavScroll() {
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      const target = document.querySelector(hash);
      if (target) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const targetRect = target.getBoundingClientRect().top;
        const targetPosition = targetRect - bodyRect - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 200);
  }
}
