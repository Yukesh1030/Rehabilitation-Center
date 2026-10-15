/**
 * STACKLY REHABILITATION - GLOBAL JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicYear();
  initSmoothScroll();
  initContentLinksRedirect();
});

// Update Copyright Year dynamically
function initDynamicYear() {
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}

// Smooth scrolling for in-page anchors
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Ensure in-page body content links (excluding navbar and footer) on target pages direct to 404.html
function initContentLinksRedirect() {
  const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  const targetPages = ['index.html', 'programs.html', 'our-team.html', 'about.html', 'contact.html', ''];

  if (!targetPages.includes(currentPath)) return;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    // Exclude navbar/header and footer links
    if (anchor.closest('.site-header') || anchor.closest('.site-footer')) {
      return;
    }

    const href = anchor.getAttribute('href');
    if (!href) return;

    // If already 404.html, let browser handle normally
    if (href === '404.html') return;

    // Prevent navigation to other destinations and redirect to 404.html
    if (!href.startsWith('javascript:')) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });
}

// Global Toast System
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.1rem;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
};

