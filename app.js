const state = {
  coins: 1500,
  jackpotPot: 8000,
  tickets: 0,
  streak: 1,
  dailyClaimed: false,
  leaders: [
    { name: 'NeonNinja', score: 21000 },
    { name: 'LuckyLuna', score: 18400 },
    { name: 'DiceDewa', score: 16600 },
    { name: 'TwenPlayer', score: 12000 },
  ],
};

const symbols = ['🍒', '🍋', '⭐', '7️⃣', '🍀'];
const wheelRewards = [50, 80, 120, 200, 300, 500, 700, 1000];
const sounds = {
  click: [300, 0.04],
  spin: [180, 0.1],
  reward: [560, 0.13],
  jackpot: [860, 0.2],
};

const coinCount = document.getElementById('coinCount');
const wheel = document.getElementById('wheel');
const spinResult = document.getElementById('spinResult');
const jackpotPot = document.getElementById('jackpotPot');
const myTickets = document.getElementById('myTickets');
const jackpotResult = document.getElementById('jackpotResult');
const timerLabel = document.getElementById('jackpotTimer');
const leaderboardList = document.getElementById('leaderboardList');
const streakCount = document.getElementById('streakCount');

function beep([freq, dur]) {
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ac.destination);
  gain.gain.value = 0.08;
  osc.start();
  osc.stop(ac.currentTime + dur);
}

function updateUI() {
  coinCount.textContent = state.coins;
  jackpotPot.textContent = state.jackpotPot;
  myTickets.textContent = state.tickets;
  streakCount.textContent = `${state.streak} hari`;

  state.leaders.sort((a, b) => b.score - a.score);
  leaderboardList.innerHTML = state.leaders
    .map((item, idx) => `<li>#${idx + 1} ${item.name} — ${item.score} pts</li>`)
    .join('');
}

function addCoins(amount) {
  state.coins += amount;
  updateUI();
}

// Navigation
for (const btn of document.querySelectorAll('.nav-btn')) {
  btn.addEventListener('click', () => {
    beep(sounds.click);
    const screen = btn.dataset.screen;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
    document.getElementById(`screen-${screen}`).classList.add('active');
    btn.classList.add('active');
  });
}

// Spin wheel
let rotation = 0;
document.getElementById('spinBtn').addEventListener('click', () => {
  beep(sounds.spin);
  if (state.coins < 50) {
    spinResult.textContent = 'Koin tidak cukup untuk spin.';
    return;
  }
  state.coins -= 50;
  const prizeIndex = Math.floor(Math.random() * wheelRewards.length);
  const reward = wheelRewards[prizeIndex];
  const tier = reward >= 500 ? 'EPIC' : reward >= 200 ? 'Langka' : 'Biasa';

  rotation += 1440 + (360 - prizeIndex * 45);
  wheel.style.transform = `rotate(${rotation}deg)`;

  setTimeout(() => {
    beep(sounds.reward);
    addCoins(reward);
    spinResult.textContent = `Menang ${reward} koin (${tier})!`;
    if (tier === 'EPIC') launchConfetti();
  }, 3600);

  updateUI();
});

// Jackpot
let countdown = 30;
setInterval(() => {
  countdown -= 1;
  if (countdown <= 0) {
    runJackpotDraw();
    countdown = 30;
  }
  const mm = String(Math.floor(countdown / 60)).padStart(2, '0');
  const ss = String(countdown % 60).padStart(2, '0');
  timerLabel.textContent = `${mm}:${ss}`;
}, 1000);

function runJackpotDraw() {
  if (state.tickets <= 0) {
    jackpotResult.textContent = 'Draw selesai: belum ada tiket pemain.';
    state.jackpotPot += 500;
    updateUI();
    return;
  }
  const chance = Math.min(0.15 + state.tickets * 0.03, 0.8);
  const win = Math.random() < chance;
  if (win) {
    beep(sounds.jackpot);
    const won = state.jackpotPot;
    addCoins(won);
    jackpotResult.textContent = `🎉 JACKPOT! Kamu menang ${won} koin.`;
    state.jackpotPot = 5000;
    state.tickets = 0;
    launchConfetti();
  } else {
    jackpotResult.textContent = 'Belum menang. Pot bertambah +1000.';
    state.jackpotPot += 1000;
  }
  updateUI();
}

document.getElementById('buyTicketBtn').addEventListener('click', () => {
  beep(sounds.click);
  if (state.coins < 100) {
    jackpotResult.textContent = 'Koin tidak cukup untuk beli tiket.';
    return;
  }
  state.coins -= 100;
  state.tickets += 1;
  state.jackpotPot += 100;
  jackpotResult.textContent = `Tiket dibeli. Peluangmu meningkat!`;
  updateUI();
});

document.getElementById('forceDrawBtn').addEventListener('click', runJackpotDraw);

// Mini tabs
for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    beep(sounds.click);
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mini-pane').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`mini-${tab.dataset.mini}`).classList.add('active');
  });
}

