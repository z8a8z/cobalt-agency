import { useEffect } from "react";

const playVideo = (video) => {
  video.play().catch(() => undefined);
};

export function useSiteMotion({ siteRef, headerRef, heroVideoRef, deliveryVideoRef }) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    let frame = 0;
    const updateHeader = () => {
      frame = 0;
      header.classList.toggle("is-scrolled", window.scrollY > 18);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headerRef]);

  useEffect(() => {
    const videos = [heroVideoRef.current, deliveryVideoRef.current].filter(Boolean);
    if (!videos.length) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibility = new Map(videos.map((video) => [video, false]));
    let observer;

    const syncVideo = (video) => {
      const canPlay = !reducedMotion.matches && !document.hidden && visibility.get(video);
      if (canPlay) playVideo(video);
      else video.pause();
    };
    const syncAll = () => videos.forEach(syncVideo);

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          visibility.set(video, entry.isIntersecting);
          if (entry.isIntersecting && video.dataset.lazyVideo === "true" && video.preload === "none") {
            video.preload = "metadata";
            video.load();
          }
          syncVideo(video);
        });
      }, { rootMargin: "180px 0px", threshold: 0.01 });
      videos.forEach((video) => observer.observe(video));
    } else {
      videos.forEach((video) => visibility.set(video, true));
      syncAll();
    }

    document.addEventListener("visibilitychange", syncAll);
    reducedMotion.addEventListener("change", syncAll);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", syncAll);
      reducedMotion.removeEventListener("change", syncAll);
      videos.forEach((video) => video.pause());
    };
  }, [heroVideoRef, deliveryVideoRef]);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    let cancelled = false;
    let gsapContext;
    let responsiveMotion;
    let refreshFrame = 0;

    const setupMotion = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled || !siteRef.current) return;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
      root.classList.add("motion-enhanced");

      gsapContext = gsap.context(() => {
        const select = gsap.utils.selector(siteRef);
        const first = (selector) => select(selector)[0];
        const progressBar = first(".scroll-progress__bar");

        if (progressBar) {
          const setProgress = gsap.quickSetter(progressBar, "scaleY");
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: ({ progress }) => setProgress(progress),
          });
        }

        gsap.timeline({ defaults: { duration: 1.05, ease: "power4.out" } })
          .from(select(".hero .eyebrow"), { y: 34, autoAlpha: 0 }, 0.08)
          .from(select(".hero-title-line > span"), { yPercent: 118, rotate: 1.5, stagger: 0.1 }, 0.14)
          .from(select(".hero-lead"), { y: 40, autoAlpha: 0 }, 0.36)
          .from(select(".hero-actions > *"), { y: 30, autoAlpha: 0, stagger: 0.08 }, 0.48)
          .from(select(".hero-proof > div"), { y: 24, autoAlpha: 0, stagger: 0.07 }, 0.58)
          .from(select(".scroll-cue"), { y: 20, autoAlpha: 0 }, 0.72);

        gsap.from(first(".custom-solution"), {
          y: 84,
          scale: 0.96,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: first(".custom-solution"), start: "top 90%", toggleActions: "play none none reverse" },
        });

        gsap.from(select(".footer-main > *"), {
          y: 54,
          autoAlpha: 0,
          stagger: 0.09,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: first(".footer"), start: "top 92%", toggleActions: "play none none reverse" },
        });

        responsiveMotion = gsap.matchMedia();

        responsiveMotion.add("(min-width: 801px)", () => {
          const cleanup = [];

          gsap.timeline({
            scrollTrigger: {
              trigger: first(".hero"),
              start: "top top",
              end: "+=82%",
              pin: true,
              scrub: 0.75,
              anticipatePin: 1,
            },
          })
            .to(first(".hero-copy"), { xPercent: 22, yPercent: -18, scale: 0.88, autoAlpha: 0, ease: "power2.in" }, 0)
            .to(first(".hero-background-video"), { scale: 1.1, xPercent: -1.5, ease: "none" }, 0)
            .to(first(".scroll-cue"), { y: 64, autoAlpha: 0, ease: "power2.in" }, 0);

          gsap.timeline({
            scrollTrigger: { trigger: first(".trust-rail"), start: "top 94%", end: "bottom 56%", scrub: 0.7 },
          })
            .from(select(".trust-grid > div"), {
              yPercent: 105,
              rotate: (index) => index % 2 ? -3 : 3,
              autoAlpha: 0,
              stagger: 0.08,
              ease: "power3.out",
            })
            .from(select(".trust-grid .icon"), { scale: 0.25, rotate: -75, stagger: 0.07, ease: "back.out(1.7)" }, 0.14);

          gsap.fromTo(first(".about-year"), { xPercent: -16 }, {
            xPercent: 22,
            ease: "none",
            scrollTrigger: { trigger: first(".about"), start: "top bottom", end: "bottom top", scrub: 1 },
          });

          gsap.timeline({
            scrollTrigger: { trigger: first(".about"), start: "top 80%", end: "bottom 42%", scrub: 0.9 },
          })
            .from(select(".about .section-heading > *"), { xPercent: 24, y: 46, autoAlpha: 0, stagger: 0.12, ease: "power3.out" }, 0)
            .from(select(".story-copy > *"), {
              y: 105,
              rotateX: -14,
              transformPerspective: 900,
              autoAlpha: 0,
              stagger: 0.13,
              ease: "power3.out",
            }, 0.06)
            .from(select(".values-list > div"), { x: (index) => index ? -66 : 66, stagger: 0.09, ease: "power3.out" }, 0.4);

          select(".section-intro, .center-heading").forEach((heading) => {
            gsap.from(heading.children, {
              y: 76,
              autoAlpha: 0,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: { trigger: heading, start: "top 88%", end: "bottom 55%", scrub: 0.7 },
            });
          });

          const stage = first(".solutions-stage");
          const viewport = first(".solutions-viewport");
          const track = first(".solutions-grid");
          const cards = select(".solution-item");
          const progressFill = first(".solutions-progress i");
          const progressCount = first(".solutions-progress-count");
          const setSolutionProgress = gsap.quickSetter(progressFill, "scaleX");
          const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
          let activeIndex = -1;

          const setActiveCard = (nextIndex) => {
            if (nextIndex === activeIndex) return;
            cards[activeIndex]?.classList.remove("is-active");
            cards[nextIndex]?.classList.add("is-active");
            activeIndex = nextIndex;
            progressCount.textContent = `${String(nextIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
          };
          setActiveCard(0);

          const solutionsTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () => `+=${Math.max(travel() * 1.18, window.innerHeight * 2.05)}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) => {
                setSolutionProgress(progress);
                setActiveCard(Math.min(cards.length - 1, Math.round(progress * (cards.length - 1))));
              },
            },
          });
          solutionsTimeline.to(track, { x: () => travel(), ease: "none" }, 0);
          cards.forEach((card, index) => {
            solutionsTimeline.fromTo(card,
              { y: index % 2 ? 74 : -52, rotateZ: index % 2 ? -2.5 : 2.5, rotateY: index % 2 ? 5 : -5 },
              { y: index % 2 ? -48 : 66, rotateZ: index % 2 ? 2 : -2, rotateY: 0, ease: "none" },
              0);
          });
          cleanup.push(() => cards.forEach((card) => card.classList.remove("is-active")));

          gsap.timeline({
            scrollTrigger: { trigger: first(".process-grid"), start: "top 90%", end: "bottom 38%", scrub: 0.9 },
          })
            .from(select(".process-step"), {
              y: 175,
              z: -180,
              rotateX: -48,
              rotateY: (index) => index % 2 ? 8 : -8,
              transformPerspective: 1100,
              autoAlpha: 0,
              stagger: 0.14,
              ease: "power3.out",
            })
            .from(select(".process-step .step-top i"), { scaleX: 0, transformOrigin: "left", stagger: 0.12, ease: "power2.inOut" }, 0.12)
            .from(select(".process-step h3, .process-step p"), { y: 36, autoAlpha: 0, stagger: 0.055, ease: "power2.out" }, 0.22);

          const layerStarts = [176, 102, 28, -46];
          const layerEnds = [-36, -10, 18, 46];
          const technologyTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: first(".tech-feature"),
              start: "top 9%",
              end: "+=118%",
              pin: true,
              scrub: 0.85,
              anticipatePin: 1,
            },
          });
          select(".layer").forEach((layer, index) => {
            technologyTimeline.fromTo(layer,
              { y: layerStarts[index], scale: 0.8, rotateZ: 0, autoAlpha: index === 0 ? 1 : 0.2 },
              { y: layerEnds[index], scale: 1, rotateZ: -9, autoAlpha: 1, ease: "power2.inOut" },
              index * 0.035);
          });
          technologyTimeline
            .from(select(".tech-copy > *"), { x: 126, autoAlpha: 0, stagger: 0.09, ease: "power3.out" }, 0.12)
            .to(first(".tech-graphic"), { rotate: 1.5, scale: 1.025, ease: "power1.inOut" }, 0.56);

          gsap.fromTo(first(".materials-ribbon__track"), { xPercent: -7 }, {
            xPercent: 13,
            ease: "none",
            scrollTrigger: { trigger: first(".specs"), start: "top bottom", end: "bottom top", scrub: 0.9 },
          });

          gsap.timeline({
            scrollTrigger: { trigger: first(".specs-layout"), start: "top 86%", end: "bottom 40%", scrub: 0.85 },
          })
            .from(select(".specs-copy > *"), { x: 98, autoAlpha: 0, stagger: 0.1, ease: "power3.out" }, 0)
            .from(first(".spec-table"), { x: -110, y: 46, rotateY: -13, transformPerspective: 1100, autoAlpha: 0, ease: "power3.out" }, 0.05)
            .from(select(".spec-table .spec-row"), { x: -58, autoAlpha: 0, stagger: 0.065, ease: "power2.out" }, 0.2)
            .from(first(".quality-note"), { scaleX: 0, transformOrigin: "right", ease: "power2.inOut" }, 0.34);

          const logisticsTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: first(".logistics-stage"),
              start: "top top",
              end: "+=112%",
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          });
          logisticsTimeline
            .fromTo(first(".logistics-video"), { scale: 1.13 }, { scale: 1, ease: "none" }, 0)
            .from(first(".logistics-copy"), { xPercent: 32, autoAlpha: 0, ease: "power3.out" }, 0.08)
            .from(first(".logistics-route-line"), { scaleX: 0, transformOrigin: "right", ease: "power2.inOut" }, 0.2)
            .from(select(".logistics-point"), { y: 92, autoAlpha: 0, stagger: 0.09, ease: "power3.out" }, 0.28)
            .to(first(".logistics-copy"), { y: -36, ease: "none" }, 0.66)
            .to(first(".logistics-video"), { scale: 1.045, ease: "none" }, 0.66);

          const curtain = first(".contact-curtain");
          gsap.set(curtain, { scaleY: 1, transformOrigin: "bottom" });
          gsap.timeline({
            scrollTrigger: { trigger: first(".contact"), start: "top 96%", end: "top 12%", scrub: 0.8 },
          })
            .to(curtain, { scaleY: 0, ease: "none" }, 0)
            .from(select(".contact-copy > *"), { x: 100, autoAlpha: 0, stagger: 0.08, ease: "power3.out" }, 0.2)
            .from(first(".contact-form"), { y: 130, x: -64, rotate: -3, autoAlpha: 0, ease: "power3.out" }, 0.23)
            .from(select(".contact-form label"), { y: 24, autoAlpha: 0, stagger: 0.055, ease: "power2.out" }, 0.36);

          return () => cleanup.forEach((dispose) => dispose());
        });

        responsiveMotion.add("(max-width: 800px)", () => {
          gsap.timeline({
            scrollTrigger: { trigger: first(".hero"), start: "top top", end: "bottom top", scrub: 0.55 },
          })
            .to(first(".hero-copy"), { y: -74, scale: 0.94, autoAlpha: 0, ease: "power2.in" }, 0)
            .to(first(".hero-background-video"), { scale: 1.07, ease: "none" }, 0);

          const reveal = (trigger, targets, vars = {}) => gsap.from(targets, {
            y: 52,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.78,
            ease: "power3.out",
            ...vars,
            scrollTrigger: { trigger, start: "top 88%", toggleActions: "play none none reverse" },
          });

          reveal(first(".trust-rail"), select(".trust-grid > div"), { y: 38 });
          reveal(first(".about"), select(".about .section-heading > *, .story-copy > *"));
          select(".section-intro, .center-heading").forEach((heading) => reveal(heading, heading.children));
          reveal(first(".solutions-grid"), select(".solution-item"), { x: 52, y: 24, stagger: 0.06 });
          reveal(first(".process-grid"), select(".process-step"), { y: 68, rotateX: -18 });

          gsap.timeline({
            scrollTrigger: { trigger: first(".tech-feature"), start: "top 86%", toggleActions: "play none none reverse" },
          })
            .from(select(".layer"), { y: 84, scale: 0.8, autoAlpha: 0.2, stagger: 0.1, duration: 0.8, ease: "power3.out" })
            .from(select(".tech-copy > *"), { y: 46, autoAlpha: 0, stagger: 0.065, duration: 0.62, ease: "power3.out" }, 0.22);

          reveal(first(".specs-layout"), select(".specs-copy > *, .spec-table"), { y: 62 });
          reveal(first(".logistics-stage"), select(".logistics-copy, .logistics-point"), { y: 48 });
          reveal(first(".contact"), select(".contact-copy > *, .contact-form"), { y: 58 });
        });
      }, siteRef);

      refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    };

    setupMotion();
    return () => {
      cancelled = true;
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
      responsiveMotion?.revert();
      gsapContext?.revert();
      root.classList.remove("motion-enhanced");
    };
  }, [siteRef]);
}
