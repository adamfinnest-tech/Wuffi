import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function EyeTracker() {
  const [isMobile, setIsMobile] = useState(false);

  // Motion values for the mouse target
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configuration for natural inertia and delay
  const springConfig = { damping: 25, stiffness: 120, mass: 1.5 };
  
  // Spring values that track the mouse target
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e) => {
      if (isMobile) return;
      
      const { clientX, clientY, innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position from center (-1 to 1)
      const normalizedX = (clientX / innerWidth) * 2 - 1;
      const normalizedY = (clientY / innerHeight) * 2 - 1;
      
      // Max pixel movement (8-12px as requested)
      const maxMove = 10; 
      
      mouseX.set(normalizedX * maxMove);
      mouseY.set(normalizedY * maxMove);
    };

    const handleMouseLeave = () => {
      // Return to center when mouse leaves viewport
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile, mouseX, mouseY]);

  if (isMobile) {
    // Optionally render a gentle idle animation for mobile
    return null;
  }

  // NOTE: These positions (top, left) are estimated based on center.
  // In a real scenario, you'd adjust these to match the exact eye locations 
  // on your specific Creature 3D render.
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
      {/* Eye Container - Position this to match the creature's face */}
      <div className="relative w-[300px] h-[100px] flex justify-between items-center -mt-[10%]">
        
        {/* Left Eye */}
        <div className="relative w-[40px] h-[40px] rounded-full flex items-center justify-center ml-[40px]">
          <motion.div 
            className="w-[18px] h-[18px] bg-black rounded-full"
            style={{
              x: springX,
              y: springY,
            }}
          />
        </div>

        {/* Right Eye */}
        <div className="relative w-[40px] h-[40px] rounded-full flex items-center justify-center mr-[40px]">
          <motion.div 
            className="w-[18px] h-[18px] bg-black rounded-full"
            style={{
              x: springX,
              y: springY,
            }}
          />
        </div>

      </div>
    </div>
  );
}
