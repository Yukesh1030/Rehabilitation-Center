/**
 * STACKLY REHABILITATION - ADMIN DASHBOARD CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicAdminProfile();
  initSidebarBrandLogo();
  initDashboardSidebar();
  initAdminActions();
  initRefreshControl();
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
  if (!name) return 'AD';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Dynamic User Profile for Admin Portal
function initDynamicAdminProfile() {
  const storedEmail = localStorage.getItem('stackly_user_email');
  let adminName = localStorage.getItem('stackly_user_name');

  if (!adminName && storedEmail) {
    adminName = formatNameFromEmail(storedEmail);
    localStorage.setItem('stackly_user_name', adminName);
  }

  if (!adminName) {
    adminName = 'Dr. R. Alagappan';
  }

  // Update user name in sidebar
  const nameEl = document.getElementById('dash-user-name') || document.querySelector('.dash-user-name');
  if (nameEl) {
    nameEl.textContent = adminName;
  }

  // Update avatar initials
  const avatarEl = document.getElementById('dash-user-avatar') || document.querySelector('.dash-user-avatar');
  if (avatarEl) {
    avatarEl.textContent = getInitials(adminName);
  }

  // Update topbar greeting
  const welcomeTitle = document.getElementById('dash-welcome-title') || document.querySelector('.dash-page-title');
  if (welcomeTitle) {
    const firstName = adminName.split(' ')[0] || adminName;
    welcomeTitle.textContent = `Operations Overview • Welcome, ${firstName}`;
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
      const defaultNavLink = document.querySelector('.dash-nav-item a[data-view="view-dashboard"]');
      if (defaultNavLink) defaultNavLink.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// Mobile off-canvas drawer
function initDashboardSidebar() {
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

  // Sidebar menu switching
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
}

// Refresh KPI Controls
function initRefreshControl() {
  const refreshBtn = document.querySelector('.btn-dash-refresh');
  if (!refreshBtn) return;

  refreshBtn.addEventListener('click', () => {
    refreshBtn.classList.add('spinning');
    
    setTimeout(() => {
      refreshBtn.classList.remove('spinning');
      window.showToast('Clinical metrics and schedule updated successfully.', 'success');

      // Random jitter demo data
      const kpiPatients = document.getElementById('kpi-active-patients');
      const kpiSessions = document.getElementById('kpi-today-sessions');
      const kpiPending = document.getElementById('kpi-pending-requests');

      if (kpiPatients) kpiPatients.textContent = '186';
      if (kpiSessions) kpiSessions.textContent = '32';
      if (kpiPending) kpiPending.textContent = '9';
    }, 800);
  });
}

// Admin Interactive Row Actions
function initAdminActions() {
  // Accept / Reschedule requests
  document.querySelectorAll('.btn-accept-request').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const name = row.querySelector('.patient-name').textContent;
      const statusCell = row.querySelector('.status-col');
      
      statusCell.innerHTML = '<span class="status-badge status-scheduled"><i class="fa-solid fa-check"></i> Confirmed</span>';
      this.parentElement.innerHTML = '<span style="color:var(--dash-text-muted);font-size:0.8rem;">Assigned</span>';
      window.showToast(`Assessment request for ${name} has been confirmed.`, 'success');
    });
  });

  document.querySelectorAll('.btn-reschedule-request').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const name = row.querySelector('.patient-name').textContent;
      const newTime = prompt(`Suggest new assessment slot for ${name}:`, 'Tomorrow, 02:00 PM');
      if (newTime) {
        window.showToast(`Reschedule proposal (${newTime}) sent to ${name}.`, 'info');
      }
    });
  });

  // Logout button
  const logoutBtn = document.querySelector('.btn-dash-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to log out of the Administrator Portal?')) {
        localStorage.removeItem('stackly_user_email');
        localStorage.removeItem('stackly_user_role');
        localStorage.removeItem('stackly_user_name');
        window.location.href = 'login.html';
      }
    });
  }
}

