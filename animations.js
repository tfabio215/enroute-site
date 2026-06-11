/* ============================================================
   ENROUTE IMPORTS — Animation Engine
   GSAP + ScrollTrigger powered
   ============================================================ */

(function() {
  'use strict';

  // ── Wait for GSAP ──────────────────────────────────────────
  function initAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // ── Page Loader ─────────────────────────────────────────
    const loader = document.querySelector('.page-loader');
    if (loader) {
      const loaderLogo = loader.querySelector('.loader-logo');
      const loaderBar  = loader.querySelector('.loader-bar');

      const tl = gsap.timeline({
        onComplete: () => {
          loader.classList.add('done');
          document.body.style.overflow = '';
          initHero();
          setTimeout(() => loader.remove(), 800);
        }
      });

      document.body.style.overflow = 'hidden';

      tl.to(loaderLogo, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' })
        .to(loaderBar,  { width: '120px', duration: .9, ease: 'power2.inOut' }, '-=.3')
        .to([loaderLogo, loaderBar], { opacity: 0, duration: .4, ease: 'power2.in' }, '+=.3');
    } else {
      document.body.style.overflow = '';
      initHero();
    }

    // ── Custom Cursor ────────────────────────────────────────
    const cursor = document.querySelector('.cursor');
    const ring   = document.querySelector('.cursor-ring');
    if (cursor && ring && window.matchMedia('(pointer:fine)').matches) {
      let mx = window.innerWidth/2, my = window.innerHeight/2;
      let rx = mx, ry = my;

      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

      gsap.ticker.add(() => {
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
        rx += (mx - rx) * .12;
        ry += (my - ry) * .12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
      });

      document.querySelectorAll('a,button,.oil-card,.product-detail-card,.feat,.sku-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
      });
    }

    // ── Hero Animations ──────────────────────────────────────
    function initHero() {
      const heroSection = document.querySelector('.hero');
      if (!heroSection) { initScrollAnimations(); return; }

      const kicker   = heroSection.querySelector('.hero-kicker');
      const h1       = heroSection.querySelector('h1');
      const lead     = heroSection.querySelector('.hero-lead');
      const actions  = heroSection.querySelector('.hero-actions');
      const trust    = heroSection.querySelector('.hero-trust');
      const visual   = heroSection.querySelector('.hero-visual');
      const floatTag = heroSection.querySelector('.hero-float-tag');
      const statCard = heroSection.querySelector('.hero-stat-card');
      const scrollInd= heroSection.querySelector('.hero-scroll');

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (kicker) tl.to(kicker, { opacity: 1, duration: .8 }, 0);

      if (h1) {
        const lines = h1.querySelectorAll('.line') || [h1];
        const target = lines.length > 1 ? lines : h1;
        tl.from(target, {
          y: 60, opacity: 0, duration: 1.1,
          stagger: .15, ease: 'power3.out'
        }, .2);
      }

      if (lead)    tl.to(lead,    { opacity: 1, y: 0, duration: .8 }, .9);
      if (actions) tl.to(actions, { opacity: 1, y: 0, duration: .7 }, 1.1);
      if (trust)   tl.to(trust,   { opacity: 1, y: 0, duration: .7 }, 1.3);

      if (visual) {
        tl.from(visual, { opacity: 0, x: 40, duration: 1.0, ease: 'power2.out' }, .5);
      }
      if (floatTag) tl.to(floatTag, { opacity: 1, duration: .5 }, 1.6);
      if (statCard) tl.from(statCard, { opacity: 0, scale: .85, duration: .6, ease: 'back.out(1.5)' }, 1.4);
      if (scrollInd) tl.to(scrollInd, { opacity: 1, duration: .5 }, 2.0);

      initScrollAnimations();
    }

    // ── Scroll Animations ────────────────────────────────────
    function initScrollAnimations() {

      // Generic reveal
      gsap.utils.toArray('.reveal').forEach(el => {
        const dir = el.classList.contains('left-in') ? { x: -40 }
                  : el.classList.contains('right-in') ? { x: 40 }
                  : el.classList.contains('scale-in') ? { scale: .93 }
                  : { y: 40 };

        const delay = parseFloat(getComputedStyle(el).transitionDelay) || 0;

        gsap.from(el, {
          ...dir, opacity: 0, duration: .9,
          ease: 'power3.out', delay,
          scrollTrigger: {
            trigger: el, start: 'top 88%',
            toggleActions: 'play none none none'
          }
        });
      });

      // Eyebrows
      gsap.utils.toArray('.eyebrow').forEach(el => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        });
        tl.to(el, { opacity: 1, x: 0, duration: .7, ease: 'power2.out' });
      });

      // Image reveals
      gsap.utils.toArray('.img-reveal').forEach(wrap => {
        const img = wrap.querySelector('img');
        if (!img) return;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrap, start: 'top 85%', toggleActions: 'play none none none' }
        });
        tl.to(wrap, { '--reveal-x': '100%', duration: .9, ease: 'power3.inOut' })
          .from(img, { scale: 1.1, duration: 1.1, ease: 'power2.out' }, 0);
      });

      // Stat counters
      gsap.utils.toArray('.stat-n[data-count]').forEach(el => {
        const end = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        gsap.from({ val: 0 }, {
          val: end, duration: 1.8, ease: 'power2.out',
          onUpdate: function() { el.textContent = Math.round(this.targets()[0].val) + suffix; },
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });

      // Oil cards stagger
      const oilGrids = document.querySelectorAll('.oil-grid');
      oilGrids.forEach(grid => {
        const cards = grid.querySelectorAll('.oil-card');
        gsap.from(cards, {
          y: 50, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 80%', toggleActions: 'play none none none' }
        });
      });

      // Feature grid stagger
      document.querySelectorAll('.feat-grid').forEach(grid => {
        gsap.from(grid.querySelectorAll('.feat'), {
          y: 40, opacity: 0, duration: .7, stagger: .1, ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' }
        });
      });

      // Product detail cards
      document.querySelectorAll('.product-detail-grid').forEach(grid => {
        gsap.from(grid.querySelectorAll('.product-detail-card'), {
          y: 50, opacity: 0, duration: .8, stagger: .12, ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' }
        });
      });

      // Stats row
      document.querySelectorAll('.stats-row > div').forEach((el, i) => {
        gsap.from(el, {
          y: 30, opacity: 0, duration: .7, delay: i * .1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
      });

      // Section headings
      document.querySelectorAll('.display').forEach(el => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
      });

      // Parallax on dark section backgrounds
      document.querySelectorAll('.section--ink .hero-canvas, .page-hero-bg').forEach(el => {
        gsap.to(el, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, scrub: true }
        });
      });

      // Brand half parallax images
      document.querySelectorAll('.brand-product-img').forEach(img => {
        gsap.to(img, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: { trigger: img.closest('.brand-half'), scrub: true }
        });
      });

      // Section gold line reveals
      document.querySelectorAll('.gold-divider').forEach(el => {
        gsap.from(el, {
          scaleX: 0, transformOrigin: 'left',
          duration: .8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        });
      });

      // Floating CTA
      const fcta = document.getElementById('floatingCta');
      if (fcta) {
        ScrollTrigger.create({
          start: 400,
          onEnter: () => fcta.classList.add('show'),
          onLeaveBack: () => fcta.classList.remove('show')
        });
      }

      // Nav hide on scroll down
      const nav = document.getElementById('nav');
      if (nav) {
        let lastY = 0;
        ScrollTrigger.create({
          onUpdate: self => {
            const y = self.scroll();
            nav.classList.toggle('scrolled', y > 40);
            nav.classList.toggle('hide', y > 200 && y > lastY + 10);
            if (y < lastY) nav.classList.remove('hide');
            lastY = y;
          }
        });
      }
    }

    // ── 3D Tilt on Oil Cards ──────────────────────────────────
    document.querySelectorAll('.oil-card,.product-detail-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const dx    = (e.clientX - cx) / (rect.width  / 2);
        const dy    = (e.clientY - cy) / (rect.height / 2);
        card.style.setProperty('--mx', `${(dx * 0.5 + 0.5) * 100}%`);
        card.style.setProperty('--my', `${(dy * 0.5 + 0.5) * 100}%`);
        gsap.to(card, {
          rotateX: -dy * 4, rotateY: dx * 4,
          duration: .4, ease: 'power2.out',
          transformPerspective: 800
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: .6, ease: 'elastic.out(1,.5)' });
      });
    });

    // ── Magnetic Buttons ──────────────────────────────────────
    document.querySelectorAll('.btn-primary,.btn-olive').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width/2)  * .25;
        const dy = (e.clientY - rect.top  - rect.height/2) * .25;
        gsap.to(btn, { x: dx, y: dy, duration: .4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.5)' });
      });
    });

    // ── Number counters (fallback for non data-count) ─────────
    document.querySelectorAll('.stat-n:not([data-count])').forEach(el => {
      const txt = el.textContent.trim();
      if (/^\d+\+?$/.test(txt)) {
        const num = parseInt(txt);
        const suf = txt.includes('+') ? '+' : '';
        el.textContent = '0';
        gsap.to({ val: 0 }, {
          val: num, duration: 1.8, ease: 'power2.out',
          onUpdate: function() { el.textContent = Math.round(this.targets()[0].val) + suf; },
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      }
    });

    // ── Hero h1 line wrapping ─────────────────────────────────
    // wrap each text node in a .line span for animation
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1 && !heroH1.querySelector('.line')) {
      const html = heroH1.innerHTML;
      heroH1.innerHTML = html.replace(/([^<\n]+(?:<em>[^<]*<\/em>[^<\n]*)?)/g, match => {
        if (match.trim()) return `<span class="line" style="display:block;overflow:hidden;padding-bottom:.05em;"><span class="line-inner" style="display:block;">${match}</span></span>`;
        return match;
      });
      gsap.from(heroH1.querySelectorAll('.line-inner'), {
        y: '100%', opacity: 0, duration: 1.1, stagger: .15, ease: 'power3.out', delay: .4
      });
    }

    console.log('✦ Enroute Imports animations loaded');
  }

  // ── Boot ─────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

})();
