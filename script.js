/* ════════════════════════════════════════════
   RANU SHRIVASTAVA — PORTFOLIO SCRIPTS
   ════════════════════════════════════════════ */

'use strict';

/* ─── 1. Custom Cursor ─── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Scale on interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .stat-card, .skill-category, .contact-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform   = 'translate(-50%, -50%) scale(2.5)';
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      follower.style.borderColor = 'rgba(201, 168, 76, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform   = 'translate(-50%, -50%) scale(1)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.borderColor = '';
    });
  });

  // Hide on mobile
  if ('ontouchstart' in window) {
    cursor.style.display   = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('button').forEach(b => b.style.cursor = 'pointer');
  }
})();


/* ─── 2. Navbar scroll ─── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handler = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
})();


/* ─── 3. Mobile Menu ─── */
(function initMobileMenu() {
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks   = document.querySelectorAll('.mob-link');
  if (!burger || !mobileMenu) return;

  let open = false;

  function toggle() {
    open = !open;
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  burger.addEventListener('click', toggle);
  mobLinks.forEach(link => link.addEventListener('click', () => { if (open) toggle(); }));
})();


/* ─── 4. Reveal on Scroll ─── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));
})();


/* ─── 5. Counter Animation ─── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const formatNumber = (num, target) => {
    if (String(target).includes('.')) {
      return parseFloat(num).toFixed(2);
    }
    return Math.round(num);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.target);
      const duration = 1800;
      const start    = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased    = 1 - (1 - progress) * (1 - progress);
        el.textContent = formatNumber(eased * target, target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = formatNumber(target, target);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ─── 6. Smooth Active Nav Link ─── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ─── 7. Contact Form — EmailJS ─── */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  /* ══════════════════════════════════════════════════
     EMAILJS SETUP — Fill in your 3 values below
     Step 1: Go to https://www.emailjs.com/ → Sign up free
     Step 2: Add Email Service (Gmail) → copy Service ID
     Step 3: Create Email Template → copy Template ID
             In template use: {{from_name}}, {{from_email}}, {{message}}
     Step 4: Go to Account → copy Public Key
     ══════════════════════════════════════════════════ */
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace

  // Initialise EmailJS once
  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn      = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;

    // Guard: if keys not filled in yet
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      alert('EmailJS is not configured yet. Please add your Public Key, Service ID, and Template ID in script.js');
      return;
    }

    // Loading state
    btn.innerHTML = 'Sending… <span class="btn-arrow">⏳</span>';
    btn.disabled  = true;
    btn.style.opacity = '0.7';

    const templateParams = {
      from_name  : form.querySelector('#name').value.trim(),
      from_email : form.querySelector('#email').value.trim(),
      message    : form.querySelector('#message').value.trim(),
      to_name    : 'Ranu Shrivastava',
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function () {
        // Success
        btn.innerHTML  = origHTML;
        btn.disabled   = false;
        btn.style.opacity = '';
        form.reset();
        // Remove focused class from all groups
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('focused'));
        if (success) {
          success.classList.add('show');
          setTimeout(() => success.classList.remove('show'), 5000);
        }
      })
      .catch(function (err) {
        // Error
        console.error('EmailJS error:', err);
        btn.innerHTML  = origHTML;
        btn.disabled   = false;
        btn.style.opacity = '';
        alert('Oops! Something went wrong. Please try emailing directly at ranushrii6@gmail.com');
      });
  });

  // Float label effect
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      if (!input.value) input.parentElement.classList.remove('focused');
    });
  });
})();


/* ─── 8. Skill tags hover ripple ─── */
(function initSkillTags() {
  document.querySelectorAll('.skill-tags span').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.2s ease';
    });
  });
})();


/* ─── 9. Parallax Hero Orbs ─── */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 12;
      orb.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
  });
})();


/* ─── 10. Section progress indicator (title bar) ─── */
(function initProgressBar() {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position:   'fixed',
    top:        '0',
    left:       '0',
    height:     '2px',
    background: 'var(--gold)',
    zIndex:     '9999',
    transition: 'width 0.1s linear',
    width:      '0%',
    pointerEvents: 'none'
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();


/* ─── 11. Typewriter for eyebrow (optional flair) ─── */
(function initTypewriter() {
  const eyebrow = document.querySelector('.hero__eyebrow');
  if (!eyebrow) return;

  const text = eyebrow.textContent.trim();
  eyebrow.textContent = '';
  eyebrow.style.visibility = 'visible';
  eyebrow.style.opacity = '1';

  let i = 0;
  const speed = 55;

  // Start after initial fade-in delay
  setTimeout(() => {
    const interval = setInterval(() => {
      eyebrow.textContent = text.slice(0, i) + (i < text.length ? '|' : '');
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
  }, 600);
})();


/* ─── 12. Award list stagger on reveal ─── */
(function initAwardStagger() {
  const awardBlocks = document.querySelectorAll('.award-block');
  awardBlocks.forEach(block => {
    const items = block.querySelectorAll('.award-list li');
    const blockObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((item, i) => {
            item.style.opacity   = '0';
            item.style.transform = 'translateX(-15px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => {
              item.style.opacity   = '1';
              item.style.transform = 'translateX(0)';
            }, 200 + i * 100);
          });
          blockObserver.unobserve(block);
        }
      });
    }, { threshold: 0.3 });
    blockObserver.observe(block);
  });
})();

/* ─── 13. Certificate Lightbox ─── */
(function initLightbox() {

  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose   = document.getElementById('lightboxClose');
  const lbInner   = document.getElementById('lightboxInner');

  if (!lightbox) return;

  /* ── Open ── */
  function openLightbox(src, caption) {
    lbCaption.textContent = caption || '';
    lbImg.style.opacity   = '0';
    lbImg.src             = '';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    /* Pre-load image then fade in */
    const tmp = new Image();
    tmp.onload = function () {
      lbImg.src = src;
      lbImg.alt = caption;
      requestAnimationFrame(() => {
        lbImg.style.transition = 'opacity 0.35s ease';
        lbImg.style.opacity    = '1';
      });
    };
    tmp.onerror = function () {
      lbImg.src             = src;
      lbImg.style.opacity   = '1';
    };
    tmp.src = src;

    document.addEventListener('keydown', onKey);
  }

  /* ── Close ── */
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
    document.removeEventListener('keydown', onKey);
  }

  /* ── Keyboard ── */
  function onKey(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  /* ── Click on any cert-card (event delegation) ── */
  document.addEventListener('click', function (e) {
    /* Walk up from click target to find cert-card */
    let el = e.target;
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains('cert-card')) {
        const src     = el.getAttribute('data-src');
        const caption = el.getAttribute('data-caption');
        if (src) openLightbox(src, caption || '');
        return;
      }
      el = el.parentElement;
    }
  });

  /* ── Close on backdrop (not inner box) ── */
  lightbox.addEventListener('click', function (e) {
    if (lbInner && lbInner.contains(e.target)) return;
    closeLightbox();
  });

  /* ── Close button ── */
  if (lbClose) {
    lbClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  /* Expose globally */
  window.openLightbox  = openLightbox;
  window.closeLightbox = closeLightbox;

})();
