// Art 1: Random Walkers with attraction on drag and reset on click
let walkers = [];
// Reference to the p5 canvas. Assign in setup() so we can capture a preview.
let canvas;
// Flag to ensure we only capture one preview per page load.
let previewCaptured = false;

function setup() {
  // store the canvas so that we can capture a thumbnail later
  canvas = createCanvas(windowWidth, windowHeight);
  // create many walker particles
  for (let i = 0; i < 250; i++) {
    walkers.push(new Walker(random(width), random(height)));
  }
  background(0);
}

function draw() {
  // fade background slightly for trailing effect
  fill(0, 20);
  noStroke();
  rect(0, 0, width, height);
  // update and display walkers
  for (let w of walkers) {
    w.update();
    w.display();
  }

  // Capture a preview image once the first frame has been drawn. The timeout
  // gives the browser time to render the canvas before we read it. The
  // preview is stored on window.previewImage and will be picked up by the
  // index page.
  if (!previewCaptured) {
    previewCaptured = true;
    setTimeout(() => {
      const c = document.querySelector('canvas');
      if (c) {
        window.previewImage = c.toDataURL('image/png');
        // send the preview to the parent window so the index page can use it
        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage({
              type: 'preview',
              url: window.location.pathname,
              data: window.previewImage
            }, '*');
          } catch (e) {
            // ignore messaging errors
          }
        }
      }
    }, 100);
  }
}

function Walker(x, y) {
  this.pos = createVector(x, y);
  this.vel = p5.Vector.random2D().mult(random(0.5, 2));
  this.update = function() {
    // if dragging, attract towards mouse
    if (mouseIsPressed) {
      const target = createVector(mouseX, mouseY);
      const force = p5.Vector.sub(target, this.pos);
      force.setMag(0.1);
      this.vel.add(force);
    } else {
      // slight random jitter
      this.vel.add(p5.Vector.random2D().mult(0.05));
    }
    this.vel.limit(4);
    this.pos.add(this.vel);
    // wrap around edges
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  };
  this.display = function() {
    stroke(200, 200, 255, 180);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  };
}

function mousePressed() {
  // on click, reset walker positions randomly
  for (let w of walkers) {
    w.pos.set(random(width), random(height));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// fullscreen toggle handler
// Setup fullscreen toggling and UI hiding on art pages. When the page enters
// fullscreen the back link and fullscreen button are hidden so only the
// artwork remains. When exiting fullscreen the controls reappear.  This
// improves the viewing experience when the user chooses to maximise the
// canvas.
window.addEventListener('DOMContentLoaded', () => {
  const fsBtn = document.getElementById('fullscreen-btn');
  const backLink = document.getElementById('back-link');
  if (fsBtn) {
    // toggle fullscreen on click
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
    // hide UI when entering fullscreen and restore on exit
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
