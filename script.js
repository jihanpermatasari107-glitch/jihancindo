const jihan = document.getElementById('jihan');
const gameContainer = document.getElementById('gameContainer');
const scoreboard = document.getElementById('scoreboard');
const timerDisplay = document.getElementById('timer');
const gameOverText = document.getElementById('gameOver');
const catchSound = document.getElementById('catchSound');
const specialSound = document.getElementById('specialSound');

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let starInterval, timer;

let jihanX = gameContainer.offsetWidth / 2 - 30;
const speed = 15;

// Gerakan
function moveLeft() {
  if (!gameRunning) return;
  jihanX = Math.max(0, jihanX - speed);
  jihan.style.left = jihanX + 'px';
}

function moveRight() {
  if (!gameRunning) return;
  jihanX = Math.min(gameContainer.offsetWidth - 60, jihanX + speed);
  jihan.style.left = jihanX + 'px';
}

// Tombol sentuh
leftBtn.addEventListener('touchstart', () => { moveLeft(); });
rightBtn.addEventListener('touchstart', () => { moveRight(); });

// Tombol keyboard
document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
});

function startGame() {
  score = 0;
  timeLeft = 30;
  gameRunning = true;
  scoreboard.textContent = "Skor: " + score;
  timerDisplay.textContent = "Waktu: " + timeLeft;
  gameOverText.style.display = "none";
  document.querySelectorAll('.star').forEach(s => s.remove());

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = "Waktu: " + timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);

  starInterval = setInterval(createStar, 800);
}

function randomColor() {
  const colors = ["#ff0000","#00ff00","#0000ff","#ff00ff","#00ffff","#ffff00"];
  return colors[Math.floor(Math.random()*colors.length)];
}

function createStar() {
  if (!gameRunning) return;
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.left = Math.random() * (gameContainer.offsetWidth - 30) + 'px';
  star.style.background = randomColor();
  gameContainer.appendChild(star);

  let fall = setInterval(() => {
    let topPos = parseInt(window.getComputedStyle(star).getPropertyValue('top'));
    if (topPos > 470) {
      star.remove();
      clearInterval(fall);
    } else {
      star.style.top = topPos + 5 + 'px';
    }

    let starRect = star.getBoundingClientRect();
    let jihanRect = jihan.getBoundingClientRect();
    if (
      starRect.bottom > jihanRect.top &&
      starRect.top < jihanRect.bottom &&
      starRect.left < jihanRect.right &&
      starRect.right > jihanRect.left
    ) {
      star.remove();
      // 20% kemungkinan bintang spesial
      if (Math.random() < 0.2) {
        specialSound.play();
        score += 2;
      } else {
        catchSound.play();
        score += 1;
      }
      scoreboard.textContent = "Skor: " + score;
      clearInterval(fall);
    }
  }, 30);
}

function endGame() {
  gameRunning = false;
  clearInterval(timer);
  clearInterval(starInterval);
  document.querySelectorAll('.star').forEach(s => s.remove());
  gameOverText.style.display = "block";
  gameOverText.innerHTML = `🎉 Waktu Habis! 🎉<br>Skor Akhir Jihan: ${score}<br><button onclick="startGame()">Main Lagi</button>`;
}