// Slot
const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
document.getElementById('slotSpinBtn').addEventListener('click', () => {
  beep(sounds.spin);
  const slotResult = document.getElementById('slotResult');
  if (state.coins < 40) {
    slotResult.textContent = 'Koin tidak cukup untuk spin slot.';
    return;
  }
  state.coins -= 40;
  reels.forEach((r, i) => {
    setTimeout(() => {
      r.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }, 300 * (i + 1));
  });
  setTimeout(() => {
    const [a, b, c] = reels.map(r => r.textContent);
    if (a === b && b === c) {
      addCoins(450);
      slotResult.textContent = `Jackpot mini! Simbol ${a}${b}${c} => +450`;
      launchConfetti();
    } else {
      slotResult.textContent = `${a} ${b} ${c} — coba lagi!`;
    }
    updateUI();
  }, 1200);
  updateUI();
});

// Scratch card
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const scratchPrizeLabel = document.getElementById('scratchPrize');
let scratchPrize = 0;

function resetScratch() {
  scratchPrize = [60, 120, 250, 400][Math.floor(Math.random() * 4)];
  scratchPrizeLabel.textContent = `Hadiah tersembunyi: ${scratchPrize} koin`;
  ctx.fillStyle = '#6f78cc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Gores area ini ✨', 65, 75);
}
resetScratch();

let scratching = false;
function scratch(e) {
  if (!scratching) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc((x / rect.width) * canvas.width, (y / rect.height) * canvas.height, 16, 0, Math.PI * 2);
  ctx.fill();
}

canvas.addEventListener('mousedown', () => scratching = true);
canvas.addEventListener('mouseup', () => scratching = false);
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('touchstart', () => scratching = true);
canvas.addEventListener('touchend', () => scratching = false);
canvas.addEventListener('touchmove', scratch);

canvas.addEventListener('mouseup', () => {
  beep(sounds.reward);
  addCoins(scratchPrize);
  scratchPrizeLabel.textContent = `Hadiah diklaim: +${scratchPrize} koin`;
});

document.getElementById('resetScratchBtn').addEventListener('click', () => {
  beep(sounds.click);
  resetScratch();
});

// Dice
document.getElementById('rollDiceBtn').addEventListener('click', () => {
  beep(sounds.spin);
  const diceResult = document.getElementById('diceResult');
  if (state.coins < 30) {
    diceResult.textContent = 'Koin tidak cukup untuk roll dadu.';
    return;
  }
  state.coins -= 30;
  const val = 1 + Math.floor(Math.random() * 6);
  document.getElementById('diceVisual').textContent = ['⚀','⚁','⚂','⚃','⚄','⚅'][val - 1];
  const reward = val >= 5 ? 220 : val >= 3 ? 90 : 20;
  addCoins(reward);
  diceResult.textContent = `Muncul ${val}, reward +${reward}`;
  if (val === 6) launchConfetti();
  updateUI();
});

// Shop
for (const item of document.querySelectorAll('.shop-item')) {
  item.addEventListener('click', () => {
    beep(sounds.click);
    const price = Number(item.dataset.price);
    const name = item.dataset.name;
    const shopResult = document.getElementById('shopResult');
    if (state.coins < price) {
      shopResult.textContent = `Koin tidak cukup untuk ${name}.`;
      return;
    }
    state.coins -= price;
    if (name.includes('Ticket')) state.tickets += 3;
    shopResult.textContent = `${name} dibeli!`;
    updateUI();
  });
}

// Daily reward
document.getElementById('dailyClaimBtn').addEventListener('click', () => {
  const dailyResult = document.getElementById('dailyResult');
  beep(sounds.reward);
  if (state.dailyClaimed) {
    dailyResult.textContent = 'Reward hari ini sudah di-claim.';
    return;
  }
  const bonus = 100 + state.streak * 25;
  addCoins(bonus);
  state.dailyClaimed = true;
  state.streak += 1;
  dailyResult.textContent = `Daily reward +${bonus} diterima.`;
  updateUI();
});

// Confetti
const confettiCanvas = document.getElementById('confetti');
const cctx = confettiCanvas.getContext('2d');
let confettiParticles = [];

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

function launchConfetti() {
  confettiParticles = Array.from({ length: 90 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -20,
    speed: 2 + Math.random() * 4,
    size: 4 + Math.random() * 6,
    color: ['#ffda59', '#ff6b81', '#7bed9f', '#70a1ff'][Math.floor(Math.random() * 4)],
  }));
  requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach((p) => {
    p.y += p.speed;
    p.x += Math.sin(p.y * 0.03);
    cctx.fillStyle = p.color;
    cctx.fillRect(p.x, p.y, p.size, p.size);
  });
  confettiParticles = confettiParticles.filter(p => p.y < confettiCanvas.height + 20);
  if (confettiParticles.length) requestAnimationFrame(drawConfetti);
}

updateUI();
