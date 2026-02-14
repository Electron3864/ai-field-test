const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let x = 200;
let y = 500;

let vx = 0;
let inertia = 0.9;

let k_target = 0.01;     // 目標への利得係数
let k_wall = 2000;       // 壁ポテンシャル強度
let lastTouchX = 200;

function gainTarget(tx) {
  return k_target * (tx - x);
}

function wallPotential(px) {
  // 左壁
  let left = k_wall / Math.max(1, px - 10);
  // 右壁
  let right = -k_wall / Math.max(1, 390 - px);
  return left + right;
}

function update() {
function update() {

  let diff = lastTouchX - x;

  // 一定速度を目標にする
  let desired_v = 3 * Math.sign(diff);

  // 速度を滑らかに近づける
  vx += (desired_v - vx) * 0.2;

  x += vx;

  // 壁制限
  if (x < 10) {
    x = 10;
    vx = 0;
  }
  if (x > 390) {
    x = 390;
    vx = 0;
  }

  draw(0,0,0);
}

function draw(Gt, Gw, Gtotal) {
  ctx.clearRect(0, 0, 400, 600);

  // キャラ
  ctx.fillStyle = "white";
  ctx.fillRect(x - 10, y - 10, 20, 20);

  // デバッグ表示
  ctx.fillStyle = "lime";
  ctx.font = "14px monospace";
  ctx.fillText("G_target: " + Gt.toFixed(2), 10, 20);
  ctx.fillText("G_wall:   " + Gw.toFixed(2), 10, 40);
  ctx.fillText("G_total:  " + Gtotal.toFixed(2), 10, 60);
  ctx.fillText("vx:       " + vx.toFixed(2), 10, 80);
}

canvas.addEventListener("touchmove", e => {
  let rect = canvas.getBoundingClientRect();
  lastTouchX = e.touches[0].clientX - rect.left;
});

function loop() {
  update();
  requestAnimationFrame(loop);
}

loop();

canvas.addEventListener("touchstart", e => {
  let rect = canvas.getBoundingClientRect();
  let tx = e.touches[0].clientX - rect.left;
  let ty = e.touches[0].clientY - rect.top;

  // 画面上部をタップしたらパラメータ変更
  if (ty < 100) {
    k_target += 0.005;
  }

  // 画面下部をタップしたら慣性変更
  if (ty > 500) {
    inertia -= 0.05;
  }
});
