/* ===== DOM ELEMENTS ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formResult = document.getElementById('formResult');

/* ===== NAVBAR — Scroll Behaviour ===== */
window.addEventListener('scroll', () => {
  // Add scrolled class for solid navbar background
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('.section, .hero');
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ===== NAVBAR — Mobile Hamburger Toggle ===== */
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');

  // Animate hamburger to X
  const lines = navToggle.querySelectorAll('.hamburger-line');
  if (navMenu.classList.contains('open')) {
    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    lines[1].style.opacity = '0';
    lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    lines[0].style.transform = 'none';
    lines[1].style.opacity = '1';
    lines[2].style.transform = 'none';
  }
});

// Close mobile menu when a link is clicked
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    const lines = navToggle.querySelectorAll('.hamburger-line');
    lines[0].style.transform = 'none';
    lines[1].style.opacity = '1';
    lines[2].style.transform = 'none';
  });
});

/* ===== SCROLL ANIMATIONS — Intersection Observer ===== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with the animate-fade-in class (except hero ones)
document.querySelectorAll('.section .animate-fade-in').forEach((el) => {
  observer.observe(el);
});

/* ===== 3D CARD TILT — Cursor-based Rotation ===== */
const tiltCards = document.querySelectorAll('.tilt-card');
const maxTilt = 5; // Maximum tilt in degrees

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const centreX = rect.left + rect.width / 2;
    const centreY = rect.top + rect.height / 2;

    // Calculate offset from centre (-1 to 1)
    const offsetX = (e.clientX - centreX) / (rect.width / 2);
    const offsetY = (e.clientY - centreY) / (rect.height / 2);

    // Apply rotation (inverted for natural feel)
    const rotateX = -offsetY * maxTilt;
    const rotateY = offsetX * maxTilt;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

/* ===== SMOOTH SCROLLING — Anchor Links ===== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ===== CONTACT FORM — Web3Forms Submission ===== */
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic client-side validation
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showFormResult('Please fill in all required fields.', 'error');
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormResult('Please enter a valid email address.', 'error');
    return;
  }

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const formData = new FormData(contactForm);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      showFormResult('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
    } else {
      showFormResult('Something went wrong. Please try again later.', 'error');
    }
  } catch (error) {
    showFormResult('Network error. Please check your connection and try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});

function showFormResult(message, type) {
  formResult.textContent = message;
  formResult.className = `form-result ${type}`;
  formResult.style.display = 'block';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    formResult.style.display = 'none';
  }, 5000);
}
