document.body.style.background = "black";
alert("BASE_TEMPLATE_V1");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = 400;
const H = 600;

let gravity = 0.5;
let jumpPower = 10;
let maxSpeed = 3;

// =====================
// ① プレイヤー定義
// =====================
let p1 = { x:100, y:100, vx:0, vy:0, prevY:100, onGround:false };
let p2 = { x:300, y:100, vx:0, vy:0, prevY:100, onGround:false };

// =====================
// ② 足場生成
// =====================
let platforms = [];

function generatePlatforms() {
  platforms = [];
  for (let i = 0; i < 5; i++) {
    platforms.push({
      id: i,
      x: Math.random() * 300,
      y: 150 + i * 90,
      w: 100
    });
  }
}
generatePlatforms();

// =====================
// ③ 物理
// =====================
function applyPhysics(p) {

  p.prevY = p.y;

  p.vy += gravity;

  p.x += p.vx;
  p.y += p.vy;

  // 壁
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
      p.currentPlatform = pf.id;
    }
  }

  if (p.y > H - 10) {
    p.y = H - 10;
    p.vy = 0;
    onGround = true;
    p.currentPlatform = -1;
  }

  p.onGround = onGround;
}

// =====================
// ④ 視界認識
// =====================
function getVisiblePlatforms(p) {

  let visible = [];

  for (let pf of platforms) {
    let dx = pf.x - p.x;
    let dy = pf.y - p.y;

    if (Math.abs(dx) < 150 && Math.abs(dy) < 200) {
      visible.push(pf);
    }
  }

  return visible;
}

// =====================
// ⑤ 到達可能判定
// =====================
function canReach(p, pf) {

  let dx = pf.x - p.x;
  let dy = pf.y - p.y;

  let maxHeight = (jumpPower * jumpPower) / (2 * gravity);

  if (dy < 0 && Math.abs(dy) > maxHeight) {
    return false;
  }

  let airTime = (2 * jumpPower) / gravity;
  let maxHorizontal = maxSpeed * airTime;

  if (Math.abs(dx) > maxHorizontal) {
    return false;
  }

  return true;
}

// =====================
// ⑥ AI
// =====================
function chase(p, target) {

  let dx = target.x - p.x;
  let dy = target.y - p.y;

  let desired_v = dx * 0.05;

  if (desired_v > maxSpeed) desired_v = maxSpeed;
  if (desired_v < -maxSpeed) desired_v = -maxSpeed;

  p.vx += (desired_v - p.vx) * 0.2;

  if (dy < -30 && p.onGround) {
    p.vy = -jumpPower;
  }
}

// =====================
// ⑦ 描画
// =====================
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

// =====================
// ⑧ 更新
// =====================
function update() {

  chase(p1, p2);
  chase(p2, p1);

  applyPhysics(p1);
  applyPhysics(p2);

  draw();
}

// =====================
// ⑨ ループ
// =====================
function loop() {
  update();
  requestAnimationFrame(loop);
}

loop();  p.vy += gravity;

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

// ===== 上に足場ある？ =====
function hasPlatformAbove(p) {
  for (let pf of platforms) {
    if (
      pf.y < p.y &&
      pf.y > p.y - 120 &&
      p.x > pf.x - 20 &&
      p.x < pf.x + pf.w + 20
    ) {
      return true;
    }
  }
  return false;
}

// ===== AI =====
function chase(p, target) {

  let dx = target.x - p.x;
  let dy = target.y - p.y;

  // 横移動
  let desired_v = dx * 0.05;
  if (desired_v > 3) desired_v = 3;
  if (desired_v < -3) desired_v = -3;

  p.vx += (desired_v - p.vx) * 0.2;

  // 上にいるなら
  if (dy < -30 && p.onGround && hasPlatformAbove(p)) {
    p.vy = -10;
  }

  // 下にいるなら落ちようとする
  if (dy > 50) {
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
