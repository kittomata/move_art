// Art 9: Dynamic noise-based grid
let t9 = 0;
let noiseScale9 = 0.02;
let amp9 = 60;

// Reference to canvas and flag for capturing a preview thumbnail. This
// enables the index page to generate accurate thumbnails directly from
// the p5 sketch.
let canvas;
let previewCaptured = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  stroke(0, 255, 200, 150);
  noFill();
}

function draw() {
  background(0, 25);
  for (let x = 0; x <= width; x += 25) {
    let offsetTop = (noise(x * noiseScale9, t9) - 0.5) * amp9;
    let offsetBottom = (noise(x * noiseScale9, t9 + 100) - 0.5) * amp9;
    line(x + offsetTop, 0, x + offsetBottom, height);
  }
  for (let y = 0; y <= height; y += 25) {
    let offsetLeft = (noise(t9, y * noiseScale9) - 0.5) * amp9;
    let offsetRight = (noise(t9 + 100, y * noiseScale9) - 0.5) * amp9;
    line(0, y + offsetLeft, width, y + offsetRight);
  }
  t9 += 0.005;

  // Capture a preview image once after the first frame draws. Using a
  // timeout ensures the canvas has been rendered before reading it to a
  // data URL. After capturing the data URL we broadcast it to the index
  // page via postMessage so the gallery can update the thumbnail.
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
            // ignore postMessage failures
          }
        }
      }
    }, 100);
  }
}

function mousePressed() {
  noiseScale9 = random(0.005, 0.05);
}

function mouseDragged() {
  amp9 = map(mouseY, 0, height, 20, 120);
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
