// Art 4: Rotating spiral pattern with color changes and speed control
let t4 = 0;
let speed4 = 0.01;
let hue4 = 0;

// Reference to the p5 canvas and preview capture flag. These allow the
// index page to capture a thumbnail of the initial frame.
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
  // fade slowly
  fill(0, 15);
  noStroke();
  rect(0, 0, width, height);
  translate(width / 2, height / 2);
  beginShape();
  for (let a = 0; a < TWO_PI * 8; a += 0.05) {
    let r = a * 6;
    let x = r * cos(a + t4);
    let y = r * sin(a + t4);
    stroke((hue4 + a * 15) % 360, 80, 100, 80);
    vertex(x, y);
  }
  endShape();
  t4 += speed4;
  hue4 = (hue4 + 0.5) % 360;

  // Capture a preview once after the first frame is drawn. Provide a small
  // delay so the canvas has time to render. The result is stored on
  // window.previewImage for consumption by the index page.
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

function mousePressed() {
  // randomize hue palette
  hue4 = random(360);
}

function mouseDragged() {
  // control speed via horizontal drag
  speed4 = map(mouseX, 0, width, 0.005, 0.05);
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
