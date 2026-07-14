import { useEffect, useState } from 'react';
import './PerformanceDashboard.css';

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
  };
}

interface PerformanceMetrics {
  animations: number;
  domNodes: number;
  fps: number;
  heap: number | null;
  iframes: number;
  longTasks: number;
  slowestTask: number;
}

const EMPTY_METRICS: PerformanceMetrics = {
  animations: 0,
  domNodes: 0,
  fps: 0,
  heap: null,
  iframes: 0,
  longTasks: 0,
  slowestTask: 0,
};

function formatBytes(bytes: number | null): string {
  if (bytes === null) return 'غير متاح';
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Development-only field readout. Enable with ?perf=1 while profiling a local build.
 * It is intentionally dormant unless requested so it adds no runtime observers to normal visits.
 */
function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(EMPTY_METRICS);
  const enabled = new URLSearchParams(window.location.search).has('perf');

  useEffect(() => {
    if (!enabled) return undefined;

    let frameCount = 0;
    let animationFrame = 0;
    let longTasks = 0;
    let slowestTask = 0;

    const countFrame = () => {
      frameCount += 1;
      animationFrame = window.requestAnimationFrame(countFrame);
    };

    animationFrame = window.requestAnimationFrame(countFrame);

    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((entries) => {
        entries.getEntries().forEach((entry) => {
          longTasks += 1;
          slowestTask = Math.max(slowestTask, entry.duration);
        });
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch {
      observer = null;
    }

    const sample = () => {
      const performanceWithMemory = performance as PerformanceWithMemory;
      const runningAnimations = document
        .getAnimations()
        .filter((animation) => animation.playState === 'running').length;

      setMetrics({
        animations: runningAnimations,
        domNodes: document.querySelectorAll('*').length,
        fps: frameCount,
        heap: performanceWithMemory.memory?.usedJSHeapSize ?? null,
        iframes: document.querySelectorAll('iframe').length,
        longTasks,
        slowestTask,
      });
      frameCount = 0;
    };

    sample();
    const interval = window.setInterval(sample, 1000);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearInterval(interval);
      observer?.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside className="performance-dashboard" aria-live="polite" dir="rtl">
      <p className="performance-dashboard__title">قراءة الأداء المحلية</p>
      <dl>
        <div><dt>FPS</dt><dd>{metrics.fps}</dd></div>
        <div><dt>Long tasks</dt><dd>{metrics.longTasks} / {Math.round(metrics.slowestTask)}ms</dd></div>
        <div><dt>Animations</dt><dd>{metrics.animations}</dd></div>
        <div><dt>Iframes</dt><dd>{metrics.iframes}</dd></div>
        <div><dt>DOM nodes</dt><dd>{metrics.domNodes}</dd></div>
        <div><dt>JS heap</dt><dd>{formatBytes(metrics.heap)}</dd></div>
      </dl>
    </aside>
  );
}

export default PerformanceDashboard;
