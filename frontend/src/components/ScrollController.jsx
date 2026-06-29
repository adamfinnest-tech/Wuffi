import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function ScrollController({ frameRef, totalFrames, children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // --- Lenis v1.x setup ---
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
    });

    // Forward lenis scroll position to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via GSAP ticker (most reliable approach)
    const lenisRafCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisRafCallback);
    gsap.ticker.lagSmoothing(0);

    // --- GSAP ScrollTrigger pin + scrub ---
    // The trigger is the container div. GSAP will pin it at "top top"
    // and extend the page's scrollable height by `totalFrames * 20` px.
    // As the user scrolls through that distance, `progress` goes 0→1.
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalFrames * 20}`, // 240 frames × 20px = 4800px of scroll
        pin: true,                     // pin the container in place
        pinSpacing: true,              // let GSAP add the spacer div below
        anticipatePin: 1,              // prevents jump at pin moment
        scrub: 0.5,                    // smooth scrub (0 = instant, higher = more lag)
        onUpdate: (self) => {
          // Map scroll progress [0,1] → frame index [0, totalFrames-1]
          frameRef.current = Math.min(
            totalFrames - 1,
            Math.max(0, self.progress * (totalFrames - 1))
          );
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(lenisRafCallback);
    };
  }, [frameRef, totalFrames]);

  return (
    // This div is the ScrollTrigger anchor. It MUST be in the normal document
    // flow (not fixed/absolute) and have a real viewport height so GSAP can
    // pin it correctly.
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
}
