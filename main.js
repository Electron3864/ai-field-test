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

  let G_target = gainTarget(lastTouchX);
  let G_wall = wallPotential(x);

  let G_total = G_target + G_wall;

  vx += G_total;
  vx *= inertia;
  x += vx;

  if (x < 10) {
    x = 10;
    vx = 0;
  }
  if (x > 390) {
    x = 390;
    vx = 0;
  }

  draw(G_target, G_wall, G_total);
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

let k_target = 0.01;
let k_wall = 2000;
let inertia = 0.9;

window.addEventListener("keydown", e => {
  if (e.key === "1") k_target += 0.005;
  if (e.key === "2") k_target -= 0.005;
  if (e.key === "3") inertia += 0.02;
  if (e.key === "4") inertia -= 0.02;
});
