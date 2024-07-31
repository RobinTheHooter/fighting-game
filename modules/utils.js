function collisionDetection({ rectangle1, rectangle2 }) {
  return (
    rectangle1.hitBox.position.x + rectangle1.hitBox.width >=
      rectangle2.position.x &&
    rectangle1.hitBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.hitBox.position.y + rectangle1.hitBox.height >=
      rectangle2.position.y &&
    rectangle1.hitBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#display-result").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#display-result").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#display-result").innerHTML = "Player 1 Wins";
  } else if (enemy.health > player.health) {
    document.querySelector("#display-result").innerHTML = "Player 2 Wins";
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
