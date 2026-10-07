import { useEffect, useRef } from "react";
import styles from "./PasswordArtwork.module.css";

const alphabet =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*<>";
// Decorative sequence only. Generated user secrets never enter this artwork.
const specimen = "K7#mR9!xQ2$v";

export function PasswordArtwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      phase = 0;
    let burst = reduced.matches ? 0 : 1,
      pointerX = 0,
      pointerY = 0,
      targetX = 0,
      targetY = 0;
    let visible = true;
    const streams = Array.from({ length: 35 }, (_, index) => ({
      seed: index * 173 + 19,
      offset: Math.random(),
      speed: 0.025 + Math.random() * 0.05,
      depth: 0.4 + Math.random() * 0.6,
    }));
    const glyph = (seed: number) =>
      alphabet[Math.abs(Math.floor(seed)) % alphabet.length] ?? "#";

    function paint() {
      if (!context) return;
      context.fillStyle = "#020a07";
      context.fillRect(0, 0, width, height);
      const glow = context.createRadialGradient(
        width * 0.52,
        height * 0.48,
        0,
        width * 0.52,
        height * 0.48,
        width * 0.62,
      );
      glow.addColorStop(0, "#0a3825");
      glow.addColorStop(0.55, "#04180f");
      glow.addColorStop(1, "#020a07");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      context.textAlign = "center";
      for (const stream of streams) {
        const x =
          ((stream.seed % 35) / 35) * width + pointerX * stream.depth * 16;
        const head =
          ((stream.offset + phase * stream.speed) % 1.5) * height -
          height * 0.25;
        const size = 9 + stream.depth * 5;
        context.font = `${size}px Consolas, monospace`;
        for (let row = 0; row < 16; row++) {
          const y = head - row * 15 + pointerY * stream.depth * 10;
          const distance = Math.hypot(
            x - width * (0.5 + pointerX * 0.25),
            y - height * (0.5 + pointerY * 0.25),
          );
          const influence = Math.max(0, 1 - distance / 90);
          context.globalAlpha = Math.max(
            0.03,
            (1 - row / 16) * 0.35 * stream.depth + influence * 0.4,
          );
          context.fillStyle = row === 0 ? "#b3ffd4" : "#37ce80";
          context.fillText(
            glyph(stream.seed + row * 37 + Math.floor(phase * 4)),
            x,
            y,
          );
        }
      }
      context.globalAlpha = 1;
      const centerX = width * 0.5 + pointerX * 8,
        centerY = height * 0.48 + pointerY * 5;
      const veil = context.createLinearGradient(
        0,
        centerY - 48,
        0,
        centerY + 48,
      );
      veil.addColorStop(0, "#020a0700");
      veil.addColorStop(0.3, "#020a07dd");
      veil.addColorStop(0.7, "#020a07dd");
      veil.addColorStop(1, "#020a0700");
      context.fillStyle = veil;
      context.fillRect(0, centerY - 48, width, 96);
      const fontSize = Math.min(30, width / 17);
      const spacing = fontSize * 0.78;
      context.font = `600 ${fontSize}px Consolas, monospace`;
      for (let i = 0; i < specimen.length; i++) {
        const unsettled = burst > (1 - i / specimen.length) * 0.75;
        const character = unsettled
          ? glyph(i * 17 + phase * 35)
          : (specimen[i] ?? "#");
        context.fillStyle = unsettled ? "#55e897" : "#ceffe2";
        context.shadowColor = "#36ee87";
        context.shadowBlur = unsettled ? 15 : 7;
        context.fillText(
          character,
          centerX + (i - (specimen.length - 1) / 2) * spacing,
          centerY + 8,
        );
      }
      context.shadowBlur = 0;
      context.font = "10px Consolas, monospace";
      context.fillStyle = "#579d75";
      context.fillText(
        "P A S S W O R D  /  E N T R O P Y",
        centerX,
        centerY - 31,
      );
      context.strokeStyle = "#4ee69244";
      context.beginPath();
      context.moveTo(width * 0.14, centerY + 32);
      context.lineTo(width * 0.86, centerY + 32);
      context.stroke();
      if (burst > 0.01) {
        context.strokeStyle = `rgba(106,255,168,${burst * 0.22})`;
        context.beginPath();
        context.ellipse(
          centerX,
          centerY,
          (1 - burst) * width * 0.75 + 15,
          (1 - burst) * height * 0.6 + 10,
          0,
          0,
          Math.PI * 2,
        );
        context.stroke();
      }
      context.textAlign = "left";
      context.font = "9px Consolas, monospace";
      context.fillStyle = "#5b9472";
      context.fillText("[ CSPRNG ]", 19, 25);
      context.fillText("Aa / 09 / #$", 19, height - 22);
    }
    function resize() {
      if (!canvas || !context) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    }
    function animate(time: number) {
      frame = requestAnimationFrame(animate);
      if (document.hidden || !visible || reduced.matches || time - last < 32)
        return;
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      phase += dt;
      burst = Math.max(0, burst - dt * 0.55);
      pointerX += (targetX - pointerX) * 0.09;
      pointerY += (targetY - pointerY) * 0.09;
      paint();
    }
    function move(event: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    }
    function leave() {
      targetX = 0;
      targetY = 0;
    }
    function pulse() {
      burst = 1;
      if (reduced.matches) {
        burst = 0;
        paint();
      }
    }
    function motionChange() {
      burst = 0;
      paint();
    }
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
    });
    observer.observe(canvas);
    intersection.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    window.addEventListener("pfx:generate", pulse);
    reduced.addEventListener("change", motionChange);
    resize();
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      window.removeEventListener("pfx:generate", pulse);
      reduced.removeEventListener("change", motionChange);
    };
  }, []);

  return (
    <div className={styles.artwork} aria-hidden="true">
      <canvas ref={canvasRef} />
      <img
        className={styles.signature}
        src={import.meta.env.BASE_URL + "pfx-logo.svg"}
        alt=""
      />
    </div>
  );
}
