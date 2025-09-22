import { useState, useEffect } from "react";

// Idle frames (6 frames)
import ArcherIdle1 from "./assets/ArcherIdle1.png";
import ArcherIdle2 from "./assets/ArcherIdle2.png";
import ArcherIdle3 from "./assets/ArcherIdle3.png";
import ArcherIdle4 from "./assets/ArcherIdle4.png";
import ArcherIdle5 from "./assets/ArcherIdle5.png";
import ArcherIdle6 from "./assets/ArcherIdle6.png";

// Running frames (4 frames)
import ArcherRun1 from "./assets/ArcherRun1.png";
import ArcherRun2 from "./assets/ArcherRun2.png";
import ArcherRun3 from "./assets/ArcherRun3.png";
import ArcherRun4 from "./assets/ArcherRun4.png";

// Tree frames (8 frames, optional)
import Tree1 from "./assets/Tree1.png";
import Tree2 from "./assets/Tree2.png";
import Tree3 from "./assets/Tree3.png";
import Tree4 from "./assets/Tree4.png";
import Tree5 from "./assets/Tree5.png";
import Tree6 from "./assets/Tree6.png";
import Tree7 from "./assets/Tree7.png";
import Tree8 from "./assets/Tree8.png";

const idleFrames = [ArcherIdle1, ArcherIdle2, ArcherIdle3, ArcherIdle4, ArcherIdle5, ArcherIdle6];
const runFrames = [ArcherRun1, ArcherRun2, ArcherRun3, ArcherRun4];
const treeFrames = [Tree1, Tree2, Tree3, Tree4, Tree5, Tree6, Tree7, Tree8];

export default function App() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [archerFrame, setArcherFrame] = useState(0);
  const [treeFrame, setTreeFrame] = useState(0);
  const [lastDirection, setLastDirection] = useState<"left" | "right">("right");
  const [isMoving, setIsMoving] = useState(false);

  // Arrow key movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPosition((prev) => {
        let moved = false;
        let newPos = { ...prev };
        switch (e.key) {
          case "ArrowUp":
            newPos.y -= 10;
            moved = true;
            break;
          case "ArrowDown":
            newPos.y += 10;
            moved = true;
            break;
          case "ArrowLeft":
            newPos.x -= 10;
            setLastDirection("left");
            moved = true;
            break;
          case "ArrowRight":
            newPos.x += 10;
            setLastDirection("right");
            moved = true;
            break;
        }
        setIsMoving(moved);
        return newPos;
      });
    };

    const handleKeyUp = () => {
      setIsMoving(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Animate the archer
  useEffect(() => {
    const interval = setInterval(() => {
      setArcherFrame((prev) => {
        const frames = isMoving ? runFrames : idleFrames;
        return (prev + 1) % frames.length;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isMoving]);

  // Animate the tree (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      setTreeFrame((prev) => (prev + 1) % treeFrames.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const currentArcherFrames = isMoving ? runFrames : idleFrames;

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

      {/* Archer (movable & animated, flips left/right) */}
      <img
        src={currentArcherFrames[archerFrame]}
        alt="Archer"
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: 64,
          height: 64,
          transform: lastDirection === "left" ? "scaleX(-1)" : "scaleX(1)",
        }}
      />
    </div>
  );
}
