document.body.style.background = "blue";
alert("VERSION4");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = 400;
const H = 600;

let gravity = 0.5;

// ===== AI =====
let p1 = { x:100, y:100, vx:0, vy:0, prevY:100, onGround:false };
let p2 = { x:300, y:100, vx:0, vy:0, prevY:100, onGround:false };

// ===== 足場 =====
let platforms = [];

function generatePlatforms() {
  platforms = [];
  for (let i = 0; i < 5; i++) {
    platforms.push({
      x: Math.random() * 300,
      y: 150 + i * 90,
      w: 100
    });
  }
}

generatePlatforms();

// ===== 物理更新 =====
function applyPhysics(p) {

  p.prevY = p.y;

  p.vy += gravity;

  p.x += p.vx;
  p.y += p.vy;

  if (p.x < 10) p.x = 10;
  if (p.x > W - 10) p.x = W - 10;

  let onGround = false;

  for (let pf of platforms) {

    let wasAbove = p.prevY + 10 <= pf.y;
    let isBelow  = p.y + 10 >= pf.y;

    if (
      p.x > pf.x &&
      p.x < pf.x + pf.w &&
      wasAbove &&
      isBelow &&
      p.vy > 0
    ) {
      p.y = pf.y - 10;
      p.vy = 0;
      onGround = true;
    }
  }

  if (p.y > H - 10) {
    p.y = H - 10;
    p.vy = 0;
    onGround = true;
  }

  p.onGround = onGround;
}

// ===== AI移動 =====
function chase(p, target) {

  let dx = target.x - p.x;
  let dy = target.y - p.y;

  // 横移動
  let desired_v = dx * 0.05;
  if (desired_v > 3) desired_v = 3;
  if (desired_v < -3) desired_v = -3;

  p.vx += (desired_v - p.vx) * 0.2;

  // ▼ ここが重要 ▼

  // 相手が上にいるならジャンプ試行
  if (dy < -30 && p.onGround) {
    p.vy = -10;
  }

  // 相手が下にいるなら端から落ちる
  if (dy > 50) {
    // 横方向を強める（落ちやすくする）
    p.vx += 0.5 * Math.sign(dx);
  }
}
// ===== 描画 =====
function draw() {

  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = "gray";
  for (let pf of platforms) {
    ctx.fillRect(pf.x, pf.y, pf.w, 10);
  }

  ctx.fillStyle = "white";
  ctx.fillRect(p1.x - 10, p1.y - 10, 20, 20);

  ctx.fillStyle = "red";
  ctx.fillRect(p2.x - 10, p2.y - 10, 20, 20);
}

// ===== 更新 =====
function update() {

  chase(p1, p2);
  chase(p2, p1);

  applyPhysics(p1);
  applyPhysics(p2);

  draw();
}

function loop() {
  update();
  requestAnimationFrame(loop);
}

loop();
