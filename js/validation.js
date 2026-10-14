/**
 * STACKLY REHABILITATION - FORM VALIDATION UTILITIES
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactFormValidation();
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
    const group = input.closest('.form-group');
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

    const isNameValid = validateField(fullNameInput, fullNameInput.value.trim().length >= 2, 'Please enter your full name.');
    const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address.');
    const isPhoneValid = validateField(phoneInput, phoneRegex.test(phoneInput.value.trim().replace(/\s+/g, '')), 'Please enter a valid contact phone number.');
    const isProgramValid = validateField(programInput, programInput.value !== '', 'Please select a program of interest.');
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10, 'Please provide brief details regarding your inquiry.');

    if (isNameValid && isEmailValid && isPhoneValid && isProgramValid && isMessageValid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...';
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Inquiry';
        }
        if (formSuccessAlert) {
          formSuccessAlert.style.display = 'block';
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        window.showToast('Thank you! Your assessment request has been received. Our clinical coordinator will contact you shortly.', 'success');
      }, 1000);
    } else {
      window.showToast('Please correct the highlighted fields before submitting.', 'error');
    }
  });
}
