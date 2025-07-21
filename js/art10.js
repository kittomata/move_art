// Art 10: Organic perlin-noise based rotating shape
let rot10 = 0;
let rotSpeed10 = 0.015;
let zoff10 = 0;

// Reference to the p5 canvas and preview capture flag for generating
// thumbnails of this organic shape. The canvas is stored in setup() and
// a preview is captured once during draw().
let canvas;
let previewCaptured = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  strokeWeight(2);
  noFill();
  background(0);
}

function draw() {
  background(0, 20);
  translate(width / 2, height / 2);
  rotate(rot10);
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.02) {
    let r = 180 + noise(cos(a) + 1, sin(a) + 2, zoff10) * 80;
    let x = r * cos(a);
    let y = r * sin(a);
    let hue = (a / TWO_PI * 360 + rot10 * 50) % 360;
    stroke(hue, 80, 100, 80);
    vertex(x, y);
  }
  endShape(CLOSE);
  rot10 += rotSpeed10;
  zoff10 += 0.01;

  // Capture the preview once after the first frame has been drawn. Use a
  // timeout to ensure the canvas is rendered before conversion to a data URL.
  // After capturing the image we send it to the parent window so the
  // thumbnail on the index page can update accordingly.
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
            // ignore errors
          }
        }
      }
    }, 100);
  }
}

function mousePressed() {
  noiseSeed(floor(random(10000)));
}

function mouseDragged() {
  rotSpeed10 = map(mouseX, 0, width, 0.01, 0.1);
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
