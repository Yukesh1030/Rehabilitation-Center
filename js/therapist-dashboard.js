/**
 * STACKLY REHABILITATION - THERAPIST DASHBOARD CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initTherapistSidebar();
  initSessionCompleteActions();
  initProgressNoteComposer();
  initAvailabilityToggle();
});

function initTherapistSidebar() {
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
      if (confirm('Log out from Therapist Portal?')) {
        window.location.href = 'login.html';
      }
    });
  }
}

// Session Complete Toggle
function initSessionCompleteActions() {
  document.querySelectorAll('.btn-complete-session').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const patient = row.querySelector('.patient-name').textContent;
      const statusBadge = row.querySelector('.status-col');

      statusBadge.innerHTML = '<span class="status-badge status-completed"><i class="fa-solid fa-check-circle"></i> Completed</span>';
      this.disabled = true;
      this.style.opacity = '0.5';
      this.textContent = 'Logged';

      window.showToast(`Session for ${patient} marked as completed. Progress note draft generated.`, 'success');
    });
  });
}

// Progress Note Composer
function initProgressNoteComposer() {
  const noteForm = document.getElementById('progress-note-form');
  const notesFeed = document.getElementById('notes-history-feed');

  if (!noteForm) return;

  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const patientSelect = document.getElementById('note-patient');
    const noteText = document.getElementById('note-content');

    if (!noteText.value.trim()) {
      window.showToast('Please type clinical observations before saving note.', 'error');
      return;
    }

    const patientName = patientSelect.options[patientSelect.selectedIndex].text;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (notesFeed) {
      const newCard = document.createElement('div');
      newCard.className = 'dash-note-card';
      newCard.style.cssText = 'background:var(--dash-surface);padding:1rem;border-radius:8px;border:1px solid var(--dash-border);margin-bottom:0.75rem;';
      newCard.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:0.35rem;">
          <strong style="color:var(--dash-primary);">${patientName}</strong>
          <span style="font-size:0.75rem;color:var(--dash-text-dim);">Today, ${nowStr}</span>
        </div>
        <p style="font-size:0.875rem;color:var(--dash-text-muted);margin:0;">${noteText.value.trim()}</p>
      `;
      notesFeed.prepend(newCard);
    }

    noteText.value = '';
    window.showToast(`Progress note saved for ${patientName}.`, 'success');
  });
}

// Availability status switch
function initAvailabilityToggle() {
  const availBtn = document.getElementById('btn-therapist-status');
  if (!availBtn) return;

  availBtn.addEventListener('click', () => {
    const isAvail = availBtn.getAttribute('data-status') === 'available';
    if (isAvail) {
      availBtn.setAttribute('data-status', 'busy');
      availBtn.className = 'btn btn-sm btn-outline';
      availBtn.innerHTML = '<i class="fa-solid fa-circle" style="color:var(--dash-warning);font-size:0.6rem;"></i> In Session';
      window.showToast('Availability updated: In Session (Do Not Disturb)', 'info');
    } else {
      availBtn.setAttribute('data-status', 'available');
      availBtn.className = 'btn btn-sm btn-primary';
      availBtn.innerHTML = '<i class="fa-solid fa-circle" style="color:var(--dash-success);font-size:0.6rem;"></i> Accepting Assessments';
      window.showToast('Availability updated: Accepting Assessments', 'success');
    }
  });
}
