export const DEMO_AUTOSCROLL_MESSAGE = 'cobalt:demo-autoscroll';

interface DemoAutoscrollMessage {
  active: boolean;
  type: typeof DEMO_AUTOSCROLL_MESSAGE;
}

/** Enables an embedded demo's lightweight auto-scroll only while it is active. */
export function setDemoAutoScroll(
  frame: HTMLIFrameElement | null,
  active: boolean,
) {
  if (!frame?.contentWindow) return;

  const message: DemoAutoscrollMessage = {
    active,
    type: DEMO_AUTOSCROLL_MESSAGE,
  };

  frame.contentWindow.postMessage(message, window.location.origin);
}
