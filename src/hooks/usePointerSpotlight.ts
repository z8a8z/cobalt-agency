import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';

export type SpotlightStyle = CSSProperties & {
  '--mouse-x': string;
  '--mouse-y': string;
  '--spotlight-opacity': number;
};

interface PointerSpotlightHandlers<T extends HTMLElement> {
  onPointerEnter: (event: ReactPointerEvent<T>) => void;
  onPointerLeave: (event: ReactPointerEvent<T>) => void;
  onPointerMove: (event: ReactPointerEvent<T>) => void;
}

interface PointerSpotlight<T extends HTMLElement> {
  handlers: PointerSpotlightHandlers<T>;
  style: SpotlightStyle;
}

const INITIAL_SPOTLIGHT_STYLE: SpotlightStyle = {
  '--mouse-x': '50%',
  '--mouse-y': '50%',
  '--spotlight-opacity': 0,
};

/**
 * Updates a CSS-only card spotlight on the next animation frame, avoiding a
 * React render for every pointer event.
 */
export function usePointerSpotlight<T extends HTMLElement>(): PointerSpotlight<T> {
  const animationFrameRef = useRef<number | null>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const elementRef = useRef<T | null>(null);
  const pointerRef = useRef({ x: 50, y: 50 });

  const cancelFrame = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => cancelFrame, [cancelFrame]);

  const onPointerEnter = useCallback((event: ReactPointerEvent<T>) => {
    if (event.pointerType === 'touch') return;

    const element = event.currentTarget;
    elementRef.current = element;
    boundsRef.current = element.getBoundingClientRect();
    element.style.setProperty('--spotlight-opacity', '1');
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<T>) => {
    if (event.pointerType === 'touch') return;

    const element = event.currentTarget;
    const bounds = boundsRef.current ?? element.getBoundingClientRect();

    elementRef.current = element;
    boundsRef.current = bounds;
    pointerRef.current = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };

    if (animationFrameRef.current !== null) return;

    animationFrameRef.current = window.requestAnimationFrame(() => {
      const activeElement = elementRef.current;

      if (activeElement) {
        activeElement.style.setProperty('--mouse-x', `${pointerRef.current.x}px`);
        activeElement.style.setProperty('--mouse-y', `${pointerRef.current.y}px`);
      }

      animationFrameRef.current = null;
    });
  }, []);

  const onPointerLeave = useCallback((event: ReactPointerEvent<T>) => {
    cancelFrame();

    const element = event.currentTarget;
    element.style.setProperty('--mouse-x', '50%');
    element.style.setProperty('--mouse-y', '50%');
    element.style.setProperty('--spotlight-opacity', '0');
    boundsRef.current = null;
    elementRef.current = null;
  }, [cancelFrame]);

  return {
    handlers: { onPointerEnter, onPointerLeave, onPointerMove },
    style: INITIAL_SPOTLIGHT_STYLE,
  };
}
