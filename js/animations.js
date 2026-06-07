/**
 * Smooth GSAP animations — single system, no flicker
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.innerWidth < 768;
  var heroPlayed = false;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  /* ---- Lightweight hero particles only ---- */
  function initParticles() {
    if (reduced || typeof gsap === 'undefined') return;

    var layer = document.getElementById('hero-particles');
    if (!layer) return;

    var colors = ['#8b1538', '#a83255', '#d4819a'];
    var count = mobile ? 8 : 14;
    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      var size = rand(20, 26);
      var color = colors[Math.floor(Math.random() * colors.length)];
      el.className = 'heart-particle';
      el.innerHTML =
        '<svg viewBox="0 0 20 18" width="' + size + '" height="' + (size * 0.9) + '" aria-hidden="true">' +
        '<path d="M10 16 C10 16 2.5 11 2.5 6.5 C2.5 4 4.5 2 7 2 C8.5 2 9.5 3 10 4.5 C10.5 3 11.5 2 13 2 C15.5 2 17.5 4 17.5 6.5 C17.5 11 10 16 10 16 Z" fill="' + color + '" opacity="0.55"/></svg>';
      el.style.left = rand(0, 100) + '%';
      el.style.top = rand(-10, 30) + '%';
      layer.appendChild(el);

      gsap.to(el, {
        y: window.innerHeight * 1.15,
        x: rand(-30, 30),
        rotation: rand(-90, 90),
        duration: rand(14, 22),
        delay: rand(0, 4),
        repeat: -1,
        ease: 'none',
      });
    }

    if (!mobile) {
      for (var b = 0; b < 3; b++) {
        var bird = document.createElement('div');
        bird.className = 'bird';
        bird.innerHTML = '<svg viewBox="0 0 40 20" width="36" height="18" aria-hidden="true"><path d="M2 12 Q10 4 20 10 Q30 4 38 12" fill="none" stroke="#5c0d25" stroke-width="1" opacity="0.25"/></svg>';
        layer.appendChild(bird);
        gsap.set(bird, { x: '-8vw', y: rand(8, 35) + 'vh' });
        gsap.to(bird, {
          x: '108vw',
          duration: rand(18, 26),
          delay: b * 4,
          repeat: -1,
          ease: 'none',
        });
      }
    }
  }

  /* ---- Unified scroll reveal ---- */
  function initScrollReveals() {
    if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ limitCallbacks: true });

    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
            toggleActions: 'play none none none',
          },
        }
      );
    });

    gsap.utils.toArray('.reveal-group').forEach(function (group) {
      var items = group.querySelectorAll('.reveal-item');
      if (!items.length) return;

      var isFamily = group.classList.contains('family-grid');
      var fromVars = isFamily
        ? { autoAlpha: 0, scale: 0.88, y: 16 }
        : { autoAlpha: 0, y: 20 };
      var toVars = isFamily
        ? { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'back.out(1.4)' }
        : { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out' };

      gsap.fromTo(items, fromVars, Object.assign({}, toVars, {
        scrollTrigger: {
          trigger: group,
          start: 'top 90%',
          once: true,
          toggleActions: 'play none none none',
        },
      }));
    });

    /* Family member photo stagger */
    gsap.utils.toArray('.family-members').forEach(function (grid) {
      var members = grid.querySelectorAll('.family-member');
      if (!members.length) return;

      gsap.fromTo(
        members,
        { autoAlpha: 0, scale: 0.85, rotation: -3 },
        {
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: grid,
            start: 'top 88%',
            once: true,
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }

  /* ---- Interactive love story journey ---- */
  function initLoveStory() {
    var track = document.getElementById('journey-track');
    if (!track) return;

    var milestones = track.querySelectorAll('.journey-milestone');
    var lineFill = document.getElementById('journey-line-fill');
    if (!milestones.length) return;

    milestones.forEach(function (milestone) {
      milestone.addEventListener('click', function () {
        var open = milestone.classList.contains('is-expanded');
        milestones.forEach(function (m) { m.classList.remove('is-expanded'); });
        if (!open) milestone.classList.add('is-expanded');
      });
      milestone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          milestone.click();
        }
      });
    });

    if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      milestones.forEach(function (m) { m.classList.add('is-visible'); });
      if (lineFill) lineFill.style.height = '100%';
      return;
    }

    milestones.forEach(function (milestone, index) {
      gsap.fromTo(
        milestone,
        { autoAlpha: 0, y: 24, x: index % 2 === 0 ? -20 : 20 },
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: milestone,
            start: 'top 92%',
            once: true,
            toggleActions: 'play none none none',
          },
          onComplete: function () {
            milestone.classList.add('is-visible');
            gsap.set(milestone, { clearProps: 'transform,opacity,visibility' });
          },
        }
      );
    });

    if (lineFill) {
      gsap.fromTo(
        lineFill,
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: 'top 85%',
            end: 'bottom 75%',
            scrub: 0.3,
          },
        }
      );
    }
  }

  /* ---- Interactive reception ---- */
  function initReception() {
    var root = document.getElementById('reception-experience');
    if (!root) return;

    var interactive = document.getElementById('reception-interactive');
    var tabs = root.querySelectorAll('.reception-tab');
    var panels = root.querySelectorAll('.reception-panel');
    var indicator = document.getElementById('reception-tab-indicator');
    var dots = root.querySelectorAll('.reception-dot');
    var groom = root.querySelector('.reception-couple-groom');
    var bride = root.querySelector('.reception-couple-bride');
    var glassWrap = root.querySelector('.reception-glass-wrap');
    var bgCouples = root.closest('.reception-section')
      ? root.closest('.reception-section').querySelectorAll('.reception-bg-couple')
      : [];

    var tabIds = ['date', 'time', 'venue', 'celebrate'];
    var activeIndex = 0;
    var autoTimer = null;
    var userPaused = false;
    var panelTween = null;

    function moveIndicator(index) {
      if (!indicator) return;
      indicator.style.transform = 'translateX(' + index * 100 + '%)';
    }

    function updateTabUI(index) {
      tabs.forEach(function (tab, i) {
        var isActive = i === index;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });

      moveIndicator(index);
    }

    function showPanelInstant(index) {
      panels.forEach(function (panel, i) {
        var isActive = i === index;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        if (typeof gsap !== 'undefined') {
          gsap.set(panel, {
            opacity: isActive ? 1 : 0,
            visibility: isActive ? 'visible' : 'hidden',
            y: 0,
            pointerEvents: isActive ? 'auto' : 'none',
          });
        }
      });
      activeIndex = index;
    }

    function setActive(index) {
      if (index < 0 || index >= tabIds.length) return;
      if (index === activeIndex && !panelTween) return;

      updateTabUI(index);

      if (panelTween) {
        panelTween.kill();
        panelTween = null;
      }
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(panels);
      }

      var prevPanel = panels[activeIndex];
      var nextPanel = panels[index];

      if (reduced || typeof gsap === 'undefined' || prevPanel === nextPanel) {
        showPanelInstant(index);
        return;
      }

      panels.forEach(function (panel, i) {
        if (i !== activeIndex && i !== index) {
          panel.classList.remove('is-active');
          panel.setAttribute('aria-hidden', 'true');
          gsap.set(panel, { opacity: 0, visibility: 'hidden', y: 0, pointerEvents: 'none' });
        }
      });

      nextPanel.classList.add('is-active');
      nextPanel.setAttribute('aria-hidden', 'false');
      gsap.set(nextPanel, { visibility: 'visible', opacity: 0, y: 10, pointerEvents: 'none' });

      panelTween = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: function () {
          prevPanel.classList.remove('is-active');
          prevPanel.setAttribute('aria-hidden', 'true');
          gsap.set(prevPanel, { opacity: 0, visibility: 'hidden', y: 0, pointerEvents: 'none' });
          gsap.set(nextPanel, { y: 0, pointerEvents: 'auto', clearProps: 'transform' });
          activeIndex = index;
          panelTween = null;
        },
      });

      panelTween
        .to(prevPanel, { opacity: 0, y: -8, duration: 0.22, ease: 'power2.in' }, 0)
        .to(nextPanel, { opacity: 1, y: 0, duration: 0.32 }, 0.06);
    }

    showPanelInstant(0);
    updateTabUI(0);

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        userPaused = true;
        clearAuto();
        setActive(index);
      });
    });

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        userPaused = true;
        clearAuto();
        setActive(index);
      });
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        userPaused = true;
        clearAuto();
        setActive((activeIndex + 1) % tabIds.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        userPaused = true;
        clearAuto();
        setActive((activeIndex - 1 + tabIds.length) % tabIds.length);
      }
    });

    function clearAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAuto() {
      if (reduced || userPaused) return;
      clearAuto();
      autoTimer = setInterval(function () {
        setActive((activeIndex + 1) % tabIds.length);
      }, 5000);
    }

    if (interactive) {
      interactive.addEventListener('mouseenter', clearAuto);
      interactive.addEventListener('mouseleave', startAuto);
      interactive.addEventListener('focusin', clearAuto);
      interactive.addEventListener('focusout', function () {
        if (!userPaused) startAuto();
      });
    }

    if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      startAuto();
      return;
    }

    if (glassWrap) {
      gsap.set(glassWrap, { autoAlpha: 0, y: 32 });
      gsap.set(groom, { autoAlpha: 0, x: -40, rotation: -4 });
      gsap.set(bride, { autoAlpha: 0, x: 40, rotation: 4 });
      gsap.set(interactive, { autoAlpha: 0, y: 20 });

      var enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 85%',
          once: true,
          toggleActions: 'play none none none',
        },
      });

      enterTl
        .to(glassWrap, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .to(interactive, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.45')
        .to(groom, { autoAlpha: 1, x: 0, rotation: 0, duration: 0.65, ease: 'back.out(1.4)' }, '-=0.4')
        .to(bride, { autoAlpha: 1, x: 0, rotation: 0, duration: 0.65, ease: 'back.out(1.4)' }, '-=0.55');

      var dateNum = document.getElementById('reception-date-num');
      if (dateNum) {
        enterTl.fromTo(
          dateNum,
          { scale: 0.7 },
          { scale: 1, duration: 0.6, ease: 'back.out(1.8)' },
          '-=0.35'
        );
      }

      enterTl.eventCallback('onComplete', function () {
        gsap.set([glassWrap, groom, bride, interactive], { clearProps: 'transform,opacity,visibility' });
        showPanelInstant(activeIndex);
        startAuto();
      });
    } else {
      startAuto();
    }

    if (!mobile && bgCouples.length) {
      var section = root.closest('.reception-section');
      if (section) {
        section.addEventListener('mousemove', function (e) {
          var rect = section.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;

          bgCouples.forEach(function (img, i) {
            var depth = i === 1 ? 8 : 14;
            gsap.to(img, {
              x: x * depth,
              y: y * depth * 0.6,
              duration: 0.8,
              ease: 'power2.out',
            });
          });
        });

        section.addEventListener('mouseleave', function () {
          gsap.to(bgCouples, {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          });
        });
      }
    }

    root.querySelectorAll('[data-tilt]').forEach(function (el) {
      var frame = el.querySelector('.reception-couple-frame');
      if (!frame || mobile) return;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(frame, {
          rotationY: x * 10,
          rotationX: -y * 8,
          duration: 0.35,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', function () {
        gsap.to(frame, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });
    });
  }

  /* ---- Interactive wedding ceremony ---- */
  function initWedding() {
    var root = document.getElementById('wedding-experience');
    if (!root) return;

    var interactive = document.getElementById('wedding-interactive');
    var steps = root.querySelectorAll('.wedding-step');
    var panels = root.querySelectorAll('.wedding-panel');
    var dots = root.querySelectorAll('.wedding-dot');
    var lineFill = document.getElementById('wedding-steps-line-fill');
    var inviteCard = root.querySelector('.wedding-invite-card');
    var inviteTagline = document.getElementById('wedding-invite-tagline');
    var glassWrap = root.querySelector('.wedding-glass-wrap');

    var taglines = [
      'The Day We Say Forever',
      'Auspicious Morning Hour',
      'Where Hearts Unite',
      'Sacred Fire & Seven Steps',
    ];
    var stepCount = steps.length;
    var activeIndex = 0;
    var autoTimer = null;
    var userPaused = false;
    var panelTween = null;

    function updateLineFill(index) {
      if (!lineFill || stepCount < 2) return;
      var pct = (index / (stepCount - 1)) * 100;
      lineFill.style.width = pct + '%';
    }

    function updateStepUI(index) {
      steps.forEach(function (step, i) {
        var isActive = i === index;
        step.classList.toggle('is-active', isActive);
        step.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });

      updateLineFill(index);

      if (inviteTagline && taglines[index]) {
        inviteTagline.textContent = taglines[index];
      }

      if (inviteCard) {
        inviteCard.classList.add('is-highlight');
      }
    }

    function showPanelInstant(index) {
      panels.forEach(function (panel, i) {
        var isActive = i === index;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        if (typeof gsap !== 'undefined') {
          gsap.set(panel, {
            opacity: isActive ? 1 : 0,
            visibility: isActive ? 'visible' : 'hidden',
            y: 0,
            pointerEvents: isActive ? 'auto' : 'none',
          });
        }
      });
      activeIndex = index;
    }

    function setActive(index) {
      if (index < 0 || index >= stepCount) return;
      if (index === activeIndex && !panelTween) return;

      updateStepUI(index);

      if (panelTween) {
        panelTween.kill();
        panelTween = null;
      }
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(panels);
      }

      var prevPanel = panels[activeIndex];
      var nextPanel = panels[index];

      if (reduced || typeof gsap === 'undefined' || prevPanel === nextPanel) {
        showPanelInstant(index);
        return;
      }

      panels.forEach(function (panel, i) {
        if (i !== activeIndex && i !== index) {
          panel.classList.remove('is-active');
          panel.setAttribute('aria-hidden', 'true');
          gsap.set(panel, { opacity: 0, visibility: 'hidden', y: 0, pointerEvents: 'none' });
        }
      });

      nextPanel.classList.add('is-active');
      nextPanel.setAttribute('aria-hidden', 'false');
      gsap.set(nextPanel, { visibility: 'visible', opacity: 0, y: 10, pointerEvents: 'none' });

      panelTween = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: function () {
          prevPanel.classList.remove('is-active');
          prevPanel.setAttribute('aria-hidden', 'true');
          gsap.set(prevPanel, { opacity: 0, visibility: 'hidden', y: 0, pointerEvents: 'none' });
          gsap.set(nextPanel, { y: 0, pointerEvents: 'auto', clearProps: 'transform' });
          activeIndex = index;
          panelTween = null;
        },
      });

      panelTween
        .to(prevPanel, { opacity: 0, y: -8, duration: 0.22, ease: 'power2.in' }, 0)
        .to(nextPanel, { opacity: 1, y: 0, duration: 0.32 }, 0.06);
    }

    showPanelInstant(0);
    updateStepUI(0);

    steps.forEach(function (step, index) {
      step.addEventListener('click', function () {
        userPaused = true;
        clearAuto();
        setActive(index);
      });
    });

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        userPaused = true;
        clearAuto();
        setActive(index);
      });
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        userPaused = true;
        clearAuto();
        setActive((activeIndex + 1) % stepCount);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        userPaused = true;
        clearAuto();
        setActive((activeIndex - 1 + stepCount) % stepCount);
      }
    });

    function clearAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAuto() {
      if (reduced || userPaused) return;
      clearAuto();
      autoTimer = setInterval(function () {
        setActive((activeIndex + 1) % stepCount);
      }, 5500);
    }

    if (interactive) {
      interactive.addEventListener('mouseenter', clearAuto);
      interactive.addEventListener('mouseleave', startAuto);
      interactive.addEventListener('focusin', clearAuto);
      interactive.addEventListener('focusout', function () {
        if (!userPaused) startAuto();
      });
    }

    if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      startAuto();
      return;
    }

    if (glassWrap) {
      gsap.set(glassWrap, { autoAlpha: 0, y: 32 });
      gsap.set(inviteCard, { autoAlpha: 0, x: -24, rotation: -2 });
      gsap.set(interactive, { autoAlpha: 0, x: 24 });

      var enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 85%',
          once: true,
          toggleActions: 'play none none none',
        },
      });

      enterTl
        .to(glassWrap, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .to(inviteCard, { autoAlpha: 1, x: 0, rotation: 0, duration: 0.65, ease: 'back.out(1.3)' }, '-=0.5')
        .to(interactive, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.45')
        .from(steps, { autoAlpha: 0, y: 14, duration: 0.4, stagger: 0.07, ease: 'back.out(1.3)' }, '-=0.35');

      var dateNum = document.getElementById('wedding-date-num');
      if (dateNum) {
        enterTl.fromTo(
          dateNum,
          { scale: 0.7 },
          { scale: 1, duration: 0.6, ease: 'back.out(1.8)' },
          '-=0.3'
        );
      }

      enterTl.eventCallback('onComplete', function () {
        gsap.set([glassWrap, inviteCard, interactive], { clearProps: 'transform,opacity,visibility' });
        gsap.set(steps, { clearProps: 'transform,opacity,visibility' });
        showPanelInstant(activeIndex);
        startAuto();
      });
    } else {
      startAuto();
    }
  }

  /* ---- Interactive venue ---- */
  function initVenue() {
    var root = document.getElementById('venue-showcase');
    if (!root) return;

    var tabs = root.querySelectorAll('.venue-tab');
    var panels = root.querySelectorAll('.venue-panel');
    var hallBg = document.getElementById('venue-hall-bg');
    var hallImages = hallBg ? hallBg.querySelectorAll('.venue-hall-img') : [];
    var indicator = document.getElementById('venue-tab-indicator');
    var details = document.getElementById('venue-content');

    var stepKeys = ['wedding', 'reception'];
    var activeIndex = 0;
    var panelTween = null;

    function moveIndicator(index) {
      if (!indicator) return;
      indicator.style.transform = 'translateX(' + index * 100 + '%)';
    }

    function showHallImage(index, animate) {
      var key = stepKeys[index];
      var nextImg = hallBg ? hallBg.querySelector('.venue-hall-img[data-venue-img="' + key + '"]') : null;
      var prevImg = hallBg ? hallBg.querySelector('.venue-hall-img.is-active') : null;

      if (!nextImg || (prevImg === nextImg && animate !== false)) return;

      if (reduced || typeof gsap === 'undefined' || animate === false || !prevImg) {
        hallImages.forEach(function (img) {
          var isActive = img.getAttribute('data-venue-img') === key;
          img.classList.toggle('is-active', isActive);
          if (typeof gsap !== 'undefined') {
            gsap.set(img, {
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
            });
          }
        });
        return;
      }

      gsap.killTweensOf(hallImages);
      nextImg.classList.add('is-active');
      gsap.set(nextImg, { visibility: 'visible', opacity: 0 });
      gsap.to(nextImg, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.to(prevImg, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: function () {
          prevImg.classList.remove('is-active');
          gsap.set(prevImg, { visibility: 'hidden' });
        },
      });
    }

    function showPanelInstant(index) {
      panels.forEach(function (panel, i) {
        var isActive = i === index;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        if (typeof gsap !== 'undefined') {
          gsap.set(panel, {
            opacity: isActive ? 1 : 0,
            visibility: isActive ? 'visible' : 'hidden',
            y: 0,
            pointerEvents: isActive ? 'auto' : 'none',
          });
        }
      });
      activeIndex = index;
    }

    function setActive(index) {
      if (index < 0 || index >= tabs.length) return;
      if (index === activeIndex && !panelTween) return;

      tabs.forEach(function (tab, i) {
        var isActive = i === index;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      moveIndicator(index);
      showHallImage(index);

      if (panelTween) {
        panelTween.kill();
        panelTween = null;
      }
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(panels);
      }

      var prevPanel = panels[activeIndex];
      var nextPanel = panels[index];

      if (reduced || typeof gsap === 'undefined' || prevPanel === nextPanel) {
        showPanelInstant(index);
        return;
      }

      panels.forEach(function (panel, i) {
        if (i !== activeIndex && i !== index) {
          panel.classList.remove('is-active');
          panel.setAttribute('aria-hidden', 'true');
          gsap.set(panel, { opacity: 0, visibility: 'hidden', y: 0, pointerEvents: 'none' });
        }
      });

      nextPanel.classList.add('is-active');
      nextPanel.setAttribute('aria-hidden', 'false');
      gsap.set(nextPanel, { visibility: 'visible', opacity: 0, y: 8, pointerEvents: 'none' });

      panelTween = gsap.timeline({
        onComplete: function () {
          prevPanel.classList.remove('is-active');
          prevPanel.setAttribute('aria-hidden', 'true');
          gsap.set(prevPanel, { opacity: 0, visibility: 'hidden', y: 0, pointerEvents: 'none' });
          gsap.set(nextPanel, { y: 0, pointerEvents: 'auto', clearProps: 'transform' });
          activeIndex = index;
          panelTween = null;
        },
      });

      panelTween
        .to(prevPanel, { opacity: 0, y: -6, duration: 0.2, ease: 'power2.in' }, 0)
        .to(nextPanel, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }, 0.05);
    }

    showPanelInstant(0);
    moveIndicator(0);
    showHallImage(0, false);

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        setActive(index);
      });
    });

    if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    if (details) {
      var venueSection = document.getElementById('venue');
      gsap.set(details, { autoAlpha: 0, y: 20 });
      if (hallBg) gsap.set(hallBg, { autoAlpha: 0 });

      var enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: venueSection || root,
          start: 'top 85%',
          once: true,
          toggleActions: 'play none none none',
        },
      });

      if (hallBg) {
        enterTl.to(hallBg, { autoAlpha: 1, duration: 0.85, ease: 'power2.out' });
      }

      enterTl.to(details, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, hallBg ? '-=0.5' : 0);

      enterTl.eventCallback('onComplete', function () {
        gsap.set([details, hallBg], { clearProps: 'transform,opacity,visibility' });
        showPanelInstant(activeIndex);
      });
    }
  }

  /* ---- Interactive footer ---- */
  function initFooter() {
    if (typeof gsap === 'undefined') return;

    var footer = document.querySelector('.footer-section');
    var layer = document.getElementById('footer-particles');
    if (!footer) return;

    if (!reduced && layer) {
      var heartColors = ['#f5c4cf', '#d4819a', '#a83255', '#ffffff'];
      var heartCount = mobile ? 10 : 16;

      for (var i = 0; i < heartCount; i++) {
        var heart = document.createElement('div');
        heart.className = 'footer-heart-particle';
        var size = rand(24, 36);
        var color = heartColors[Math.floor(Math.random() * heartColors.length)];
        heart.innerHTML =
          '<svg viewBox="0 0 20 18" width="' + size + '" height="' + (size * 0.9) + '" aria-hidden="true">' +
          '<path d="M10 16 C10 16 2.5 11 2.5 6.5 C2.5 4 4.5 2 7 2 C8.5 2 9.5 3 10 4.5 C10.5 3 11.5 2 13 2 C15.5 2 17.5 4 17.5 6.5 C17.5 11 10 16 10 16 Z" fill="' + color + '" opacity="0.5"/></svg>';
        heart.style.left = rand(0, 100) + '%';
        heart.style.top = rand(50, 105) + '%';
        layer.appendChild(heart);

        gsap.to(heart, {
          y: -rand(70, 140),
          x: rand(-25, 25),
          rotation: rand(-40, 40),
          duration: rand(9, 15),
          delay: rand(0, 4),
          repeat: -1,
          ease: 'sine.inOut',
          yoyo: true,
        });
      }
    }

    if (reduced || typeof ScrollTrigger === 'undefined') return;

    var thankLines = footer.querySelectorAll('.footer-thank-line');
    var borders = footer.querySelectorAll('.footer-border');
    var items = footer.querySelectorAll(
      '.footer-logo, .footer-tamil, .footer-tagline, .footer-couple, .footer-love, .footer-copy'
    );

    gsap.set(thankLines, { autoAlpha: 0, x: function (i) { return i === 0 ? -40 : 40; } });
    gsap.set(borders, { scaleX: 0 });
    gsap.set(items, { autoAlpha: 0, y: 20 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 85%',
        once: true,
        toggleActions: 'play none none none',
      },
    });

    tl.to(borders, {
      scaleX: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.inOut',
    })
      .to(
        thankLines,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
        },
        '-=0.5'
      )
      .to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.09,
          ease: 'power2.out',
        },
        '-=0.35'
      );

    tl.eventCallback('onComplete', function () {
      gsap.set([].concat(
        Array.prototype.slice.call(thankLines),
        Array.prototype.slice.call(borders),
        Array.prototype.slice.call(items)
      ), { clearProps: 'transform,opacity,visibility' });
    });
  }

  /* ---- Hero intro (runs once after loader) ---- */
  function playHeroIntro() {
    if (reduced || heroPlayed || typeof gsap === 'undefined') return;
    heroPlayed = true;

    gsap.fromTo(
      '.hero-temple',
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 0.14, y: 0, duration: 1, ease: 'power2.out' }
    );

    gsap.fromTo(
      '.hero-content > *',
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.15,
      }
    );
  }

  function waitForLoader(callback) {
    var loader = document.getElementById('loader');
    if (!loader || loader.classList.contains('hidden')) {
      callback();
      return;
    }

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      callback();
    }

    var observer = new MutationObserver(function () {
      if (loader.classList.contains('hidden')) {
        observer.disconnect();
        finish();
      }
    });
    observer.observe(loader, { attributes: true, attributeFilter: ['class'] });
    setTimeout(finish, 2600);
  }

  /* ---- Gentle CSS-class floats via GSAP (hero decor only) ---- */
  function initHeroFloat() {
    if (reduced || typeof gsap === 'undefined') return;

    gsap.utils.toArray('.float-gentle').forEach(function (el) {
      gsap.to(el, {
        y: 8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }

  function init() {
    document.documentElement.classList.remove('no-js');

    if (typeof gsap === 'undefined') return;

    initParticles();
    initHeroFloat();
    waitForLoader(playHeroIntro);

    if (typeof ScrollTrigger !== 'undefined') {
      initScrollReveals();
      initLoveStory();
      initReception();
      initWedding();
      initVenue();
      initFooter();
      window.addEventListener('load', function () {
        ScrollTrigger.refresh();
      });
    }
  }

  window.WeddingAnimations = { init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
