/**
 * STACKLY REHABILITATION - FORM VALIDATION UTILITIES
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactFormValidation();
  initGenericFormsValidation();
});

function initContactFormValidation() {
  const contactForm = document.getElementById('contact-inquiry-form');
  if (!contactForm) return;

  const fullNameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const programInput = document.getElementById('contact-program');
  const contactMethodInput = document.getElementById('contact-method');
  const messageInput = document.getElementById('contact-message');
  const formSuccessAlert = document.getElementById('contact-form-success');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

  const validateField = (input, condition, errorMsg) => {
    if (!input) return true;
    const group = input.closest('.form-group');
    if (!group) return true;
    let feedback = group.querySelector('.form-feedback');

    if (!condition) {
      input.classList.add('is-invalid');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        group.appendChild(feedback);
      }
      feedback.textContent = errorMsg;
      feedback.style.display = 'block';
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (feedback) feedback.style.display = 'none';
      return true;
    }
  };

  // Real-time blur listeners
  if (fullNameInput) {
    fullNameInput.addEventListener('blur', () => {
      validateField(fullNameInput, fullNameInput.value.trim().length >= 2, 'Please enter your full name (at least 2 characters).');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address.');
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      validateField(phoneInput, phoneRegex.test(phoneInput.value.trim().replace(/\s+/g, '')), 'Please enter a valid phone number (at least 10 digits).');
    });
  }

  if (programInput) {
    programInput.addEventListener('change', () => {
      validateField(programInput, programInput.value !== '', 'Please select a program of interest.');
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      validateField(messageInput, messageInput.value.trim().length >= 10, 'Please enter a short message describing your inquiry (at least 10 characters).');
    });
  }

  // Submit Handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(fullNameInput, fullNameInput && fullNameInput.value.trim().length >= 2, 'Please enter your full name.');
    const isEmailValid = validateField(emailInput, emailInput && emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address.');
    const isPhoneValid = validateField(phoneInput, phoneInput && phoneRegex.test(phoneInput.value.trim().replace(/\s+/g, '')), 'Please enter a valid contact phone number.');
    const isProgramValid = validateField(programInput, programInput && programInput.value !== '', 'Please select a program of interest.');
    const isMessageValid = validateField(messageInput, messageInput && messageInput.value.trim().length >= 10, 'Please provide brief details regarding your inquiry.');

    if (isNameValid && isEmailValid && isPhoneValid && isProgramValid && isMessageValid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validating & Submitting...';
      }

      if (formSuccessAlert) {
        formSuccessAlert.style.display = 'block';
        formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (typeof window.showToast === 'function') {
        window.showToast('Validation successful! Directing to 404 page...', 'success');
      }

      setTimeout(() => {
        window.location.href = '404.html';
      }, 800);
    } else {
      if (typeof window.showToast === 'function') {
        window.showToast('Please correct the highlighted fields before submitting.', 'error');
      }
    }
  });
}

/**
 * Generic validator for any other forms on pages
 * Validates required inputs, then redirects to 404.html
 */
function initGenericFormsValidation() {
  const forms = document.querySelectorAll('form:not(#contact-inquiry-form)');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input, select, textarea');

      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.classList.add('is-invalid');
          isValid = false;
        } else if (input.type === 'email' && input.value.trim() && !emailRegex.test(input.value.trim())) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      });

      if (isValid) {
        if (typeof window.showToast === 'function') {
          window.showToast('Validation successful! Directing to 404 page...', 'success');
        }
        setTimeout(() => {
          window.location.href = '404.html';
        }, 800);
      } else {
        if (typeof window.showToast === 'function') {
          window.showToast('Please fill out all required fields properly.', 'error');
        }
      }
    });
  });
}
