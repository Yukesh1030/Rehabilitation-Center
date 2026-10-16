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
    let displayName = adminName;
    if (adminName.startsWith('Dr.') || adminName.startsWith('Dr ')) {
      const parts = adminName.split(' ');
      displayName = parts.length > 2 ? `Dr. ${parts[parts.length - 1]}` : adminName;
    } else {
      displayName = adminName.split(' ')[0] || adminName;
    }
    welcomeTitle.textContent = `Operations Overview • Welcome, ${displayName}`;
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

// Mobile off-canvas drawer & hash routing
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

  function activateView(targetView, updateHash = true) {
    if (!targetView) return;
    const targetEl = document.getElementById(targetView);
    if (!targetEl) return;

    views.forEach(v => v.style.display = 'none');
    targetEl.style.display = 'block';

    menuLinks.forEach(l => {
      if (l.getAttribute('data-view') === targetView) {
        l.classList.add('active');
        if (updateHash) {
          const hash = l.getAttribute('href');
          if (hash && window.location.hash !== hash) {
            history.replaceState(null, '', hash);
          }
        }
      } else {
        l.classList.remove('active');
      }
    });

    if (window.innerWidth <= 860) {
      toggle(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      activateView(targetView, true);
    });
  });

  // Handle URL hash on initial load and hashchange
  function handleUrlHash() {
    const rawHash = (window.location.hash || '').replace('#', '').trim();
    if (!rawHash) return;

    // Check if any link matches href="#hash" or data-view="view-hash"
    const matchedLink = Array.from(menuLinks).find(l => {
      const hrefHash = (l.getAttribute('href') || '').replace('#', '').trim();
      const dataView = (l.getAttribute('data-view') || '').replace('view-', '').trim();
      return hrefHash === rawHash || dataView === rawHash;
    });

    if (matchedLink) {
      const viewId = matchedLink.getAttribute('data-view');
      activateView(viewId, false);
    }
  }

  window.addEventListener('hashchange', handleUrlHash);
  handleUrlHash();
}

// Refresh KPI Controls
function initRefreshControl() {
  const refreshBtn = document.querySelector('.btn-dash-refresh');
  if (!refreshBtn) return;

  refreshBtn.addEventListener('click', () => {
    refreshBtn.classList.add('spinning');
    
    setTimeout(() => {
      refreshBtn.classList.remove('spinning');
      if (window.showToast) {
        window.showToast('Clinical metrics and schedule updated successfully.', 'success');
      }

      // Refresh demo numbers
      const kpiPatients = document.getElementById('kpi-active-patients');
      const kpiSessions = document.getElementById('kpi-today-sessions');
      const kpiPending = document.getElementById('kpi-pending-requests');

      if (kpiPatients) kpiPatients.textContent = '186';
      if (kpiSessions) kpiSessions.textContent = '32';
      if (kpiPending) kpiPending.textContent = '9';
    }, 600);
  });
}

