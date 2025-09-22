import { useState, useEffect } from "react";

// Import the split archer frames
import Archer1 from "./assets/Archer1.png";
import Archer2 from "./assets/Archer2.png";
import Archer3 from "./assets/Archer3.png";
import Archer4 from "./assets/Archer4.png";
import Archer5 from "./assets/Archer5.png";
import Archer6 from "./assets/Archer6.png";

// Import the split tree frames
import Tree1 from "./assets/Tree1.png";
import Tree2 from "./assets/Tree2.png";
import Tree3 from "./assets/Tree3.png";
import Tree4 from "./assets/Tree4.png";
import Tree5 from "./assets/Tree5.png";
import Tree6 from "./assets/Tree6.png";
import Tree7 from "./assets/Tree7.png";
import Tree8 from "./assets/Tree8.png";

const archerFrames = [Archer1, Archer2, Archer3, Archer4, Archer5, Archer6];
const treeFrames = [Tree1, Tree2, Tree3, Tree4, Tree5, Tree6, Tree7, Tree8];

export default function App() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [archerFrame, setArcherFrame] = useState(0);
  const [treeFrame, setTreeFrame] = useState(0);

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
      setArcherFrame((prev) => (prev + 1) % archerFrames.length);
    }, 200); // change frame every 200ms
    return () => clearInterval(interval);
  }, []);

  // Animate the tree (optional, like a gentle sway)
  useEffect(() => {
    const interval = setInterval(() => {
      setTreeFrame((prev) => (prev + 1) % treeFrames.length);
    }, 400); // slower, 400ms per frame
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
      {/* Tree (animated) */}
      <img
        src={treeFrames[treeFrame]}
        alt="Tree"
        style={{
          position: "absolute",
          left: 300,
          top: 200,
          width: 64,
          height: 64,
        }}
      />

      {/* Archer (movable & animated) */}
      <img
        src={archerFrames[archerFrame]}
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
