import { useState, useEffect } from "react";

// Import the sprites you uploaded
import ArcherIdle from "./assets/Archer_Idle.png";
import Tree from "./assets/Tree1.png";

export default function App() {
  const [position, setPosition] = useState({ x: 100, y: 100 });

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

      {/* Archer (movable) */}
      <img
        src={ArcherIdle}
        alt="Archer"
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: 64,
          height: 64,
        }}
      />
    </div>
  );
}
