/**
 * STACKLY REHABILITATION - AUTHENTICATION CONTROLLER (LOGIN & SIGNUP)
 * Implements validation, password visibility toggling, GSAP entrances,
 * and role-based routing (Admin -> AdminDashboard.html, Client -> PatientDashboard.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initLoginForm();
  initSignupForm();
  initAuthAnimations();
});

// GSAP Entrance for Login & Signup Cards
function initAuthAnimations() {
  if (typeof gsap !== 'undefined') {
    gsap.fromTo('.auth-card-container', 
      { opacity: 0, y: 30, scale: 0.98 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo('.auth-header-top', 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' }
    );
  }
}

// Password Visibility Toggle
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.btn-toggle-password');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-with-icon').querySelector('input');
      const icon = btn.querySelector('i');
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      } else {
        input.type = 'password';
        if (icon) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });
}

// Login Form Handling
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  const roleSelect = document.getElementById('login-role');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit-btn');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showError = (input, msg) => {
    input.classList.add('is-invalid');
    const group = input.closest('.form-group');
    let feedback = group.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'form-feedback';
      group.appendChild(feedback);
    }
    feedback.textContent = msg;
    feedback.style.display = 'block';
  };

  const clearError = (input) => {
    input.classList.remove('is-invalid');
    const group = input.closest('.form-group');
    const feedback = group.querySelector('.form-feedback');
    if (feedback) feedback.style.display = 'none';
  };

  emailInput && emailInput.addEventListener('input', () => clearError(emailInput));
  passwordInput && passwordInput.addEventListener('input', () => clearError(passwordInput));

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value;
    const roleVal = roleSelect.value;

    if (!emailVal) {
      showError(emailInput, 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!passVal) {
      showError(passwordInput, 'Please enter your password.');
      isValid = false;
    } else if (passVal.length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters.');
      isValid = false;
    }

    if (isValid) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

      // Store active session in localStorage
      localStorage.setItem('stackly_user_email', emailVal);
      localStorage.setItem('stackly_user_role', roleVal);

      setTimeout(() => {
        window.showToast(`Welcome back! Redirecting to ${roleVal} Dashboard...`, 'success');

        setTimeout(() => {
          if (roleVal === 'Admin') {
            window.location.href = 'AdminDashboard.html';
          } else {
            // Client / Patient
            window.location.href = 'PatientDashboard.html';
          }
        }, 800);
      }, 1000);
    }
  });
}

// Signup Form Handling
function initSignupForm() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;

  const roleSelect = document.getElementById('signup-role');
  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');
  const submitBtn = document.getElementById('signup-submit-btn');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showError = (input, msg) => {
    input.classList.add('is-invalid');
    const group = input.closest('.form-group');
    let feedback = group.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'form-feedback';
      group.appendChild(feedback);
    }
    feedback.textContent = msg;
    feedback.style.display = 'block';
  };

  const clearError = (input) => {
    input.classList.remove('is-invalid');
    const group = input.closest('.form-group');
    const feedback = group.querySelector('.form-feedback');
    if (feedback) feedback.style.display = 'none';
  };

  nameInput && nameInput.addEventListener('input', () => clearError(nameInput));
  emailInput && emailInput.addEventListener('input', () => clearError(emailInput));
  passwordInput && passwordInput.addEventListener('input', () => clearError(passwordInput));

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value;

    if (!nameVal || nameVal.length < 2) {
      showError(nameInput, 'Please enter your full name (minimum 2 characters).');
      isValid = false;
    }

    if (!emailVal || !emailRegex.test(emailVal)) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!passVal || passVal.length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters.');
      isValid = false;
    }

    if (isValid) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';

      setTimeout(() => {
        window.showToast('Account successfully created! Please log in.', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
      }, 1000);
    }
  });
}
