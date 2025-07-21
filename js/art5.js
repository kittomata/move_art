// Art 5: Sinusoidal waves across the canvas with controllable amplitude and frequency
let phase5 = 0;
let amp5 = 80;
let freq5 = 0.02;

// Reference to the p5 canvas and a flag for capturing preview thumbnails.
let canvas;
let previewCaptured = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  stroke(180, 200, 255);
  noFill();
  background(0);
}

function draw() {
  background(0, 30);
  stroke(180, 200, 255, 180);
  for (let y = 40; y <= height - 40; y += 35) {
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let offset = sin(phase5 + x * freq5 + y * 0.05) * amp5 * (1 - y / height);
      vertex(x, y + offset);
    }
    endShape();
  }
  phase5 += 0.03;

  // Capture a preview once after the first frame. Use a timeout to ensure
  // rendering is complete before extracting the data URL.
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
  // toggle amplitude between 0 and initial
  if (amp5 > 0) {
    amp5 = 0;
  } else {
    amp5 = 80;
  }
}

function mouseDragged() {
  // modify frequency via vertical drag
  freq5 = map(mouseY, 0, height, 0.005, 0.05);
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
