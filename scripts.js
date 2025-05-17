// Mobile Navigation JavaScript
document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');

      // Toggle ARIA expanded state
      const expanded = mobileMenu.classList.contains('active');
      this.setAttribute('aria-expanded', expanded);
    });

    // Close menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-menu-link, .btn-mobile');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
      if (mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(event.target) &&
        !menuBtn.contains(event.target)) {
        mobileMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// Copy to Clipboard Functionality - UPDATED VERSION FOR QUICK GUIDE
document.addEventListener('DOMContentLoaded', function () {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent any parent events from triggering

      // Find the code element based on context
      let codeElement, textToCopy;

      // Check if this is in a code-wrapper with a ussd-code
      const wrapper = this.closest('.code-wrapper');
      if (wrapper) {
        const ussdCode = wrapper.querySelector('.ussd-code');
        const quickStepCode = wrapper.querySelector('.quick-step-code');

        if (ussdCode) {
          codeElement = ussdCode;
        } else if (quickStepCode) {
          codeElement = quickStepCode;
        } else {
          codeElement = this.previousElementSibling;
        }
      } else {
        // Fallback to previous sibling if no wrapper found
        codeElement = this.previousElementSibling;
      }

      if (!codeElement) {
        console.error('No code element found to copy');
        return;
      }

      textToCopy = codeElement.textContent;

      navigator.clipboard.writeText(textToCopy).then(() => {
        // Visual feedback
        btn.classList.add('copied');

        // Store original SVG
        const originalSVG = btn.innerHTML;

        // Replace with success icon
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--fluxr-green-dark);">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;

        // Reset after 2 seconds
        setTimeout(() => {
          btn.innerHTML = originalSVG;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    });
  });
});

// Function to copy USSD code to clipboard when tapped
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Create or get toast notification
    let toast = document.querySelector('.copy-toast');

    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'copy-toast';
      document.body.appendChild(toast);
    }

    // Show toast notification
    toast.textContent = 'Code copied to clipboard!';
    toast.classList.add('visible');

    // Hide toast after 2 seconds
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2000);
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

// Initialize toast
document.addEventListener('DOMContentLoaded', function () {
  // Check if toast exists, if not create it
  if (!document.querySelector('.copy-toast')) {
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
});


// FAQ Accordion
document.addEventListener('DOMContentLoaded', function () {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      const isActive = this.classList.contains('active');

      // Close all other FAQs
      document.querySelectorAll('.faq-question').forEach(q => {
        if (q !== question) {
          q.classList.remove('active');
          q.nextElementSibling.classList.remove('active');
        }
      });

      // Toggle current FAQ
      if (isActive) {
        this.classList.remove('active');
        answer.classList.remove('active');
      } else {
        this.classList.add('active');
        answer.classList.add('active');
      }
    });
  });
});

// Testimonial Carousel
document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (!slides.length || !dots.length) return;

  let currentIndex = 0;

  // Function to change slide
  function showSlide(index) {
    // Handle index bounds
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // Update currentIndex
    currentIndex = index;

    // Hide all slides and remove active class from dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide and add active class to current dot
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  // Initialize dots click events
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  // Previous and Next button events
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
  }

  // Auto-advance slides every 5 seconds
  let slideInterval = setInterval(() => showSlide(currentIndex + 1), 5000);

  // Pause auto-advance on hover
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
    });
  }
});

// Scroll Reveal Animations
document.addEventListener('DOMContentLoaded', function () {
  // Add scroll classes to elements we want to animate
  const animateElements = [
    '.step-card',
    '.feature-card',
    '.countries-container',
    '.journey-step',
    '.journey-visual',
    '.testimonial-card',
    '.faq-item',
    '.quick-start',
    '.contact-container'
  ];

  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  }

  // Function to add animation class when element is in viewport
  function handleScrollAnimation() {
    animateElements.forEach(selector => {
      document.querySelectorAll(selector).forEach((element, index) => {
        if (isInViewport(element)) {
          // Add delay based on index for staggered animation
          setTimeout(() => {
            element.classList.add('scroll-visible');
          }, index * 100);
        }
      });
    });
  }

  // Initial check on page load
  handleScrollAnimation();

  // Check on scroll
  window.addEventListener('scroll', handleScrollAnimation);

  // Apply scroll animation to sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (isInViewport(section)) {
      section.classList.add('section-visible');
    }
  });

  window.addEventListener('scroll', function () {
    sections.forEach(section => {
      if (isInViewport(section)) {
        section.classList.add('section-visible');
      }
    });
  });

  // Add CSS classes
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .step-card, .feature-card, .countries-container,
    .journey-step, .journey-visual, .testimonial-card,
    .faq-item, .quick-start, .contact-container {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .scroll-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .section-visible .section-heading::after {
      width: 60px;
      transition: width 0.5s ease-out;
    }

    .section-heading::after {
      width: 0;
    }
  `;
  document.head.appendChild(styleElement);
});

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const headerHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: targetPosition - headerHeight - 20, // Additional 20px buffer
        behavior: 'smooth'
      });
    });
  });
});

// Form Validation
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      let isValid = true;
      const formInputs = contactForm.querySelectorAll('.form-input');

      formInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          highlightField(input, true);
        } else {
          highlightField(input, false);
        }

        // Email validation
        if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value)) {
            isValid = false;
            highlightField(input, true);
          }
        }
      });

      if (isValid) {
        // Show success message
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Simulate form submission (in a real app, this would be an AJAX request)
        setTimeout(() => {
          // Reset form
          contactForm.reset();

          // Create success message
          const successMessage = document.createElement('div');
          successMessage.className = 'form-success';
          successMessage.innerHTML = `
            <div style="background-color: rgba(133, 237, 112, 0.1); padding: 16px; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--fluxr-green-dark); margin-right: 8px;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Message sent successfully! We'll get back to you soon.</span>
            </div>
          `;

          // Insert success message before the form
          contactForm.parentNode.insertBefore(successMessage, contactForm);

          // Reset button
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;

          // Remove success message after 5 seconds
          setTimeout(() => {
            successMessage.remove();
          }, 5000);
        }, 1500);
      }
    });

    // Function to highlight field with error
    function highlightField(field, isError) {
      if (isError) {
        field.style.borderColor = '#EF4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
      } else {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      }
    }

    // Reset field style on input
    const formInputs = contactForm.querySelectorAll('.form-input');
    formInputs.forEach(input => {
      input.addEventListener('input', function () {
        highlightField(this, false);
      });
    });
  }
});

// Sticky Navigation Highlight
document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollPosition = window.scrollY;
    const headerHeight = document.querySelector('.navbar').offsetHeight;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100; // Add offset for better UX
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('nav-active');
        });

        // Add active class to corresponding link
        document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('nav-active');
      }
    });
  }

  // Add active class style
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .nav-active {
      color: var(--fluxr-dark) !important;
      font-weight: 600;
      position: relative;
    }

    .nav-active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--fluxr-green);
      border-radius: 1px;
    }
  `;
  document.head.appendChild(styleElement);

  window.addEventListener('scroll', highlightNavOnScroll);
  highlightNavOnScroll(); // Initial check
});

