import { useEffect, useRef } from "react";

export function CanvasRenderer({ imagesRef, frameRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    let animationFrameId;
    let lastRenderedFrame = -1;
    // These are the PHYSICAL pixel dimensions of the canvas buffer
    let bufferWidth = 0;
    let bufferHeight = 0;

    const handleResize = () => {
      // Device pixel ratio — typically 1 on standard screens, 2 on Retina/HiDPI
      const dpr = window.devicePixelRatio || 1;

      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;

      // The canvas pixel BUFFER must match physical screen pixels for crisp rendering
      bufferWidth = Math.round(cssWidth * dpr);
      bufferHeight = Math.round(cssHeight * dpr);

      canvas.width = bufferWidth;
      canvas.height = bufferHeight;

      // The canvas CSS size stays at 100vw / 100vh (CSS pixels)
      // The browser handles the scaling — we just ensure the buffer is sharp
      // (no ctx.scale needed because we draw to physical pixels directly)

      lastRenderedFrame = -1; // force redraw after resize
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // run once on mount

    /**
     * Draw in COVER mode using the PHYSICAL pixel buffer dimensions.
     * This ensures the image is drawn at full resolution without upscaling blur.
     */
    const drawImageCover = (ctx, img, bw, bh) => {
      const iw = img.width;
      const ih = img.height;

      // Cover: scale so the image fills the entire buffer
      const scale = Math.max(bw / iw, bh / ih);

      const drawWidth = iw * scale;
      const drawHeight = ih * scale;

      // Center the image in the buffer
      const drawX = (bw - drawWidth) / 2;
      const drawY = (bh - drawHeight) / 2;

      // Solid black fill prevents flash between frames
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, bw, bh);

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };

    const renderLoop = () => {
      const currentFrame = Math.round(frameRef.current);

      if (currentFrame !== lastRenderedFrame) {
        const images = imagesRef.current;
        if (images && images[currentFrame]) {
          drawImageCover(ctx, images[currentFrame], bufferWidth, bufferHeight);
          lastRenderedFrame = currentFrame;
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [imagesRef, frameRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        // CSS display size: always fill the visible viewport
        width: "100vw",
        height: "100vh",
        display: "block",
        maxWidth: "100vw",
      }}
    />
  );
}
