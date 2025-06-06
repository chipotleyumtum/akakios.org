document.body.classList.remove('no-js');

(function() {
  'use strict';
  
  try {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }
      const title = document.querySelector('.title');
    if (!title) return;
    
    let rafId = null;
    let colorAnimationId = null;
    
    const updateColors = () => {
      const time = Date.now() * 0.003;
      const wave1 = (Math.sin(time) + 1) * 0.5;
      const wave2 = (Math.sin(time + Math.PI * 0.5) + 1) * 0.5;
      
      const copperIntensity = 0.7 + wave1 * 0.3;
      const blueIntensity = 0.7 + wave2 * 0.3;
      
      title.style.setProperty('--fire-intensity', copperIntensity.toFixed(2));
      title.style.setProperty('--blue-intensity', blueIntensity.toFixed(2));
      
      colorAnimationId = requestAnimationFrame(updateColors);
    };
      const handleMouseMove = (e) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        const rect = title.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          title.style.setProperty('--mouse-x', `${x}px`);
          title.style.setProperty('--mouse-y', `${y}px`);
          
          if (!colorAnimationId) {
            updateColors();
          }
        }
        
        rafId = null;
      });
    };
      const handleMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (colorAnimationId) {
        cancelAnimationFrame(colorAnimationId);
        colorAnimationId = null;
      }
      
      title.style.setProperty('--fire-intensity', '0');
      title.style.setProperty('--blue-intensity', '0');
    };
    
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        title.style.setProperty('--fire-intensity', '0');
        title.style.setProperty('--blue-intensity', '0');
      }, 100);
    };
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    title.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    window.addEventListener('pagehide', () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (colorAnimationId) cancelAnimationFrame(colorAnimationId);
      clearTimeout(resizeTimeout);
    }, { once: true });          
  } catch (error) {
    console.error('Initialization error:', error);
    document.querySelector('.error-fallback').style.display = 'block';
    document.querySelector('.container').style.display = 'none';
  }
})();
