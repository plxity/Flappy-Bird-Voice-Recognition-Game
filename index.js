const screen = document.getElementsByClassName('game-screen');
const canvas = document.getElementById('canvas');
const playButton = document.getElementById('start-game');
const closeRules = document.getElementById('close-btn');
const showRules = document.getElementById('rules-btn');
const popup = document.getElementById('popup');
const ScoreCard = document.getElementById('score-card');
const playAgain = document.getElementById('play-again');
const ctx = canvas.getContext('2d');



// start recognition
const bird = {
  w: 40,
  h: 40,
  y: canvas.height / 2 - 40,
  x: 10,
  speed: 2,
  dx: 0,
  dy: 0,
};
var startGame = false;
var obstacles = [];
var score = 0;
const Obstacles = {
  minHeight: 100,
  maxHeight: 400,
  minGap: 60,
  maxGap: 450,
  y1: 0,
  y2: canvas.height,
  x2: canvas.width,
  x1: canvas.width,
  w: 20,
  speed: 1,
};

setInterval(() => {
  var randomHeightAbove = Math.floor(
    Math.random() * (Obstacles.maxHeight - Obstacles.minHeight + 1) +
      Obstacles.minHeight
  );
  var randomGap = Math.floor(
    Math.random() * (Obstacles.maxGap - Obstacles.minGap + 1) + Obstacles.minGap
  );
  var randomHeightBelow = canvas.height - randomHeightAbove - randomGap;
  obstacles.push({ ...Obstacles, randomHeightAbove, randomHeightBelow });
}, 6000);

setInterval(() => {
  score++;
}, 6400);

function drawScore() {
  ctx.font = '20px arial';
  canvas.fillStyle = "#F57600";
  ctx.fillText(`Score:${score}`, canvas.width - 100, 30);
}
function showScoreCard() {
  let x = document.createElement('h1');
  x.innerText = `Final Score: ${score}`;
  x.style.textAlign = 'center';
  ScoreCard.append(x);
  ScoreCard.classList.add('show');
}

function drawBird() {
  ctx.beginPath();
  ctx.rect(bird.x, bird.y, bird.w, bird.h);
  ctx.fillStyle = '#FFAB5C';
  ctx.fill();
  ctx.closePath();
}
function speechListener() {
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.addEventListener('start', () => {
    console.log('it started!');
  });
  recognition.addEventListener('end',  recognition.start);

  recognition.addEventListener('result', (e) => {
    var direction = e.results[0][0].transcript.toLocaleLowerCase();
    console.log(direction);
    if (direction === 'right') {
      bird.dx = bird.speed;
    } else if (direction === 'left') {
      bird.dx = -bird.speed;
    } else if (direction === 'up') {
      bird.dy = -bird.speed;
    } else if (direction === 'down') {
      bird.dy = bird.speed;
    }

  });
  recognition.start();
}
speechListener();

function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    ctx.beginPath();
    ctx.rect(
      obstacles[i].x1,
      obstacles[i].y1,
      obstacles[i].w,
      obstacles[i].randomHeightAbove
    );
    ctx.rect(
      obstacles[i].x2,
      obstacles[i].y2 - obstacles[i].randomHeightBelow,
      obstacles[i].w,
      obstacles[i].randomHeightBelow
    );
    ctx.fillStyle = '#663100';
    ctx.fill();
    ctx.closePath();
  }
}
function moveObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x1--;
    obstacles[i].x2--;
    if (
      bird.x + bird.w > obstacles[i].x1 &&
      bird.y - obstacles[i].randomHeightAbove < 0 &&
      bird.x - (obstacles[i].x1 + 20) < 0
    ) {
      startGame = false;
      showScoreCard();
      score = 0;
    } else if (
      bird.x + bird.w > obstacles[i].x2 &&
      bird.y + bird.h > obstacles[i].y2 - obstacles[i].randomHeightBelow &&
      obstacles[i].randomHeightBelow != 0 &&
      bird.x - (obstacles[i].x1 + 20) < 0
    ) {
      startGame = false;
      showScoreCard();
      score = 0;
    }
  }
}

function generateObstacles() {}
function drawEverything() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawObstacles();
}
function moveBird() {
  bird.x += bird.dx;
  bird.y += bird.dy;
  console.log(bird.x,bird.y);
  if (bird.x + bird.w > canvas.width) {
    bird.x = canvas.width - bird.w;
  }
  if (bird.x < 0) {
    bird.x = 0;
  }
  if (bird.y + bird.h > canvas.height) {
    bird.y = canvas.height - bird.h;
  }
  if (bird.y < 0) {
    bird.y = 0;
  }
}


function update() {
  drawEverything();
  moveBird();
  drawScore();
  moveObstacles();
}
update();
function checkStatus() {
  if (startGame === true) {
    update();
  }
  requestAnimationFrame(checkStatus);
}
checkStatus();
function keyDown(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    bird.dx = bird.speed;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    bird.dx = -bird.speed;
  } else if (e.key == 'ArrowUp') {
    bird.dy = -bird.speed;
  } else if (e.key == 'ArrowDown') {
    bird.dy = bird.speed;
  }
}

function keyUp() {
  bird.dx = 0;
  bird.dy = 0;
}

playAgain.addEventListener('click', () => {
  window.location.reload();
});
playButton.addEventListener('click', () => {
  popup.classList.add('hide');
  startGame = true;
});
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

closeRules.addEventListener('click', () => {
  rules.classList.remove('show');
});
showRules.addEventListener('click', () => {
  rules.classList.add('show');
});
