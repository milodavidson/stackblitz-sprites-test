import { useState, useEffect } from "react";

// Import the sprites you uploaded
import ArcherIdle from "./assets/Archer_Idle.png";
import Tree from "./assets/Tree1.png";

export default function App() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [frame, setFrame] = useState(0);

  const totalFrames = 5; // number of frames in your sprite sheet
  const frameWidth = 64; // width of a single frame in pixels
  const frameHeight = 64; // height of a single frame

  // Arrow key movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPosition((prev) => {
        switch (e.key) {
          case "ArrowUp":
            return { ...prev, y: prev.y - 10 };
          case "ArrowDown":
            return { ...prev, y: prev.y + 10 };
          case "ArrowLeft":
            return { ...prev, x: prev.x - 10 };
          case "ArrowRight":
            return { ...prev, x: prev.x + 10 };
          default:
            return prev;
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Animate the archer
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, 200); // change frame every 200ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#90EE90",
        overflow: "hidden",
        imageRendering: "pixelated",
      }}
    >
      {/* Tree (static object) */}
      <img
        src={Tree}
        alt="Tree"
        style={{
          position: "absolute",
          left: 300,
          top: 200,
          width: 64,
          height: 64,
        }}
      />

      {/* Archer (animated) */}
      <div
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: frameWidth,
          height: frameHeight,
          backgroundImage: `url(${ArcherIdle})`,
          backgroundPosition: `-${frame * frameWidth}px 0px`,
          backgroundSize: `${frameWidth * totalFrames}px ${frameHeight}px`,
        }}
      />
    </div>
  );
}
