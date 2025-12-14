document.body.classList.remove('no-js');

(function() {
  'use strict';

  const form = document.querySelector('.cta-form');
  const emailInput = document.querySelector('#email');
  const statusEl = document.querySelector('.form-status');
  const countdownEls = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]')
  };

  const targetDate = new Date('2026-03-15T15:00:00Z').getTime();
  let timerId = null;

  const setStatus = (message, state) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('success', 'error');
    if (state) statusEl.classList.add(state);
  };

  const format = (value) => String(value).padStart(2, '0');

  const updateCountdown = () => {
    const now = Date.now();
    const delta = targetDate - now;

    if (!countdownEls.days) return;

    if (delta <= 0) {
      countdownEls.days.textContent = '00';
      countdownEls.hours.textContent = '00';
      countdownEls.minutes.textContent = '00';
      countdownEls.seconds.textContent = '00';
      setStatus('We are live. Watch your inbox.', 'success');
      clearInterval(timerId);
      return;
    }

    const seconds = Math.floor(delta / 1000) % 60;
    const minutes = Math.floor(delta / (1000 * 60)) % 60;
    const hours = Math.floor(delta / (1000 * 60 * 60)) % 24;
    const days = Math.floor(delta / (1000 * 60 * 60 * 24));

    countdownEls.days.textContent = format(days);
    countdownEls.hours.textContent = format(hours);
    countdownEls.minutes.textContent = format(minutes);
    countdownEls.seconds.textContent = format(seconds);
  };

  const validateEmail = (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!emailInput) return;

    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
      setStatus('Please use a valid work email.', 'error');
      return;
    }

    setStatus('You are in. Expect a briefing shortly.', 'success');
    emailInput.setAttribute('disabled', 'true');
    const submitBtn = form?.querySelector('button');
    if (submitBtn) {
      submitBtn.textContent = 'Added';
      submitBtn.setAttribute('disabled', 'true');
    }
  };

  const initBackgroundTilt = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const handleMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 4;
      hero.style.setProperty('--tilt-x', y.toFixed(2));
      hero.style.setProperty('--tilt-y', x.toFixed(2));
    };

    const reset = () => {
      hero.style.setProperty('--tilt-x', '0');
      hero.style.setProperty('--tilt-y', '0');
    };

    hero.addEventListener('pointermove', handleMove, { passive: true });
    hero.addEventListener('pointerleave', reset, { passive: true });
  };

  try {
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }

    updateCountdown();
    timerId = window.setInterval(updateCountdown, 1000);
    initBackgroundTilt();

    window.addEventListener('pagehide', () => {
      if (timerId) window.clearInterval(timerId);
    }, { once: true });
  } catch (error) {
    console.error('Initialization error:', error);
    const fallback = document.querySelector('.error-fallback');
    if (fallback) fallback.style.display = 'block';
  }
})();
