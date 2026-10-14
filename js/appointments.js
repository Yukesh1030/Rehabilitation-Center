/**
 * STACKLY REHABILITATION - APPOINTMENT & ASSESSMENT BOOKING WIZARD
 * Prototype with step validation, sample availability, confirmation state,
 * and demonstration rescheduling/cancellation workflows.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingWizard();
});

function initBookingWizard() {
  const wizardContainer = document.querySelector('.booking-wizard-wrapper');
  if (!wizardContainer) return;

  let currentStep = 1;
  const totalSteps = 5;

  // State object
  const bookingData = {
    program: 'Physical Rehabilitation',
    therapist: 'Dr. Sarah Jenkins (PT, DPT)',
    date: '',
    timeSlot: '',
    fullName: '',
    email: '',
    phone: '',
    notes: '',
    bookingId: ''
  };

  // Pre-fill from query params if any
  const urlParams = new URLSearchParams(window.location.search);
  const paramTherapist = urlParams.get('therapist');
  const paramProgram = urlParams.get('program');

  // Step Elements
  const stepNodes = document.querySelectorAll('.wizard-step-node');
  const stepPanes = document.querySelectorAll('.wizard-step-pane');
  const btnPrev = document.getElementById('wizard-btn-prev');
  const btnNext = document.getElementById('wizard-btn-next');

  // Program selection cards
  const programCards = document.querySelectorAll('.program-select-card');
  programCards.forEach(card => {
    if (paramProgram && card.getAttribute('data-value').toLowerCase().includes(paramProgram.toLowerCase())) {
      selectProgram(card);
    }
    card.addEventListener('click', () => selectProgram(card));
  });

  function selectProgram(card) {
    programCards.forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    bookingData.program = card.getAttribute('data-value');
  }

  // Therapist selection cards
  const therapistCards = document.querySelectorAll('.therapist-select-card');
  therapistCards.forEach(card => {
    if (paramTherapist && card.getAttribute('data-value').toLowerCase().includes(paramTherapist.toLowerCase())) {
      selectTherapist(card);
    }
    card.addEventListener('click', () => selectTherapist(card));
  });

  function selectTherapist(card) {
    therapistCards.forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    bookingData.therapist = card.getAttribute('data-value');
  }

  // Time slot pills
  const timePills = document.querySelectorAll('.time-slot-pill');
  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      timePills.forEach(p => p.classList.remove('is-selected'));
      pill.classList.add('is-selected');
      bookingData.timeSlot = pill.getAttribute('data-time');
    });
  });

  // Date input
  const dateInput = document.getElementById('booking-date-input');
  if (dateInput) {
    // Set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minStr = tomorrow.toISOString().split('T')[0];
    dateInput.min = minStr;
    dateInput.value = minStr;
    bookingData.date = minStr;

    dateInput.addEventListener('change', (e) => {
      bookingData.date = e.target.value;
    });
  }

  // Update Wizard View
  function updateWizardView() {
    // Update Node indicators
    stepNodes.forEach((node, index) => {
      const stepNum = index + 1;
      node.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        node.classList.add('active');
      } else if (stepNum < currentStep) {
        node.classList.add('completed');
      }
    });

    // Update Panes
    stepPanes.forEach(pane => {
      const paneStep = parseInt(pane.getAttribute('data-step'), 10);
      if (paneStep === currentStep) {
        pane.classList.add('is-active');
      } else {
        pane.classList.remove('is-active');
      }
    });

    // Navigation buttons state
    if (btnPrev) {
      btnPrev.style.visibility = currentStep === 1 || currentStep > totalSteps ? 'hidden' : 'visible';
    }

    if (btnNext) {
      if (currentStep === totalSteps) {
        btnNext.textContent = 'Confirm Booking';
        btnNext.className = 'btn btn-accent btn-lg';
      } else if (currentStep > totalSteps) {
        btnNext.style.display = 'none';
        if (btnPrev) btnPrev.style.display = 'none';
      } else {
        btnNext.textContent = 'Continue';
        btnNext.className = 'btn btn-primary';
        btnNext.style.display = 'inline-flex';
      }
    }

    // Populate review summary at step 5
    if (currentStep === 5) {
      populateSummary();
    }
  }

  function validateStep(step) {
    if (step === 1) {
      if (!bookingData.program) {
        window.showToast('Please select a rehabilitation program to continue.', 'error');
        return false;
      }
    } else if (step === 2) {
      if (!bookingData.therapist) {
        bookingData.therapist = 'First Available Specialist';
      }
    } else if (step === 3) {
      if (!bookingData.date) {
        window.showToast('Please pick a date for your assessment.', 'error');
        return false;
      }
      if (!bookingData.timeSlot) {
        // default select first
        const firstSlot = document.querySelector('.time-slot-pill');
        if (firstSlot) {
          firstSlot.click();
        } else {
          window.showToast('Please select an available time slot.', 'error');
          return false;
        }
      }
    } else if (step === 4) {
      const nameInp = document.getElementById('book-name');
      const emailInp = document.getElementById('book-email');
      const phoneInp = document.getElementById('book-phone');
      const notesInp = document.getElementById('book-notes');

      if (!nameInp || !nameInp.value.trim()) {
        nameInp && nameInp.classList.add('is-invalid');
        window.showToast('Please enter your full name.', 'error');
        return false;
      } else {
        nameInp.classList.remove('is-invalid');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInp || !emailRegex.test(emailInp.value.trim())) {
        emailInp && emailInp.classList.add('is-invalid');
        window.showToast('Please enter a valid email address.', 'error');
        return false;
      } else {
        emailInp.classList.remove('is-invalid');
      }

      if (!phoneInp || phoneInp.value.trim().length < 8) {
        phoneInp && phoneInp.classList.add('is-invalid');
        window.showToast('Please enter a valid contact phone number.', 'error');
        return false;
      } else {
        phoneInp.classList.remove('is-invalid');
      }

      bookingData.fullName = nameInp.value.trim();
      bookingData.email = emailInp.value.trim();
      bookingData.phone = phoneInp.value.trim();
      bookingData.notes = notesInp ? notesInp.value.trim() : '';
    }

    return true;
  }

  function populateSummary() {
    const sumProgram = document.getElementById('sum-program');
    const sumTherapist = document.getElementById('sum-therapist');
    const sumDateTime = document.getElementById('sum-datetime');
    const sumPatient = document.getElementById('sum-patient');
    const sumContact = document.getElementById('sum-contact');

    if (sumProgram) sumProgram.textContent = bookingData.program;
    if (sumTherapist) sumTherapist.textContent = bookingData.therapist;
    if (sumDateTime) sumDateTime.textContent = `${bookingData.date} at ${bookingData.timeSlot}`;
    if (sumPatient) sumPatient.textContent = bookingData.fullName;
    if (sumContact) sumContact.textContent = `${bookingData.email} • ${bookingData.phone}`;
  }

  // Next / Continue button
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;

      if (currentStep === totalSteps) {
        // Complete Booking
        finishBooking();
      } else {
        currentStep++;
        updateWizardView();
        wizardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Previous button
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardView();
        wizardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function finishBooking() {
    const randomId = 'STK-' + Math.floor(100000 + Math.random() * 900000);
    bookingData.bookingId = randomId;

    // Show Confirmation Pane
    currentStep = 6;
    updateWizardView();

    const confIdEl = document.getElementById('conf-booking-id');
    const confDetailsEl = document.getElementById('conf-details');

    if (confIdEl) confIdEl.textContent = randomId;
    if (confDetailsEl) {
      confDetailsEl.innerHTML = `
        <strong>Program:</strong> ${bookingData.program}<br>
        <strong>Specialist:</strong> ${bookingData.therapist}<br>
        <strong>Date & Time:</strong> ${bookingData.date} at ${bookingData.timeSlot}<br>
        <strong>Patient:</strong> ${bookingData.fullName} (${bookingData.email})
      `;
    }

    window.showToast('Assessment appointment successfully scheduled!', 'success');
  }

  // Demonstration Reschedule & Cancel actions
  const btnRescheduleDemo = document.getElementById('btn-reschedule-demo');
  const btnCancelDemo = document.getElementById('btn-cancel-demo');

  if (btnRescheduleDemo) {
    btnRescheduleDemo.addEventListener('click', () => {
      currentStep = 3; // jump back to date & time step
      updateWizardView();
      window.showToast('Please select a new date and time slot for your appointment.', 'info');
    });
  }

  if (btnCancelDemo) {
    btnCancelDemo.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel this scheduled assessment demonstration?')) {
        currentStep = 1;
        updateWizardView();
        window.showToast('Appointment demonstration cancelled.', 'info');
      }
    });
  }

  // Initialize view
  updateWizardView();
}
