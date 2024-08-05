const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./Assets/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 127,
  },
  imageSrc: "./Assets/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "Assets/samuraiMack/Idle.png",
  scale: 2.3,
  framesMax: 8,
  offset: {
    x: 215,
    y: 132,
  },
  sprites: {
    idle: {
      imageSrc: "Assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "Assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "Assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "Assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "Assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "Assets/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "Assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  hitBox: {
    offset: {
      x: 80,
      y: 50,
    },
    width: 140,
    height: 50,
  },
});

player.drawSprite();

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "Assets/kenji/Idle.png",
  scale: 2.3,
  framesMax: 4,
  offset: {
    x: 215,
    y: 142,
  },
  sprites: {
    idle: {
      imageSrc: "Assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "Assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "Assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "Assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "Assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "Assets/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "Assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  hitBox: {
    offset: {
      x: -176,
      y: 50,
    },
    width: 140,
    height: 50,
  },
});

enemy.drawSprite();

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animateMovements() {
  window.requestAnimationFrame(animateMovements);
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  background.updateSprite();
  shop.updateSprite();
  canvasContext.fillStyle = "rgba(255,255,255, 0.15)";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  player.updateSprite();
  enemy.updateSprite();

  // Characters' initial velocity
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -3;
    player.switchSprites("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 3;
    player.switchSprites("run");
  } else {
    player.switchSprites("idle");
  }

  // Jumping
  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprites("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }

  // Jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  // Collision detection for player and enemy gets hit
  if (
    collisionDetection({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to("#enemy-health", {
      width: enemy.health + "%",
    });
  }

  // player missing attack
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // Collision detection for enemy and player gets hit
  if (
    collisionDetection({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    // document.querySelector("#player-health").style.width = player.health + "%";
    gsap.to("#player-health", {
      width: player.health + "%",
    });
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animateMovements();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      // Player
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case "h":
        player.attack();
        break;
    }

    if (!enemy.dead) {
      switch (event.key) {
        // Enemy
        case "ArrowRight":
          keys.ArrowRight.pressed = true;
          enemy.lastKey = "ArrowRight";
          break;
        case "ArrowLeft":
          keys.ArrowLeft.pressed = true;
          enemy.lastKey = "ArrowLeft";
          break;
        case "ArrowUp":
          enemy.velocity.y = -20;
          break;
        case "ArrowDown":
          enemy.attack();
          break;
      }
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // Player
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    // Enemy
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
