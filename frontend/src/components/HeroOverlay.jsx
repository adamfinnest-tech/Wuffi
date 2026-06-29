import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroOverlay() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Fade out and move up the hero text when the user starts scrolling
    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -50,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "300px top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[15vh] pointer-events-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="text-center px-4"
      >
        <h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-xl mb-4"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Meet Zuffi
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-light tracking-wide drop-shadow-md mb-10 max-w-md mx-auto">
          A tiny forest spirit with a big heart.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
          <button className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Watch Adventure
          </button>
          <button className="px-8 py-3 bg-transparent hover:bg-white/5 border border-transparent hover:border-white/20 text-white rounded-full font-medium tracking-wide transition-all duration-300 hover:scale-105">
            Learn More
          </button>
        </div>
      </motion.div>
    </div>
  );
}
