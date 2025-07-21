// Art 7: Lissajous curves animated with adjustable amplitude and random frequency ratios
let t7 = 0;
let a7 = 2;
let b7 = 3;
let ampX7;
let ampY7;

// Reference to the p5 canvas and preview capture flag. Allows a single
// thumbnail capture of the Lissajous curve for the gallery.
let canvas;
let previewCaptured = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  ampX7 = width / 3;
  ampY7 = height / 3;
  strokeWeight(1.5);
  noFill();
  background(0);
}

function draw() {
  background(0, 20);
  translate(width / 2, height / 2);
  beginShape();
  for (let i = 0; i < 600; i++) {
    let x = ampX7 * sin(a7 * (t7 + i * 0.002));
    let y = ampY7 * sin(b7 * (t7 + i * 0.002) + HALF_PI);
    let hue = (i / 600.0 * 360 + t7 * 100) % 360;
    stroke(hue, 80, 100, 80);
    vertex(x, y);
  }
  endShape();
  t7 += 0.01;

  // Capture preview once after first frame. Delay to allow rendering.
  if (!previewCaptured) {
    previewCaptured = true;
    setTimeout(() => {
      const c = document.querySelector('canvas');
      if (c) {
        // save preview image as a data URL
        window.previewImage = c.toDataURL('image/png');
        // send the preview to the parent window (index page) if present
        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage({
              type: 'preview',
              url: window.location.pathname,
              data: window.previewImage
            }, '*');
          } catch (e) {
            // ignore cross-origin or other messaging errors
          }
        }
      }
    }, 100);
  }
}

function mousePressed() {
  a7 = int(random(1, 6));
  b7 = int(random(1, 6));
}

function mouseDragged() {
  ampX7 = map(mouseX, 0, width, 50, width / 2);
  ampY7 = map(mouseY, 0, height, 50, height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ampX7 = width / 3;
  ampY7 = height / 3;
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
