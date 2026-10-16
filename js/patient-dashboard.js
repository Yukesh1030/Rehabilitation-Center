/**
 * STACKLY REHABILITATION - PATIENT DASHBOARD CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicPatientProfile();
  initSidebarBrandLogo();
  initPatientSidebar();
  initMilestoneToggles();
  initRescheduleDemo();
  initPatientAppointments();
  initPatientRecoveryPlan();
  initPatientResources();
  initPatientSupport();

  // Route URL hash on initial page load
  handleUrlHash();
});

// URL Hash Routing Support
function handleUrlHash() {
  const hash = window.location.hash || '#dashboard';
  const hashMap = {
    '#dashboard': 'view-patient-dash',
    '#appointments': 'view-patient-appts',
    '#recovery-plan': 'view-patient-plan',
    '#progress-resources': 'view-patient-resources',
    '#support': 'view-patient-support'
  };

  const targetViewId = hashMap[hash];
  if (!targetViewId) return;

  const targetView = document.getElementById(targetViewId);
  const targetLink = document.querySelector(`.dash-nav-item a[href="${hash}"]`);

  if (targetView) {
    document.querySelectorAll('.dash-view-section').forEach(v => {
      v.style.display = 'none';
    });
    targetView.style.display = 'block';

    if (targetLink) {
      document.querySelectorAll('.dash-nav-item a').forEach(l => l.classList.remove('active'));
      targetLink.classList.add('active');
    }

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

window.addEventListener('hashchange', handleUrlHash);

// Helper: Format friendly display name from email address
function formatNameFromEmail(email) {
  if (!email) return 'User';
  const prefix = email.includes('@') ? email.split('@')[0] : email;
  const cleaned = prefix.replace(/[._\-+]/g, ' ').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (!words.length) return 'User';
  return words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Helper: Calculate uppercase initials from name
function getInitials(name) {
  if (!name) return 'U';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Dynamic User Profile for Patient Portal
function initDynamicPatientProfile() {
  const storedEmail = localStorage.getItem('stackly_user_email');
  let userName = localStorage.getItem('stackly_user_name');

  if (!userName && storedEmail) {
    userName = formatNameFromEmail(storedEmail);
    localStorage.setItem('stackly_user_name', userName);
  }

  if (!userName) {
    userName = 'Anand Raman';
  }

  // Update user name in sidebar
  const nameEl = document.getElementById('dash-user-name') || document.querySelector('.dash-user-name');
  if (nameEl) {
    nameEl.textContent = userName;
  }

  // Update avatar initials
  const avatarEl = document.getElementById('dash-user-avatar') || document.querySelector('.dash-user-avatar');
  if (avatarEl) {
    avatarEl.textContent = getInitials(userName);
  }

  // Update welcome greeting in topbar
  const welcomeTitle = document.getElementById('dash-welcome-title') || document.querySelector('.dash-page-title');
  if (welcomeTitle) {
    const firstName = userName.split(' ')[0] || userName;
    welcomeTitle.textContent = `Welcome Back, ${firstName}`;
  }

  // Set email on role badge as title tooltip
  const roleEl = document.getElementById('dash-user-role') || document.querySelector('.dash-user-role');
  if (roleEl && storedEmail) {
    roleEl.title = `Logged in: ${storedEmail}`;
  }
}

// Role-based sidebar brand logo link
function initSidebarBrandLogo() {
  const brandLink = document.querySelector('.dash-brand-bar a');
  if (!brandLink) return;

  const role = (localStorage.getItem('stackly_user_role') || '').toLowerCase();
  const targetDashboard = role === 'admin' ? 'AdminDashboard.html' : 'PatientDashboard.html';
  brandLink.setAttribute('href', targetDashboard);
  brandLink.setAttribute('aria-label', `Go to ${role === 'admin' ? 'Admin' : 'Patient'} Dashboard`);

  brandLink.addEventListener('click', (e) => {
    const currentPath = window.location.pathname.split('/').pop().toLowerCase();
    if (currentPath === targetDashboard.toLowerCase()) {
      e.preventDefault();
      window.location.hash = '#dashboard';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function initPatientSidebar() {
  const toggleBtn = document.querySelector('.dash-mobile-toggle');
  const sidebar = document.querySelector('.dash-sidebar');
  let overlay = document.querySelector('.dash-sidebar-overlay');

  if (!toggleBtn || !sidebar) return;

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'dash-sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const toggle = (open) => {
    const isOpen = open !== undefined ? open : !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', isOpen);
    overlay.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => toggle());
  overlay.addEventListener('click', () => toggle(false));

  const menuLinks = document.querySelectorAll('.dash-nav-item a');

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        window.location.hash = href;
        if (window.innerWidth <= 860) {
          toggle(false);
        }
      }
    });
  });

  const logoutBtn = document.querySelector('.btn-dash-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Log out from Patient Portal?')) {
        localStorage.removeItem('stackly_user_email');
        localStorage.removeItem('stackly_user_role');
        localStorage.removeItem('stackly_user_name');
        window.location.href = 'login.html';
      }
    });
  }
}

// Milestone Checkboxes & Live Progress Recalculation
function initMilestoneToggles() {
  const checkboxes = document.querySelectorAll('.milestone-check');
  const kpiMilestoneEl = document.getElementById('kpi-patient-milestones');
  const progressBar = document.getElementById('patient-progress-fill');
  const progressPercentText = document.getElementById('patient-progress-percent');

  if (!checkboxes.length) return;

  const updateMilestones = () => {
    let completedCount = 0;
    checkboxes.forEach(cb => {
      const parentLabel = cb.closest('.milestone-item');
      if (cb.checked) {
        completedCount++;
        parentLabel && parentLabel.classList.add('completed');
      } else {
        parentLabel && parentLabel.classList.remove('completed');
      }
    });

    const total = checkboxes.length;
    const percent = Math.round((completedCount / total) * 100);

    if (kpiMilestoneEl) {
      kpiMilestoneEl.textContent = `${completedCount} of ${total}`;
    }

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }

    if (progressPercentText) {
      progressPercentText.textContent = `${percent}% Plan Milestones Completed`;
    }
  };

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateMilestones();
      if (window.showToast) {
        window.showToast('Milestone tracking updated.', 'info');
      }
    });
  });

  updateMilestones();
}

// Demo action for rescheduling from patient portal
function initRescheduleDemo() {
  const rescheduleBtn = document.getElementById('btn-patient-reschedule');
  if (!rescheduleBtn) return;

  rescheduleBtn.addEventListener('click', () => {
    window.location.href = 'appointments.html';
  });
}

// ============================================================================
// PATIENT APPOINTMENTS INTERACTION
// ============================================================================
function initPatientAppointments() {
  const searchInput = document.getElementById('patient-appt-search');
  const filterSelect = document.getElementById('patient-appt-filter');
  const apptRows = document.querySelectorAll('#table-patient-appts tbody tr');

  function filterAppointments() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const filter = (filterSelect ? filterSelect.value : 'all').toLowerCase();

    apptRows.forEach(row => {
      const text = row.innerText.toLowerCase();
      const statusAttr = (row.getAttribute('data-status') || '').toLowerCase();

      const matchesSearch = !query || text.includes(query);
      let matchesFilter = true;

      if (filter === 'upcoming') {
        matchesFilter = statusAttr.includes('upcoming');
      } else if (filter === 'attended') {
        matchesFilter = statusAttr.includes('attended');
      } else if (filter === 'telehealth') {
        matchesFilter = statusAttr.includes('telehealth');
      }

      row.style.display = matchesSearch && matchesFilter ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterAppointments);
  if (filterSelect) filterSelect.addEventListener('change', filterAppointments);

  // Export Calendar (.ics)
  const exportBtn = document.getElementById('btn-patient-export-cal');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (window.showToast) {
        window.showToast('Downloading therapy appointment calendar (.ics)...', 'info');
      }
    });
  }

  // Reschedule Action
  document.querySelectorAll('.btn-patient-resched-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const reason = prompt('Please specify your preferred date or reason for reschedule:');
      if (reason) {
        if (window.showToast) {
          window.showToast('Reschedule request submitted. Concierge will confirm within 2 hours.', 'success');
        }
      }
    });
  });

  // Map / Directions
  document.querySelectorAll('.btn-patient-directions').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open('https://maps.google.com/?q=STACKLY+Rehabilitation+Bengaluru', '_blank');
    });
  });

  // Join Telehealth Video
  document.querySelectorAll('.btn-patient-join-video').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.showToast) {
        window.showToast('Connecting to encrypted telehealth room with Dr. Rajiv Menon...', 'info');
      }
    });
  });

  // View Clinical Notes
  document.querySelectorAll('.btn-patient-view-note').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.showToast) {
        window.showToast('Loading signed clinical progress note by Dr. Sarah Jenkins...', 'info');
      }
    });
  });
}

// ============================================================================
// PATIENT RECOVERY PLAN INTERACTION
// ============================================================================
function initPatientRecoveryPlan() {
  const downloadPlanBtn = document.getElementById('btn-patient-download-plan');
  if (downloadPlanBtn) {
    downloadPlanBtn.addEventListener('click', () => {
      if (window.showToast) {
        window.showToast('Generating 12-Week Neuro-Motor Recovery Protocol PDF...', 'info');
      }
    });
  }

  // Home Exercise Program (HEP) checkboxes
  const hepChecks = document.querySelectorAll('.hep-check');
  const counterEl = document.getElementById('patient-hep-counter');

  function updateHepCounter() {
    if (!hepChecks.length || !counterEl) return;
    let done = 0;
    hepChecks.forEach(cb => {
      if (cb.checked) done++;
    });
    counterEl.textContent = `${done} of ${hepChecks.length} Completed Today`;
  }

  hepChecks.forEach(cb => {
    cb.addEventListener('change', () => {
      updateHepCounter();
      if (window.showToast) {
        if (cb.checked) {
          window.showToast('Great job! Home exercise logged for today.', 'success');
        } else {
          window.showToast('Exercise marked uncompleted.', 'info');
        }
      }
    });
  });

  updateHepCounter();
}

// ============================================================================
// PATIENT RESOURCES & EDUCATIONAL MATERIALS
// ============================================================================
function initPatientResources() {
  // Video Demos
  document.querySelectorAll('.btn-video-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.video-demo-card') || btn.closest('.exercise-card');
      const title = card ? (card.querySelector('.video-title, .exercise-name')?.textContent || 'Exercise Video') : 'Exercise Tutorial';
      if (window.showToast) {
        window.showToast(`Launching HD Video Demonstration: "${title}"`, 'info');
      }
    });
  });

  // Downloadable guides
  document.querySelectorAll('.btn-patient-download-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const docName = btn.getAttribute('data-doc') || 'Clinical Guide';
      if (window.showToast) {
        window.showToast(`Downloading ${docName} (PDF)...`, 'info');
      }
    });
  });

  // Request Resource
  const requestResBtn = document.getElementById('btn-patient-request-resource');
  if (requestResBtn) {
    requestResBtn.addEventListener('click', () => {
      const topic = prompt('What topic or video guide would you like your clinical team to provide?');
      if (topic) {
        if (window.showToast) {
          window.showToast(`Resource request for "${topic}" sent to Dr. Sarah Jenkins.`, 'success');
        }
      }
    });
  }
}

// ============================================================================
// PATIENT PROFILE & SUPPORT
// ============================================================================
function initPatientSupport() {
  const msgForm = document.getElementById('form-patient-message');
  if (msgForm) {
    msgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bodyEl = document.getElementById('patient-msg-body');
      if (bodyEl) bodyEl.value = '';
      if (window.showToast) {
        window.showToast('Secure message delivered to Dr. Sarah Jenkins and clinic desk.', 'success');
      }
    });
  }

  const savePrefsBtn = document.getElementById('btn-patient-save-prefs');
  if (savePrefsBtn) {
    savePrefsBtn.addEventListener('click', () => {
      if (window.showToast) {
        window.showToast('Communication and alert preferences saved successfully.', 'success');
      }
    });
  }
}
