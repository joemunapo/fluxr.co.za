function showToast(message) {
  let toast = document.querySelector('.copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className =
      'copy-toast fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-fluxr-dark px-4 py-2 text-sm font-medium text-white opacity-0 transition';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');

  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 1800);
}

function setCopyButtonState(button, copied) {
  if (copied) {
    button.innerHTML = '<i class="fa-solid fa-check text-fluxr-green-dark" aria-hidden="true"></i>';
  } else {
    button.innerHTML = '<i class="fa-regular fa-copy text-base" aria-hidden="true"></i>';
  }
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => showToast('Code copied to clipboard!'))
    .catch(err => console.error('Could not copy text:', err));
}

document.addEventListener('DOMContentLoaded', function () {
  const isHomePage = document.body.classList.contains('home-page');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (isHomePage) {
    const revealSections = document.querySelectorAll('section.reveal-once');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (revealSections.length) {
      if (reduceMotion) {
        revealSections.forEach(section => section.classList.add('is-visible'));
      } else if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        }, {
          threshold: 0.18,
          rootMargin: '0px 0px -8% 0px'
        });

        revealSections.forEach(section => {
          section.classList.add('reveal-ready');
          revealObserver.observe(section);
        });
      } else {
        revealSections.forEach(section => section.classList.add('is-visible'));
      }
    }
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      this.setAttribute('aria-expanded', String(isHidden));
      this.innerHTML = isHidden
        ? '<i class="fa-solid fa-xmark text-xl" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-bars text-xl" aria-hidden="true"></i>';
    });

    document.querySelectorAll('.mobile-menu-link, .btn-mobile').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl" aria-hidden="true"></i>';
      });
    });

    document.addEventListener('click', event => {
      if (!mobileMenu.classList.contains('hidden') &&
        !mobileMenu.contains(event.target) &&
        !menuBtn.contains(event.target)) {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl" aria-hidden="true"></i>';
      }
    });
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      const wrapper = this.closest('.code-wrapper');
      let codeElement = null;

      if (wrapper) {
        codeElement = wrapper.querySelector('.ussd-code') ||
          wrapper.querySelector('.quick-step-code') ||
          wrapper.querySelector('code');
      }

      if (!codeElement) {
        codeElement = this.previousElementSibling;
      }

      if (!codeElement) return;

      navigator.clipboard
        .writeText(codeElement.textContent.trim())
        .then(() => {
          setCopyButtonState(this, true);
          setTimeout(() => setCopyButtonState(this, false), 1800);
        })
        .catch(err => console.error('Could not copy text:', err));
    });
  });

  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      const icon = this.querySelector('.faq-icon');
      const isOpen = !answer.classList.contains('hidden');

      faqQuestions.forEach(q => {
        const a = q.nextElementSibling;
        const i = q.querySelector('.faq-icon');
        a.classList.add('hidden');
        i?.classList.remove('rotate-180');
      });

      if (!isOpen) {
        answer.classList.remove('hidden');
        icon?.classList.add('rotate-180');
      }
    });
  });

  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentIndex = 0;

  function showSlide(index) {
    if (!slides.length) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('hidden', i !== currentIndex);
      slide.classList.toggle('block', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-fluxr-green', i === currentIndex);
      dot.classList.toggle('bg-fluxr-gray-300', i !== currentIndex);
    });
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  prevBtn?.addEventListener('click', () => showSlide(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showSlide(currentIndex + 1));

  let slideInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
  const slider = document.querySelector('.testimonial-slider');
  slider?.addEventListener('mouseenter', () => clearInterval(slideInterval));
  slider?.addEventListener('mouseleave', () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
      const top = section.offsetTop - headerHeight - 120;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('text-fluxr-dark', 'font-semibold', 'underline', 'underline-offset-8', 'decoration-2', 'decoration-fluxr-green');
          link.classList.add('text-fluxr-gray-700', 'font-medium');
        });

        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        active?.classList.remove('text-fluxr-gray-700', 'font-medium');
        active?.classList.add('text-fluxr-dark', 'font-semibold', 'underline', 'underline-offset-8', 'decoration-2', 'decoration-fluxr-green');
      }
    });
  }

  highlightNavOnScroll();
  window.addEventListener('scroll', highlightNavOnScroll);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;
      const inputs = contactForm.querySelectorAll('.form-input');

      inputs.forEach(input => {
        input.classList.remove('border-red-500', 'ring-red-200');

        if (!input.value.trim()) {
          valid = false;
          input.classList.add('border-red-500', 'ring-red-200');
        }

        if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value)) {
            valid = false;
            input.classList.add('border-red-500', 'ring-red-200');
          }
        }
      });

      if (!valid) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        const existing = document.querySelector('.form-success');
        existing?.remove();

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success mb-4 rounded-lg border border-fluxr-green/30 bg-fluxr-green/10 px-4 py-3 text-sm text-fluxr-dark';
        successMessage.innerHTML = '<span class="inline-flex items-center gap-2"><i class="fa-solid fa-check text-fluxr-green-dark" aria-hidden="true"></i>Message sent successfully! We\'ll get back to you soon.</span>';
        contactForm.parentNode.insertBefore(successMessage, contactForm);

        setTimeout(() => successMessage.remove(), 4000);
      }, 1000);
    });
  }

  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  const journeySteps = document.querySelectorAll('.journey-step');
  const journeyDots = document.querySelectorAll('.journey-dot');
  const phoneImages = document.querySelectorAll('.phone-image');
  const JOURNEY_AUTOPLAY_MS = 5000;

  if (journeySteps.length && journeyDots.length && phoneImages.length) {
    let currentStep = 2;
    let autoScrollInterval = null;
    const journeySection = document.getElementById('user-journey');
    journeySection?.style.setProperty('--journey-progress-duration', `${JOURNEY_AUTOPLAY_MS}ms`);

    function updateJourneyStep(stepNumber) {
      currentStep = stepNumber;

      journeySteps.forEach(step => {
        const num = Number(step.dataset.step);
        const details = step.querySelector('.step-details');
        const progressFill = step.querySelector('.journey-step-progress-fill');
        const isActive = num === currentStep;

        step.classList.toggle('active', isActive);
        step.classList.toggle('opacity-70', !isActive);
        step.classList.toggle('opacity-100', isActive);
        details?.classList.toggle('hidden', !isActive);

        if (progressFill) {
          progressFill.classList.remove('is-running');
          progressFill.style.width = '0%';

          if (isActive) {
            void progressFill.offsetWidth;
            progressFill.classList.add('is-running');
          }
        }
      });

      journeyDots.forEach(dot => {
        const isActive = Number(dot.dataset.step) === currentStep;
        dot.classList.toggle('active', isActive);
        dot.classList.toggle('bg-fluxr-green', isActive);
        dot.classList.toggle('bg-fluxr-gray-300', !isActive);
      });

      phoneImages.forEach(img => {
        const isActive = Number(img.dataset.step) === currentStep;
        img.classList.toggle('active', isActive);
        img.classList.toggle('opacity-100', isActive);
        img.classList.toggle('opacity-0', !isActive);
        img.classList.toggle('pointer-events-auto', isActive);
        img.classList.toggle('pointer-events-none', !isActive);
      });
    }

    function startJourneyAutoScroll() {
      clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(() => {
        const next = currentStep >= 4 ? 1 : currentStep + 1;
        updateJourneyStep(next);
      }, JOURNEY_AUTOPLAY_MS);
    }

    journeySteps.forEach(step => {
      step.addEventListener('click', () => {
        updateJourneyStep(Number(step.dataset.step));
        startJourneyAutoScroll();
      });
    });

    journeyDots.forEach(dot => {
      dot.addEventListener('click', e => {
        e.stopPropagation();
        updateJourneyStep(Number(dot.dataset.step));
        startJourneyAutoScroll();
      });
    });

    updateJourneyStep(currentStep);
    startJourneyAutoScroll();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearInterval(autoScrollInterval);
      } else {
        startJourneyAutoScroll();
      }
    });
  }
});
