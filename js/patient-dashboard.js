/**
 * STACKLY REHABILITATION - PATIENT DASHBOARD CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initPatientSidebar();
  initMilestoneToggles();
  initRescheduleDemo();
});

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
