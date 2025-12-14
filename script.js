document.body.classList.remove('no-js');

(function() {
  'use strict';

  const countdownEls = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]')
  };

  const targetDate = new Date('2026-03-15T15:00:00Z').getTime();
  let timerId = null;

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

  // Black hole particle system
  const initBlackHole = () => {
    const orb = document.querySelector('.orb-core');
    const container = document.querySelector('.orb-container');
    if (!orb || !container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'sucked-particle';

      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // Random starting position from edges of viewport
      const side = Math.floor(Math.random() * 4);
      let startX, startY;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      switch(side) {
        case 0: // top
          startX = Math.random() * vw;
          startY = -20;
          break;
        case 1: // right
          startX = vw + 20;
          startY = Math.random() * vh;
          break;
        case 2: // bottom
          startX = Math.random() * vw;
          startY = vh + 20;
          break;
        case 3: // left
          startX = -20;
          startY = Math.random() * vh;
          break;
      }

      particle.style.left = startX + 'px';
      particle.style.top = startY + 'px';
      particle.style.opacity = Math.random() * 0.5 + 0.3;

      document.body.appendChild(particle);

      // Get orb center position
      const orbRect = orb.getBoundingClientRect();
      const targetX = orbRect.left + orbRect.width / 2;
      const targetY = orbRect.top + orbRect.height / 2;

      // Animate to center
      const duration = Math.random() * 3000 + 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-in curve for acceleration effect
        const eased = progress * progress * progress;

        // Spiral effect
        const spiral = (1 - progress) * Math.sin(progress * Math.PI * 4) * 30;

        const currentX = startX + (targetX - startX) * eased + spiral;
        const currentY = startY + (targetY - startY) * eased;

        // Shrink as it approaches
        const scale = 1 - eased * 0.9;

        particle.style.left = currentX + 'px';
        particle.style.top = currentY + 'px';
        particle.style.transform = `scale(${scale})`;
        particle.style.opacity = (1 - eased * 0.8) * 0.6;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      requestAnimationFrame(animate);
    };

    // Spawn particles at random intervals
    const spawnParticle = () => {
      createParticle();
      const delay = Math.random() * 400 + 150;
      setTimeout(spawnParticle, delay);
    };

    // Start spawning
    spawnParticle();
  };

  try {
    updateCountdown();
    timerId = window.setInterval(updateCountdown, 1000);
    initBlackHole();

    window.addEventListener('pagehide', () => {
      if (timerId) window.clearInterval(timerId);
    }, { once: true });
  } catch (error) {
    console.error('Initialization error:', error);
    const fallback = document.querySelector('.error-fallback');
    if (fallback) fallback.style.display = 'block';
  }
})();
