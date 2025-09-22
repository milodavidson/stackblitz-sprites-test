import { useState, useEffect, useRef } from "react";

// --- Player frames ---
import ArcherIdle1 from "./assets/ArcherIdle1.png";
import ArcherIdle2 from "./assets/ArcherIdle2.png";
import ArcherIdle3 from "./assets/ArcherIdle3.png";
import ArcherIdle4 from "./assets/ArcherIdle4.png";
import ArcherIdle5 from "./assets/ArcherIdle5.png";
import ArcherIdle6 from "./assets/ArcherIdle6.png";

import ArcherRun1 from "./assets/ArcherRun1.png";
import ArcherRun2 from "./assets/ArcherRun2.png";
import ArcherRun3 from "./assets/ArcherRun3.png";
import ArcherRun4 from "./assets/ArcherRun4.png";

import ArcherShoot1 from "./assets/ArcherShoot1.png";
import ArcherShoot2 from "./assets/ArcherShoot2.png";
import ArcherShoot3 from "./assets/ArcherShoot3.png";
import ArcherShoot4 from "./assets/ArcherShoot4.png";
import ArcherShoot5 from "./assets/ArcherShoot5.png";
import ArcherShoot6 from "./assets/ArcherShoot6.png";
import ArcherShoot7 from "./assets/ArcherShoot7.png";
import ArcherShoot8 from "./assets/ArcherShoot8.png";

import ArrowImg from "./assets/Arrow.png";

// --- Tree frames ---
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
const shootFrames = [
  ArcherShoot1,
  ArcherShoot2,
  ArcherShoot3,
  ArcherShoot4,
  ArcherShoot5,
  ArcherShoot6,
  ArcherShoot7,
  ArcherShoot8,
];
const treeFrames = [Tree1, Tree2, Tree3, Tree4, Tree5, Tree6, Tree7, Tree8];

type Direction = "left" | "right";

interface Arrow {
  x: number;
  y: number;
  direction: Direction;
}

