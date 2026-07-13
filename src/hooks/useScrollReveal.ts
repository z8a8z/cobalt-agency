import { useEffect, useRef } from 'react';

type ScrollRevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

/**
 * Adds the shared `.visible` class when an element enters the viewport.
 * Passing a number remains supported for existing calls:
 * `useScrollReveal(0.2)`.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: number | ScrollRevealOptions = 0.15,
) {
  const ref = useRef<T>(null);
  const threshold = typeof options === 'number' ? options : (options.threshold ?? 0.15);
  const rootMargin = typeof options === 'number' ? '0px' : (options.rootMargin ?? '0px');
  const once = typeof options === 'number' ? true : (options.once ?? true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const revealImmediately =
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (revealImmediately) {
      element.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('visible');

          if (once) observer.unobserve(element);
        } else if (!once) {
          element.classList.remove('visible');
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return ref;
}
