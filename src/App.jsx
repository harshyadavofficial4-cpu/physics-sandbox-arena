import { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef(null);

  const [restartGame, setRestartGame] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId;

    let gameStarted = false;
    let hasPlayedBefore = false;
    let gameOver = false;
    let score = 0;

    const keys = {};

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 20,
      speed: 6,
      color: "#00ffff",
    };

    let touchTarget = {
      x: player.x,
      y: player.y,
    };

    class Enemy {
      constructor(x, y, radius, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;

        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update(speedMultiplier) {
        this.x += this.dx * speedMultiplier;
        this.y += this.dy * speedMultiplier;

        if (
          this.x + this.radius > canvas.width ||
          this.x - this.radius < 0
        ) {
          this.dx *= -1;
        }

        if (
          this.y + this.radius > canvas.height ||
          this.y - this.radius < 0
        ) {
          this.dy *= -1;
        }

        this.draw();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 4 + 2;
        this.dx = (Math.random() - 0.5) * 8;
        this.dy = (Math.random() - 0.5) * 8;
        this.life = 100;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;
        this.life--;

        this.draw();
      }
    }

    const particles = [];

    const enemies = [];

    const colors = [
      "#ff0055",
      "#ffaa00",
      "#ff00ff",
      "#ff3333",
    ];

    for (let i = 0; i < 8; i++) {
  let x;
  let y;

  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
  } while (
    Math.hypot(x - player.x, y - player.y) < 250
  );

  enemies.push(
    new Enemy(
      x,
      y,
      Math.random() * 30 + 15,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      colors[Math.floor(Math.random() * colors.length)]
    )
  );
}

    window.addEventListener("keydown", (e) => {
      gameStarted = true;
      hasPlayedBefore = true;

  keys[e.key] = true;
});

    window.addEventListener("keyup", (e) => {
      keys[e.key] = false;
    });

    canvas.addEventListener("touchstart", (e) => {

  if (!gameStarted) {
  gameStarted = true;
  hasPlayedBefore = true;
}

  const touch = e.touches[0];

  touchTarget.x = touch.clientX;
  touchTarget.y = touch.clientY;

}, { passive: true });

    canvas.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];

      touchTarget.x = touch.clientX;
      touchTarget.y = touch.clientY;
    });

    function movePlayer() {
      if (!isMobile) {
        if (keys["w"] || keys["ArrowUp"]) {
          player.y -= player.speed;
        }

        if (keys["s"] || keys["ArrowDown"]) {
          player.y += player.speed;
        }

        if (keys["a"] || keys["ArrowLeft"]) {
          player.x -= player.speed;
        }

        if (keys["d"] || keys["ArrowRight"]) {
          player.x += player.speed;
        }
      } else {
        player.x += (touchTarget.x - player.x) * 0.08;
        player.y += (touchTarget.y - player.y) * 0.08;
      }
    }

    function drawPlayer() {
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);

      ctx.shadowColor = player.color;
      ctx.shadowBlur = 30;

      ctx.fillStyle = player.color;
      ctx.fill();
    }

    function createExplosion(x, y, color) {
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, color));
      }
    }

    function checkCollision(enemy) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < player.radius + enemy.radius) {
        createExplosion(player.x, player.y, player.color);

        gameOver = true;
      }
    }

    function drawStartScreen() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ffff";
      ctx.font = "60px Arial";

      ctx.fillText(
        "Physics Arena",
        canvas.width / 2 - 200,
        canvas.height / 2 - 50
      );

      ctx.fillStyle = "white";
      ctx.font = "28px Arial";

      ctx.fillText(
        isMobile
          ? "Touch screen to begin"
          : "Press movement keys to begin",
        canvas.width / 2 - 180,
        canvas.height / 2 + 20
      );
    }

    function drawGameOver() {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "red";
      ctx.font = isMobile
  ? "42px Arial"
  : "60px Arial";

      ctx.fillText(
        "GAME OVER",
        canvas.width / 2 - 180,
        canvas.height / 2 - 30
      );

      ctx.fillStyle = "white";
      ctx.font = isMobile
  ? "24px Arial"
  : "32px Arial";

      ctx.fillText(
        `Score: ${Math.floor(score)}`,
        canvas.width / 2 - 70,
        canvas.height / 2 + 40
      );

      ctx.fillText(
  isMobile
    ? "Tap to Restart"
    : "Click to Restart",
        canvas.width / 2 - 120,
        canvas.height / 2 + 100
      );
    }

   const handleRestart = () => {
  if (gameOver) {
    setRestartGame((prev) => prev + 1);
  }
};

canvas.addEventListener("click", handleRestart);

canvas.addEventListener("click", handleRestart);
    function animate() {
      animationId = requestAnimationFrame(animate);

     if (!gameStarted && score === 0) {
    drawStartScreen();
    return;
}

      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      movePlayer();

      drawPlayer();

      const speedMultiplier = 1 + score / 500;

      enemies.forEach((enemy) => {
        enemy.update(speedMultiplier);

        if (!gameOver) {
          checkCollision(enemy);
        }
      });

      particles.forEach((particle, index) => {
        particle.update();

        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      });

      if (gameOver) {
        drawGameOver();
      } else {
        score += 0.1;
      }

      ctx.fillStyle = "white";
      ctx.font = "28px Arial";

      ctx.fillText(`Score: ${Math.floor(score)}`, 30, 50);

      const highScore =
        localStorage.getItem("physicsHighScore") || 0;

      if (score > highScore) {
        localStorage.setItem(
          "physicsHighScore",
          Math.floor(score)
        );
      }

      ctx.fillText(
        `High Score: ${
          localStorage.getItem("physicsHighScore") || 0
        }`,
        30,
        90
      );
    }

    animate();

    return () => {
  cancelAnimationFrame(animationId);

  canvas.removeEventListener("click", handleRestart);
};
  }, [restartGame]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        background: "black",
      }}
    />
  );
}

export default App;