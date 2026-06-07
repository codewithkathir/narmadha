/**
 * Wedding Countdown Timer — no visual animation (prevents flicker)
 */
(function () {
  'use strict';

  var WEDDING_DATE = new Date('2026-06-17T06:00:00+05:30');

  var miniEls = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };

  var largeEls = {
    days: document.getElementById('cd-lg-days'),
    hours: document.getElementById('cd-lg-hours'),
    minutes: document.getElementById('cd-lg-minutes'),
    seconds: document.getElementById('cd-lg-seconds'),
  };

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function getRemaining() {
    var diff = WEDDING_DATE.getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  }

  function updateElement(el, value) {
    if (!el) return;
    var formatted = pad(value);
    if (el.textContent !== formatted) {
      el.textContent = formatted;
    }
  }

  function tick() {
    var r = getRemaining();
    updateElement(miniEls.days, r.days);
    updateElement(miniEls.hours, r.hours);
    updateElement(miniEls.minutes, r.minutes);
    updateElement(miniEls.seconds, r.seconds);
    updateElement(largeEls.days, r.days);
    updateElement(largeEls.hours, r.hours);
    updateElement(largeEls.minutes, r.minutes);
    updateElement(largeEls.seconds, r.seconds);
  }

  tick();
  setInterval(tick, 1000);

  window.WeddingCountdown = { getRemaining: getRemaining, weddingDate: WEDDING_DATE };
})();
