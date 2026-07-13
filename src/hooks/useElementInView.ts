import { type RefObject, useEffect, useState } from 'react';

export interface ElementInViewOptions {
  rootMargin?: string;
  threshold?: number;
}

/**
 * Tracks whether an element is close enough to the viewport to justify
 * mounting or animating non-critical content.
 */
export function useElementInView<T extends Element>(
  targetRef: RefObject<T | null>,
  { rootMargin = '200px 0px', threshold = 0 }: ElementInViewOptions = {},
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const target = targetRef.current;

    if (!target) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin, threshold },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [rootMargin, targetRef, threshold]);

  return isInView;
}
