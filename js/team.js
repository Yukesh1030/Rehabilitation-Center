/**
 * STACKLY REHABILITATION - TEAM SEARCH & SPECIALTY FILTERS
 */

document.addEventListener('DOMContentLoaded', () => {
  initTeamFilters();
});

function initTeamFilters() {
  const searchInput = document.getElementById('therapist-search-input');
  const filterPills = document.querySelectorAll('.filter-pill');
  const specialistCards = document.querySelectorAll('.specialist-card');
  const emptyState = document.getElementById('no-specialists-found');
  const resultsCount = document.getElementById('team-results-count');

  if (!specialistCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  const filterCards = () => {
    let visibleCount = 0;

    specialistCards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const specialty = (card.getAttribute('data-specialty') || '').toLowerCase();
      const bio = (card.getAttribute('data-bio') || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || specialty.includes(activeCategory.toLowerCase());
      const matchesSearch = searchTerm === '' || name.includes(searchTerm) || specialty.includes(searchTerm) || bio.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} Specialist${visibleCount === 1 ? '' : 's'}`;
    }

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  // Filter pills click
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter') || 'all';
      filterCards();
    });
  });

  // Search input live typing
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }

  // Pre-filter from URL query params (e.g. ?specialty=neurological)
  const urlParams = new URLSearchParams(window.location.search);
  const specialtyParam = urlParams.get('specialty');
  if (specialtyParam) {
    const targetPill = Array.from(filterPills).find(p => p.getAttribute('data-filter') === specialtyParam);
    if (targetPill) {
      targetPill.click();
    }
  }
}
