import { useEffect, useRef } from "react";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gameOver = false;
    let score = 0;

    const keys = {};

    const player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 20,
      speed: 6,
      color: "#00ffff",
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

      update() {
        this.x += this.dx;
        this.y += this.dy;

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

    const enemies = [];

    const colors = [
      "#ff0055",
      "#ffaa00",
      "#ff00ff",
      "#ff3333",
    ];

    for (let i = 0; i < 8; i++) {
      enemies.push(
        new Enemy(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 30 + 15,
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 7,
          colors[Math.floor(Math.random() * colors.length)]
        )
      );
    }

    window.addEventListener("keydown", (e) => {
      keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      keys[e.key] = false;
    });

    function movePlayer() {
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
    }

    function drawPlayer() {
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);

      ctx.shadowColor = player.color;
      ctx.shadowBlur = 30;

      ctx.fillStyle = player.color;
      ctx.fill();
    }

    function checkCollision(enemy) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < player.radius + enemy.radius) {
        gameOver = true;
      }
    }

    function animate() {
      if (gameOver) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "60px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 180, canvas.height / 2);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(
          `Score: ${Math.floor(score)}`,
          canvas.width / 2 - 70,
          canvas.height / 2 + 60
        );

        return;
      }

      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      movePlayer();

      drawPlayer();

      enemies.forEach((enemy) => {
        enemy.update();
        checkCollision(enemy);
      });

      score += 0.05;

      ctx.fillStyle = "white";
      ctx.font = "28px Arial";
      ctx.fillText(`Score: ${Math.floor(score)}`, 30, 50);

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

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