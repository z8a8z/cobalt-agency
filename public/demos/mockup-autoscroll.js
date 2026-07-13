(() => {
  const MESSAGE_TYPE = 'cobalt:demo-autoscroll';
  const SCROLL_SPEED = 30;
  const START_DELAY = 1500;

  function initialiseAutoScroll() {
    const screen = document.querySelector('.relative.w-full.h-full.overflow-y-auto');

    if (!screen) return;

    let animationFrame = 0;
    let enabled = window.parent === window;
    let hovered = false;
    let lastTime = 0;
    let scrollDirection = 1;
    let scrollTop = screen.scrollTop;

    const canAnimate = () => enabled && !hovered && !document.hidden;

    const stop = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const schedule = () => {
      if (!animationFrame && canAnimate()) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    const tick = (time) => {
      animationFrame = 0;

      if (!canAnimate()) return;

      const elapsed = lastTime ? Math.min(time - lastTime, 100) : 16.67;
      lastTime = time;

      const maxScroll = screen.scrollHeight - screen.clientHeight;

      if (maxScroll > 15) {
        scrollTop += (SCROLL_SPEED * elapsed * scrollDirection) / 1000;

        if (scrollTop >= maxScroll) {
          scrollTop = maxScroll;
          scrollDirection = -1;
        } else if (scrollTop <= 0) {
          scrollTop = 0;
          scrollDirection = 1;
        }

        screen.scrollTop = scrollTop;
      }

      schedule();
    };

    const updateEnabledState = (active) => {
      enabled = active;
      scrollTop = screen.scrollTop;
      lastTime = 0;

      if (enabled) {
        schedule();
      } else {
        stop();
      }
    };

    document.body.addEventListener('mouseenter', () => {
      hovered = true;
      stop();
    });

    document.body.addEventListener('mouseleave', () => {
      hovered = false;
      lastTime = 0;
      schedule();
    });

    document.addEventListener('visibilitychange', () => {
      lastTime = 0;

      if (document.hidden) {
        stop();
      } else {
        schedule();
      }
    });

    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;

      const message = event.data;

      if (message?.type === MESSAGE_TYPE && typeof message.active === 'boolean') {
        updateEnabledState(message.active);
      }
    });

    window.setTimeout(schedule, START_DELAY);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseAutoScroll, { once: true });
  } else {
    initialiseAutoScroll();
  }
})();