// Admin Interactive Handlers & Table Filtering
function initAdminActions() {
  const toast = (msg, type = 'info') => {
    if (window.showToast) window.showToast(msg, type);
    else alert(msg);
  };

  // Accept / Reschedule requests
  document.querySelectorAll('.btn-accept-request').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const name = row.querySelector('.patient-name')?.textContent || 'Patient';
      const statusCell = row.querySelector('.status-col');
      
      if (statusCell) {
        statusCell.innerHTML = '<span class="status-badge status-scheduled"><span class="badge-dot"></span> Confirmed</span>';
      }
      this.parentElement.innerHTML = '<span style="color:var(--dash-text-muted);font-size:0.8rem;"><i class="fa-solid fa-check"></i> Assigned</span>';
      toast(`Assessment request for ${name} has been confirmed.`, 'success');
    });
  });

  document.querySelectorAll('.btn-reschedule-request').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const name = row.querySelector('.patient-name')?.textContent || 'Patient';
      const newTime = prompt(`Suggest new assessment slot for ${name}:`, 'Tomorrow, 02:00 PM');
      if (newTime) {
        toast(`Reschedule proposal (${newTime}) sent to ${name}.`, 'info');
      }
    });
  });

  // Check-In Patient Button
  document.querySelectorAll('.btn-checkin').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const name = row.querySelector('.patient-name')?.textContent || 'Patient';
      const statusCell = row.querySelector('.status-col');
      if (statusCell) {
        statusCell.innerHTML = '<span class="status-badge status-completed"><span class="badge-dot"></span> In Therapy</span>';
      }
      this.parentElement.innerHTML = '<span style="color:var(--dash-success);font-size:0.8rem;"><i class="fa-solid fa-circle-check"></i> Checked-In</span>';
      toast(`${name} checked in to clinical suite.`, 'success');
    });
  });

  // Launch Telehealth
  document.querySelectorAll('.btn-launch-telehealth').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const name = row.querySelector('.patient-name')?.textContent || 'Patient';
      toast(`Initiating encrypted WebRTC telehealth suite with ${name}...`, 'info');
    });
  });

  // View Clinical Chart
  document.querySelectorAll('.btn-patient-chart').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const name = row.querySelector('.patient-name')?.textContent || 'Patient';
      toast(`Opening clinical rehabilitation chart for ${name}.`, 'info');
    });
  });

  // Message Staff
  document.querySelectorAll('.btn-msg-staff').forEach(btn => {
    btn.addEventListener('click', function() {
      const name = this.getAttribute('data-name') || 'Clinician';
      toast(`Connecting to internal clinical intercom with ${name}...`, 'info');
    });
  });

  // Download Reports
  document.querySelectorAll('.btn-download-report').forEach(btn => {
    btn.addEventListener('click', function() {
      const title = this.getAttribute('data-title') || 'Report';
      toast(`Preparing download for: ${title}`, 'success');
    });
  });

  // Add Patient / Staff Quick Actions
  const btnAddPatient = document.getElementById('btn-add-patient');
  if (btnAddPatient) {
    btnAddPatient.addEventListener('click', () => {
      const name = prompt('Enter new patient full name:', 'Lakshmi Narayanan');
      if (name) {
        toast(`New clinical intake chart created for ${name}.`, 'success');
      }
    });
  }

  const btnAddStaff = document.getElementById('btn-add-staff');
  if (btnAddStaff) {
    btnAddStaff.addEventListener('click', () => {
      const name = prompt('Enter clinical specialist name:', 'Dr. Ananya Rao');
      if (name) {
        toast(`Staff credentials created for ${name}. Invite transmitted.`, 'success');
      }
    });
  }

  const btnExportRoster = document.getElementById('btn-export-roster');
  if (btnExportRoster) {
    btnExportRoster.addEventListener('click', () => {
      toast('Generating encrypted multi-branch staff & patient roster (CSV)...', 'success');
    });
  }

  const btnCreateAppt = document.getElementById('btn-create-appt');
  if (btnCreateAppt) {
    btnCreateAppt.addEventListener('click', () => {
      const patient = prompt('Enter patient name for appointment:', 'Vignesh Raman');
      if (patient) {
        toast(`New appointment slot booked for ${patient}. Notification sent.`, 'success');
      }
    });
  }

  const btnExportSchedule = document.getElementById('btn-export-schedule');
  if (btnExportSchedule) {
    btnExportSchedule.addEventListener('click', () => {
      toast('Generating Daily Multi-Suite Schedule PDF...', 'success');
    });
  }

  const btnCustomReport = document.getElementById('btn-custom-report');
  if (btnCustomReport) {
    btnCustomReport.addEventListener('click', () => {
      toast('Opening Custom Cohort Analytics Generator...', 'info');
    });
  }

  const btnExportAuditPack = document.getElementById('btn-export-audit-pack');
  if (btnExportAuditPack) {
    btnExportAuditPack.addEventListener('click', () => {
      toast('Compiling certified NABH Audit Pack (PDF • 14 MB)...', 'success');
    });
  }

  const btnSaveSettings = document.getElementById('btn-save-settings');
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      toast('Center administration protocols and settings saved successfully.', 'success');
    });
  }

  const btnResetSettings = document.getElementById('btn-reset-settings');
  if (btnResetSettings) {
    btnResetSettings.addEventListener('click', () => {
      if (confirm('Reset center administration settings to NABH defaults?')) {
        toast('Settings reset to default clinical baseline.', 'info');
      }
    });
  }

  const btnManualBackup = document.getElementById('btn-manual-backup');
  if (btnManualBackup) {
    btnManualBackup.addEventListener('click', function() {
      const originalHTML = this.innerHTML;
      this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Encrypting & Replicating...';
      this.disabled = true;

      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.disabled = false;
        toast('Encrypted multi-region cloud backup completed successfully (4.2 GB replicated).', 'success');
      }, 1200);
    });
  }

  // Interactive Patient Table Search Filter
  const searchPatients = document.getElementById('search-patients');
  const filterProg = document.getElementById('filter-patient-program');
  const filterStatus = document.getElementById('filter-patient-status');
  const tablePatients = document.getElementById('table-patients');

  function filterPatientRows() {
    if (!tablePatients) return;
    const query = (searchPatients?.value || '').toLowerCase().trim();
    const prog = (filterProg?.value || '').toLowerCase();
    const rows = tablePatients.querySelectorAll('tbody tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const matchesProg = !prog || text.includes(prog);
      row.style.display = matchesQuery && matchesProg ? '' : 'none';
    });
  }

  if (searchPatients) searchPatients.addEventListener('input', filterPatientRows);
  if (filterProg) filterProg.addEventListener('change', filterPatientRows);
  if (filterStatus) filterStatus.addEventListener('change', filterPatientRows);

  // Interactive Appointments Table Filter
  const searchAppts = document.getElementById('search-appointments');
  const filterBranch = document.getElementById('filter-appt-branch');
  const filterApptStatus = document.getElementById('filter-appt-status');
  const tableAppts = document.getElementById('table-appointments');

  function filterAppointmentRows() {
    if (!tableAppts) return;
    const query = (searchAppts?.value || '').toLowerCase().trim();
    const branch = (filterBranch?.value || '').toLowerCase();
    const status = (filterApptStatus?.value || '').toLowerCase();
    const rows = tableAppts.querySelectorAll('tbody tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const matchesBranch = !branch || text.includes(branch) || 
        (branch === 'blr' && text.includes('bengaluru')) ||
        (branch === 'hyd' && text.includes('hyderabad')) ||
        (branch === 'maa' && text.includes('chennai')) ||
        (branch === 'cbe' && text.includes('coimbatore'));
      const matchesStatus = !status || text.includes(status);

      row.style.display = matchesQuery && matchesBranch && matchesStatus ? '' : 'none';
    });
  }

  if (searchAppts) searchAppts.addEventListener('input', filterAppointmentRows);
  if (filterBranch) filterBranch.addEventListener('change', filterAppointmentRows);
  if (filterApptStatus) filterApptStatus.addEventListener('change', filterAppointmentRows);

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


