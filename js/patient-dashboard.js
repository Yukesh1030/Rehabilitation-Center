/**
 * STACKLY REHABILITATION - PATIENT DASHBOARD CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicPatientProfile();
  initSidebarBrandLogo();
  initPatientSidebar();
  initMilestoneToggles();
  initRescheduleDemo();
});

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
  // Role of login: Admin -> AdminDashboard.html, Client/Patient -> PatientDashboard.html
  const targetDashboard = role === 'admin' ? 'AdminDashboard.html' : 'PatientDashboard.html';
  brandLink.setAttribute('href', targetDashboard);
  brandLink.setAttribute('aria-label', `Go to ${role === 'admin' ? 'Admin' : 'Patient'} Dashboard`);

  brandLink.addEventListener('click', (e) => {
    const currentPath = window.location.pathname.split('/').pop().toLowerCase();
    if (currentPath === targetDashboard.toLowerCase()) {
      e.preventDefault();
      const defaultNavLink = document.querySelector('.dash-nav-item a[data-view="view-patient-dash"]');
      if (defaultNavLink) defaultNavLink.click();
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
  const views = document.querySelectorAll('.dash-view-section');

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetView = link.getAttribute('data-view');
      if (targetView && document.getElementById(targetView)) {
        e.preventDefault();
        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        views.forEach(v => v.style.display = 'none');
        document.getElementById(targetView).style.display = 'block';

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
      window.showToast('Milestone tracking updated.', 'info');
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
