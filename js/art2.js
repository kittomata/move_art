// Art 2: Bouncing bubbles that spawn on click and repel from drag
let bubbles = [];
// Reference to the p5 canvas and preview capture flag for generating
// thumbnails of the artwork. These allow the index page to extract a
// screenshot of the initial state without extra assets.
let canvas;
let previewCaptured = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 40; i++) {
    bubbles.push(new Bubble(random(width), random(height), random(15, 40)));
  }
  background(0);
}

function draw() {
  fill(0, 20);
  noStroke();
  rect(0, 0, width, height);
  for (let b of bubbles) {
    b.update();
    b.display();
  }

  // Capture a preview image once after the first frame has been drawn. This
  // data URL will be read by the index page to build live thumbnails.
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
          } catch (e) {}
        }
      }
    }, 100);
  }
}

class Bubble {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 3));
    this.r = r;
  }
  applyForce(f) {
    this.vel.add(f);
  }
  update() {
    this.pos.add(this.vel);
    // bounce off edges
    if (this.pos.x < this.r || this.pos.x > width - this.r) this.vel.x *= -1;
    if (this.pos.y < this.r || this.pos.y > height - this.r) this.vel.y *= -1;
    // slow down slightly
    this.vel.mult(0.99);
  }
  display() {
    noFill();
    stroke(255, 180);
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

function mousePressed() {
  // spawn a bubble at click
  bubbles.push(new Bubble(mouseX, mouseY, random(20, 50)));
}

function mouseDragged() {
  const origin = createVector(mouseX, mouseY);
  for (let b of bubbles) {
    let dir = p5.Vector.sub(b.pos, origin);
    let d = dir.mag();
    if (d < 150) {
      dir.setMag((150 - d) / 150 * 0.5);
      b.applyForce(dir);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