export default function App() {
  const scale = 4;
  const spriteSize = 64 * scale;

  // --- Player ---
  const [playerPos, setPlayerPos] = useState({ x: 100, y: 100 });
  const playerPosRef = useRef(playerPos);
  const [playerFrame, setPlayerFrame] = useState(0);
  const [playerLastDir, setPlayerLastDir] = useState<Direction>("right");
  const playerLastDirRef = useRef(playerLastDir);
  const [playerIsMoving, setPlayerIsMoving] = useState(false);
  const [playerIsShooting, setPlayerIsShooting] = useState(false);
  const [shootFrame, setShootFrame] = useState(0);

  // --- AI Archer ---
  const [aiPos, setAiPos] = useState({ x: 500, y: 300 });
  const [aiFrame, setAiFrame] = useState(0);
  const [aiLastDir, setAiLastDir] = useState<Direction>("left");

  // --- Tree ---
  const [treeFrame, setTreeFrame] = useState(0);

  // --- Arrows ---
  const [arrows, setArrows] = useState<Arrow[]>([]);

  // --- Score ---
  const [score, setScore] = useState(0);

  const keysPressed = useRef(new Set<string>());

  // --- Keep refs updated ---
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { playerLastDirRef.current = playerLastDir; }, [playerLastDir]);

  // --- Input ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      if (e.key === " " && !playerIsShooting) {
        setPlayerIsShooting(true);
        setShootFrame(0);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playerIsShooting]);

  // --- Player Movement ---
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPos((prev) => {
        let newPos = { ...prev };
        if (keysPressed.current.has("ArrowUp")) newPos.y -= 10;
        if (keysPressed.current.has("ArrowDown")) newPos.y += 10;
        if (keysPressed.current.has("ArrowLeft")) {
          newPos.x -= 10;
          setPlayerLastDir("left");
        }
        if (keysPressed.current.has("ArrowRight")) {
          newPos.x += 10;
          setPlayerLastDir("right");
        }
        return newPos;
      });
      setPlayerIsMoving(
        keysPressed.current.has("ArrowUp") ||
        keysPressed.current.has("ArrowDown") ||
        keysPressed.current.has("ArrowLeft") ||
        keysPressed.current.has("ArrowRight")
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // --- Player Shooting Animation ---
  useEffect(() => {
    if (!playerIsShooting) return;
    const interval = setInterval(() => {
      setShootFrame((prev) => {
        const next = prev + 1;
        if (next >= shootFrames.length-1) {
          // Spawn arrow after shoot animation completes
          setArrows((prevArrows) => [
            ...prevArrows,
            {
              x: playerPosRef.current.x,
              y: playerPosRef.current.y,
              direction: playerLastDirRef.current,
            },
          ]);
          setPlayerIsShooting(false);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playerIsShooting]);

  // --- Player Idle/Run Animation ---
  useEffect(() => {
    if (playerIsShooting) return;
    const interval = setInterval(() => {
      setPlayerFrame((prev) => (prev + 1) % (playerIsMoving ? runFrames.length : idleFrames.length));
    }, 200);
    return () => clearInterval(interval);
  }, [playerIsMoving, playerIsShooting]);

  // --- AI Movement ---
  useEffect(() => {
    const interval = setInterval(() => {
      setAiPos((prev) => {
        const dir = Math.floor(Math.random() * 4);
        let newPos = { ...prev };
        switch (dir) {
          case 0: newPos.y -= 5; setAiLastDir("right"); break;
          case 1: newPos.y += 5; setAiLastDir("right"); break;
          case 2: newPos.x -= 5; setAiLastDir("left"); break;
          case 3: newPos.x += 5; setAiLastDir("right"); break;
        }
        return newPos;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // --- AI Animation ---
  useEffect(() => {
    const interval = setInterval(() => {
      setAiFrame((prev) => (prev + 1) % runFrames.length);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // --- Tree Animation ---
  useEffect(() => {
    const interval = setInterval(() => {
      setTreeFrame((prev) => (prev + 1) % treeFrames.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // --- Arrow Movement & Collision ---
  useEffect(() => {
    const interval = setInterval(() => {
      setArrows((prev) => {
        const newArrows: Arrow[] = [];
        prev.forEach((arrow) => {
          let newArrow = { ...arrow };
          newArrow.x += arrow.direction === "right" ? 15 : -15;

          // Collision with AI
          if (
            newArrow.x + spriteSize > aiPos.x &&
            newArrow.x < aiPos.x + spriteSize &&
            newArrow.y + spriteSize > aiPos.y &&
            newArrow.y < aiPos.y + spriteSize
          ) {
            setScore((s) => s + 1);
          } else if (newArrow.x > 0 && newArrow.x < window.innerWidth) {
            newArrows.push(newArrow);
          }
        });
        return newArrows;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [aiPos]);

  const playerSprite = playerIsShooting
    ? shootFrames[shootFrame]
    : playerIsMoving
    ? runFrames[playerFrame % runFrames.length]
    : idleFrames[playerFrame % idleFrames.length];

  const aiSprite = runFrames[aiFrame % runFrames.length];

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
      {/* Tree */}
      <img
        src={treeFrames[treeFrame]}
        alt="Tree"
        style={{
          position: "absolute",
          left: 300,
          top: 200,
          width: spriteSize,
          height: spriteSize,
        }}
      />

      {/* Player */}
      <img
        src={playerSprite}
        alt="Player Archer"
        style={{
          position: "absolute",
          left: playerPos.x,
          top: playerPos.y,
          width: spriteSize,
          height: spriteSize,
          transform: playerLastDir === "left" ? "scaleX(-1)" : "scaleX(1)",
        }}
      />

      {/* AI Archer */}
      <img
        src={aiSprite}
        alt="AI Archer"
        style={{
          position: "absolute",
          left: aiPos.x,
          top: aiPos.y,
          width: spriteSize,
          height: spriteSize,
          transform: aiLastDir === "left" ? "scaleX(-1)" : "scaleX(1)",
        }}
      />

      {/* Arrows */}
      {arrows.map((arrow, i) => (
        <img
          key={i}
          src={ArrowImg}
          alt="Arrow"
          style={{
            position: "absolute",
            left: arrow.x,
            top: arrow.y + spriteSize / 2 - 8,
            width: 32 * scale,
            height: 16 * scale,
            transform: arrow.direction === "left" ? "scaleX(-1)" : "scaleX(1)",
          }}
        />
      ))}

      {/* Score */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: 32,
          fontWeight: "bold",
          color: "black",
        }}
      >
        Score: {score}
      </div>
    </div>
  );
}
