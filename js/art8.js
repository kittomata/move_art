// Art 8: Particle explosions with wind effect from drag
let explosions8 = [];
let wind8 = 0;

// Reference to the canvas and preview capture flag used for creating
// thumbnails. Each art page captures its own preview into window.previewImage
// during the first frame.
let canvas;
let previewCaptured = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
}

function draw() {
  background(0, 20);
  // randomly spawn small bursts
  if (frameCount % 80 === 0) {
    spawnExplosion(random(width), random(height), 80, 2);
  }
  for (let i = explosions8.length - 1; i >= 0; i--) {
    const ex = explosions8[i];
    ex.update();
    ex.show();
    if (ex.isDone()) {
      explosions8.splice(i, 1);
    }
  }

  // Capture a preview once after the first frame has drawn. Delay slightly
  // to allow the canvas to render before reading it to a data URL. The
  // resulting data URL is saved on window.previewImage and posted to the
  // parent window (index page) so that the thumbnail can be updated.
  if (!previewCaptured) {
    previewCaptured = true;
    setTimeout(() => {
      const c = document.querySelector('canvas');
      if (c) {
        window.previewImage = c.toDataURL('image/png');
        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage({
              type: 'preview',
              url: window.location.pathname,
              data: window.previewImage
            }, '*');
          } catch (e) {
            // swallow messaging errors
          }
        }
      }
    }, 100);
  }
}

function spawnExplosion(x, y, count, speed) {
  explosions8.push(new Explosion(createVector(x, y), count, speed));
}

class Explosion {
  constructor(pos, count, speed) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(new ParticleEx(pos.copy(), speed));
    }
  }
  update() {
    for (let p of this.particles) {
      p.applyForce(createVector(wind8, 0));
      p.update();
    }
  }
  show() {
    for (let p of this.particles) {
      p.show();
    }
  }
  isDone() {
    return this.particles.every(p => p.lifespan <= 0);
  }
}

class ParticleEx {
  constructor(pos, speed) {
    this.pos = pos.copy();
    const angle = random(TWO_PI);
    this.vel = p5.Vector.fromAngle(angle).mult(random(0.5, speed));
    this.acc = createVector(0, 0);
    this.lifespan = 255;
    this.hue = random(360);
  }
  applyForce(f) {
    this.acc.add(f);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 4;
  }
  show() {
    noStroke();
    fill(this.hue, 80, 100, this.lifespan / 255 * 100);
    ellipse(this.pos.x, this.pos.y, 6, 6);
  }
}

function mousePressed() {
  spawnExplosion(mouseX, mouseY, 150, 3);
}

function mouseDragged() {
  wind8 = map(mouseX, 0, width, -0.3, 0.3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

// fullscreen toggle handler
// Setup fullscreen toggling and UI hiding on art pages. When the page enters
// fullscreen the back link and fullscreen button are hidden so only the
// artwork remains. When exiting fullscreen the controls reappear.
window.addEventListener('DOMContentLoaded', () => {
  const fsBtn = document.getElementById('fullscreen-btn');
  const backLink = document.getElementById('back-link');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        fsBtn.style.display = 'none';
        if (backLink) backLink.style.display = 'none';
      } else {
        fsBtn.style.display = 'block';
        if (backLink) backLink.style.display = 'block';
      }
    });
  }
});
