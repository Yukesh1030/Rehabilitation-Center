/**
 * STACKLY REHABILITATION - SIGNATURE ANIMATION SYSTEM
 * Powered by GSAP 3 & ScrollTrigger with IntersectionObserver fallback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    initStaticFallback();
    return;
  }

  // Check if GSAP is loaded
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    initGSAPAnimations();
  } else {
    initIntersectionObserverReveals();
  }
});

function initGSAPAnimations() {
  // 1. Hero Reveal: Text mask, image clip-path, gentle parallax, CTA entrance
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    // Headline & Subtitle reveals
    heroTl.fromTo('.hero-title .reveal-text', 
      { y: '110%', opacity: 0 }, 
      { y: '0%', opacity: 1, stagger: 0.15, duration: 1.1 }
    );

    heroTl.fromTo('.hero-lead', 
      { opacity: 0, y: 25 }, 
      { opacity: 1, y: 0, duration: 0.8 }, 
      '-=0.6'
    );

    heroTl.fromTo('.hero-actions-group .btn', 
      { opacity: 0, scale: 0.95, y: 20 }, 
      { opacity: 1, scale: 1, y: 0, stagger: 0.15, duration: 0.7 }, 
      '-=0.5'
    );

    // Hero Image Clip-path Reveal & Subtle Parallax
    const heroImgFrame = document.querySelector('.hero-image-frame');
    if (heroImgFrame) {
      gsap.fromTo(heroImgFrame, 
        { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.4, ease: 'power3.inOut' }
      );

      gsap.to('.hero-image-frame img', {
        y: '8%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  // 2. Recovery Journey: Scroll-triggered animated progress line
  const journeySection = document.querySelector('.recovery-journey-section');
  if (journeySection) {
    const progressFillH = document.querySelector('.journey-progress-fill-h');
    if (progressFillH) {
      gsap.fromTo(progressFillH, 
        { width: '0%' }, 
        { 
          width: '100%', 
          ease: 'none',
          scrollTrigger: {
            trigger: journeySection,
            start: 'top 70%',
            end: 'center center',
            scrub: 0.5
          }
        }
      );
    }

    const progressFillV = document.querySelector('.journey-progress-fill');
    if (progressFillV) {
      gsap.fromTo(progressFillV, 
        { height: '0%' }, 
        { 
          height: '100%', 
          ease: 'none',
          scrollTrigger: {
            trigger: journeySection,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.5
          }
        }
      );
    }

    // Step cards stagger
    gsap.fromTo('.journey-step-card', 
      { opacity: 0, y: 40 }, 
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.2, 
        duration: 0.8,
        scrollTrigger: {
          trigger: journeySection,
          start: 'top 75%'
        }
      }
    );
  }

  // 3. Therapist Cards Staggered Entrance
  const therapistCards = document.querySelectorAll('.specialist-card');
  if (therapistCards.length > 0) {
    gsap.fromTo(therapistCards, 
      { opacity: 0, y: 35 }, 
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.15, 
        duration: 0.8,
        scrollTrigger: {
          trigger: '.specialists-grid',
          start: 'top 85%'
        }
      }
    );
  }

  // 4. General Section Fade-Up
  const revealElements = document.querySelectorAll('.animate-fade-up');
  revealElements.forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 30 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.75, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%'
        }
      }
    );
  });

  // 5. Dashboard KPI Counters
  initKPICounters();
}

// Fallback Intersection Observer reveals
function initIntersectionObserverReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('clip-reveal')) {
          entry.target.classList.add('is-revealed');
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-fade-up, .clip-reveal, .journey-step-card').forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll('.reveal-text').forEach(el => {
    el.classList.add('is-revealed');
  });

  initKPICounters();
}

// Animated KPI Counters
function initKPICounters() {
  const counters = document.querySelectorAll('.kpi-counter');
  if (counters.length === 0) return;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-target'), 10) || 0;
        let startVal = 0;
        const duration = 1500;
        const startTime = performance.now();

        const updateVal = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          // Ease-out expo
          const easeProgress = 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeProgress * targetVal);
          el.textContent = currentVal.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateVal);
          } else {
            el.textContent = targetVal.toLocaleString();
          }
        };

        requestAnimationFrame(updateVal);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => countObserver.observe(counter));
}

// Reduced Motion static fallback
function initStaticFallback() {
  document.querySelectorAll('.reveal-text').forEach(el => {
    el.style.transform = 'none';
    el.style.opacity = '1';
  });
  document.querySelectorAll('.animate-fade-up, .journey-step-card').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll('.clip-reveal').forEach(el => {
    el.style.clipPath = 'none';
  });
  const hLine = document.querySelector('.journey-progress-fill-h');
  if (hLine) hLine.style.width = '100%';
  const vLine = document.querySelector('.journey-progress-fill');
  if (vLine) vLine.style.height = '100%';
  document.querySelectorAll('.kpi-counter').forEach(el => {
    el.textContent = el.getAttribute('data-target') || el.textContent;
  });
}
