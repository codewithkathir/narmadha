/**
 * Main Application Logic
 */
(function () {
  'use strict';

  /* ---- Loading Screen ---- */
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 2200);
    });
  }

  /* ---- Scroll Progress ---- */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---- Navigation ---- */
  function initNavigation() {
    var nav = document.getElementById('main-nav');
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    var links = document.querySelectorAll('.nav-link');

    var mobileMenu = document.getElementById('nav-menu-mobile');

    function closeMenus() {
      if (menu) {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
      }
      if (mobileMenu) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      }
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        var target = window.innerWidth < 768 && mobileMenu ? mobileMenu : menu;
        if (target) {
          target.classList.toggle('hidden');
          target.classList.toggle('flex');
        }
      });
    }

    document.querySelectorAll('#nav-menu a, #nav-menu-mobile a').forEach(function (link) {
      link.addEventListener('click', closeMenus);
    });

    window.addEventListener('scroll', function () {
      if (!nav) return;
      if (window.scrollY > 80) {
        nav.classList.add('shadow-md');
      } else {
        nav.classList.remove('shadow-md');
      }
    }, { passive: true });

    /* Active section highlight */
    var sections = document.querySelectorAll('section[id]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---- Smooth scroll for anchor links ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var navHeight = document.getElementById('main-nav')?.offsetHeight || 0;
          var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---- AOS Init (disabled — GSAP handles all scroll animations) ---- */
  function initAOS() {
    /* intentionally empty to prevent double animations / flicker */
  }

  /* ---- Gallery Lightbox ---- */
  function initGallery() {
    var filters = document.querySelectorAll('.gallery-filter');
    var items = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var closeBtn = document.getElementById('lightbox-close');
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');
    var currentIndex = 0;
    var visibleItems = [];

    function updateVisible() {
      visibleItems = Array.from(items).filter(function (item) {
        return !item.classList.contains('hidden') && item.style.display !== 'none';
      });
    }

    filters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        var category = this.dataset.filter;
        filters.forEach(function (f) { f.classList.remove('active'); });
        this.classList.add('active');

        items.forEach(function (item) {
          if (category === 'all' || item.dataset.category === category) {
            item.classList.remove('hidden');
            item.style.display = '';
          } else {
            item.classList.add('hidden');
            item.style.display = 'none';
          }
        });
        updateVisible();
      });
    });

    function openLightbox(index) {
      updateVisible();
      if (!visibleItems.length) return;
      currentIndex = index;
      var img = visibleItems[currentIndex].querySelector('img');
      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
      lightbox?.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox?.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
      var img = visibleItems[currentIndex].querySelector('img');
      if (lightboxImg && img) {
        if (typeof gsap !== 'undefined') {
          gsap.to(lightboxImg, { opacity: 0, duration: 0.2, onComplete: function () {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            gsap.to(lightboxImg, { opacity: 1, duration: 0.3 });
          }});
        } else {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
        }
      }
    }

    items.forEach(function (item, i) {
      item.addEventListener('click', function () {
        updateVisible();
        var idx = visibleItems.indexOf(item);
        openLightbox(idx >= 0 ? idx : 0);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', function () { navigate(-1); });
    nextBtn?.addEventListener('click', function () { navigate(1); });

    lightbox?.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox?.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    updateVisible();
  }

  /* ---- Button micro-interactions (CSS only — no GSAP scale) ---- */
  function initButtonEffects() {}

  /* ---- Lazy load enhancement ---- */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return;

    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset.src;
            }
            observer.unobserve(img);
          }
        });
      });
      lazyImages.forEach(function (img) { observer.observe(img); });
    }
  }

  /* ---- Init ---- */
  function init() {
    document.documentElement.classList.remove('no-js');
    document.body.classList.add('overflow-hidden');
    initLoader();
    initScrollProgress();
    initNavigation();
    initSmoothScroll();
    initAOS();
    initGallery();
    initButtonEffects();
    initLazyLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
