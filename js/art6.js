// Art 6: Animated fractal tree with adjustable branching and angle via input
let angle6 = 0.4;
let factor6 = 0.67;
let sway = 0;

// Reference to the canvas and a flag used to capture a static preview for the
// gallery thumbnails. These variables are defined globally so that both
// setup() and draw() can access them.
let canvas;
let previewCaptured = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  stroke(120, 60, 80);
  noFill();
}

function draw() {
  background(0, 20);
  sway += 0.01;
  angle6 = map(sin(sway), -1, 1, 0.2, 0.8);
  push();
  translate(width / 2, height);
  branch(height / 4);
  pop();

  // Capture the preview image once after rendering the first frame. Use a small
  // timeout to ensure the canvas has been drawn before conversion.
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

function branch(len) {
  strokeWeight(map(len, 0, height / 4, 1, 6));
  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > 6) {
    push();
    rotate(angle6);
    branch(len * factor6);
    pop();
    push();
    rotate(-angle6);
    branch(len * factor6);
    pop();
  }
}

function mousePressed() {
  // randomize branching factor
  factor6 = random(0.55, 0.75);
}

function mouseDragged() {
  // adjust sway amplitude via horizontal drag
  sway = map(mouseX, 0, width, 0, TWO_PI);
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