// Add page load fade in animation
document.addEventListener('DOMContentLoaded', function () {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  // Trigger fade in
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

document.addEventListener('DOMContentLoaded', function () {
  const testEmojiEl = document.createElement('span');
  testEmojiEl.style.opacity = '0';
  testEmojiEl.textContent = '🇿🇦';
  document.body.appendChild(testEmojiEl);

  // Check if emoji renders properly (has width)
  const emojiWorks = testEmojiEl.offsetWidth > 0;
  document.body.removeChild(testEmojiEl);

  if (!emojiWorks) {
    document.body.classList.add('emoji-fallback-enabled');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const journeySteps = document.querySelectorAll('.journey-step');
  const journeyDots = document.querySelectorAll('.journey-dot');
  const phoneImages = document.querySelectorAll('.phone-image');
  const copyButtons = document.querySelectorAll('.copy-btn');
  const animatedLines = document.querySelectorAll('.animated-line');

  let currentStep = 2; // Start with step 2 active (as in the image)
  let autoScrollInterval;
  const autoScrollDelay = 5000; // 5 seconds per step

  // Initialize
  updateActiveStep();
  startAutoScroll();

  // Handle step clicks
  journeySteps.forEach(step => {
    step.addEventListener('click', function () {
      // Stop auto-scroll when user interacts
      clearInterval(autoScrollInterval);

      // Update current step
      currentStep = parseInt(this.dataset.step);
      updateActiveStep();

      // Restart auto-scroll after a delay
      setTimeout(startAutoScroll, 15000); // Restart after 15 seconds of inactivity
    });
  });

  // Handle dot clicks
  journeyDots.forEach(dot => {
    dot.addEventListener('click', function (e) {
      e.stopPropagation();

      // Stop auto-scroll when user interacts
      clearInterval(autoScrollInterval);

      // Update current step
      currentStep = parseInt(this.dataset.step);
      updateActiveStep();

      // Restart auto-scroll after a delay
      setTimeout(startAutoScroll, 15000);
    });
  });

  // Copy button functionality
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent step activation

      const codeElement = this.previousElementSibling;
      const textToCopy = codeElement.textContent;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Success feedback
          const originalSVG = this.innerHTML;

          this.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#85ED70" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;

          // Reset after 2 seconds
          setTimeout(() => {
            this.innerHTML = originalSVG;
          }, 2000);
        })
        .catch(err => {
          console.error('Copy failed:', err);
        });
    });
  });

  // Start auto-scrolling function
  function startAutoScroll() {
    // Clear any existing interval
    clearInterval(autoScrollInterval);

    // Set new interval
    autoScrollInterval = setInterval(() => {
      // Move to next step or loop back to first
      currentStep = currentStep % 4 + 1;
      updateActiveStep();
    }, autoScrollDelay);
  }

  // Update active step
  function updateActiveStep() {
    // Reset all animations
    animatedLines.forEach(line => {
      line.classList.remove('animating');
    });

    // Update steps
    journeySteps.forEach(step => {
      const stepNum = parseInt(step.dataset.step);

      if (stepNum === currentStep) {
        step.classList.add('active');

        // Start animating the line after a small delay
        setTimeout(() => {
          const line = step.querySelector('.animated-line');
          if (line) line.classList.add('animating');
        }, 100);
      } else {
        step.classList.remove('active');
      }
    });

    // Update dots
    journeyDots.forEach(dot => {
      const dotNum = parseInt(dot.dataset.step);

      if (dotNum === currentStep) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update phone images
    phoneImages.forEach(img => {
      const imgStep = parseInt(img.dataset.step);

      if (imgStep === currentStep) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });
  }

  // Handle page visibility changes (pause auto-scroll when tab is inactive)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(autoScrollInterval);
    } else {
      startAutoScroll();
    }
  });
});