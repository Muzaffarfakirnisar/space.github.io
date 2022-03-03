let canvas = document.getElementById('canvas');
let l = document.getElementById('l');
let r = document.querySelector('#r');
let n = document.getElementById('n');
let b = document.getElementById('b');
let po = document.getElementById('po');
let score = 0;


let c = canvas.getContext('2d');
let h = innerHeight;
let w = innerWidth;
canvas.width = w;
canvas.height = h;
// pos
let mo = {
  x: undefined,
  y: undefined
}
//bg
function background() {
  c.drawImage(bg,0,0,w,h);
}
// img 
let s = new Image();
let bg = new Image();
let e = new Image();
bg.src = 'bg.jpg';

e.src = 'e.png';
s.src = 's.png';
// audio
var over = new Audio();
var shott = new Audio();
shott.src = 'shot.wav';
over.src = "o.wav";

// player
class Player {
  constructor() {
    this.pos = {
      x: 0,
      y: 0
    }
    this.vel = {
      x: 0,
      y: 0
    }
    this.w = 44
    this.h = 44
    this.fx = 0;
    this.count = 0;
    this.scale = 1;
  }
  draw() {
    c.beginPath();
    //c.fillRect(this.pos.x, this.pos.y, this.w, this.h);
    c.drawImage(s, this.fx * this.w, 0, this.w, this.h, this.pos.x, this.pos.y, this.w * this.scale, this.h);
    this.count++;
    if (this.count > 10) {
      this.fx++;
      this.count = 0;
    }
    if (this.fx > 9) {
      this.fx = 0
    }
    c.stroke();

  }
  update() {
    this.draw();
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    if (this.pos.y + this.h + this.vel.y <= h) {
      this.vel.y += 0.5;
    }
    else {
      this.vel.y = 0
    }

    if (this.pos.x + this.w + this.vel.x <= w) {
      this.vel.x -= 0;
    }
    else {
      this.vel.x = 0;
    }
    if (this.pos.x >= 0) {
      this.vel.x -= 0;
    }
    else {
      this.vel.x = 0;
    }
  }
};


class Bullet {
  constructor({ pos, vel }) {
    this.pos = pos
    this.r = 6;
    this.vel = vel

  }
  draw() {
    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = 'red'
    c.fill();
    c.stroke();
  };
  update() {
    this.draw();
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y

  };

}
//enemy
let particles = [];

class Enemy {
  constructor({ pos }) {
    this.pos = {
      x: Math.random() * 321,
      y: 10
    }
    this.vel = {
      x: 0,
      y: 0
    }
    this.w = 47.9
    this.h = 44
    this.fx = 0;
    this.count = 0;
    this.scale = 1;
  }
  draw() {
    c.beginPath();
    //c.fillRect(this.pos.x, this.pos.y, this.w, this.h);
    c.drawImage(e, this.fx * this.w, 0, this.w, this.h, this.pos.x, this.pos.y, this.w * this.scale, this.h);
    this.count++;
    if (this.count > 11) {
      this.fx++;
      this.count = 0;
    }
    if (this.fx > 11) {
      this.fx = 0
    }
    c.stroke();

  }
  update() {
    this.draw();
    this.pos.y += this.vel.y;
    this.pos.x += this.vel.x;
    this.pos.y += 0.6;


  }
}
//particles
class Particle {
  constructor({ pos, vel, r, color, fade }) {
    this.pos = pos
    this.vel = vel;
    this.r = r;
    this.opacity = 1;
    this.fade = fade;
  }
  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
  }
  update() {
    this.draw();
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    if (this.fade) {
      this.opacity -= 0.01
    }
  }
}
for (var i = 0; i < 100; i++) {
  particles.push(new Particle(
  {
    pos: {
      x: Math.random() * w,
      y: Math.random() * h
    },
    vel: {
      x: 0,
      y: 1
    },
    r: Math.random() * 3,
    color: 'white'

  }));
}

function enemy() {
  setInterval(() => {
    en.push(new Enemy({
      pos: {
        x: Math.random() * 300,
        y: Math.random() * 14
      }
    }));

  }, 2000);


}
let en = [];
let p = new Player();
let ag = [];
let ani;

function animate() {
  ani = requestAnimationFrame(animate);
  c.clearRect(0, 0, w, h)
  background();
  p.update();
  ag.forEach((ag) => {
    ag.update();
  });
  particles.forEach((particles) => {
    particles.update();
  });
  en.forEach((ene, i) => {
    ene.update();
    ag.forEach((ags, gi) => {
      if (ags.pos.y - ags.r <= ene.pos.y + ene.h && ags.pos.x + ags.r >= ene.pos.x && ags.pos.x - ags.r <= ene.pos.x + ene.w) {
        ag.splice(gi, 1);
        en.splice(i, 1);
        shott.play();

        score += 10;

      }
    });

    if (p.pos.y + p.h <= ene.pos.y + ene.h) {
      cancelAnimationFrame(ani);
      po.innerHTML = score;
      n.style.display = 'flex';
      over.play();

    }
  });
}

// add 
l.addEventListener('click', left);

function left() {
  p.vel.x -= 1.2;
}

r.addEventListener('click', right);

function right() {
  p.vel.x += 1.2;
}
window.addEventListener('touchstart', shot);

function shot() {
  ag.push(new Bullet({
    pos: {
      x: p.pos.x + p.w / 2,
      y: p.pos.y
    },
    vel: {
      x: 0,
      y: -1.6
    }
  }));
}

function init() {
  p = new Player();
  en = [];
  ag = [];
  score = 0;
  particles = [];
  po.innerHTML = score;
  ani

}
b.addEventListener('mousemove', (e) => {
  init();
  enemy();
  animate();


  n.style.display = 'none';
});
