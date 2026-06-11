(function () {
  // ── Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    #flower-container {
      position: fixed;
      bottom: 1vw;
      left: 1vw;
      width: clamp(100px, 18vw, 260px);
      height: clamp(100px, 18vw, 260px);
      pointer-events: none;
      z-index: 50;
      overflow: visible;
    }
    #flower-container img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      mix-blend-mode: multiply;
      will-change: transform;
    }
  `;
  document.head.appendChild(style);

  // ── Inject fragment images
  const srcs = [
    'h_0000_fp1.png','h_0001_fp2.png','h_0002_fp3.png','h_0003_fp4.png',
    'h_0004_fp5.png','h_0005_fp6.png','h_0006_fp7.png','h_0007_fp8.png',
    'h_0008_fp9.png','h_0009_fp10.png','h_0010_fp11.png','h_0011_fp12.png',
    'h_0012_fp13.png','h_0013_fp14.png','h_0014_fp15.png','h_0015_fp16.png',
    'h_0016_fp17.png','h_0017_fp18.png','h_0018_fp19.png','h_0019_fp20.png',
    'h_0020_fp21.png','h_0021_fp22.png','h_0022_fp23.png','h_0023_fp24.png',
    'h_0024_fp25.png','h_0025_fp26.png','h_0026_fp27.png','h_0027_fp28.png',
    'h_0028_fp29.png','h_0029_fp30.png','h_0030_fp31.png','h_0031_fp32.png',
    'h_0032_fp33.png','h_0033_fp34.png','h_0034_fp35.png','h_0035_fp36.png',
    'h_0036_fp37.png','h_0037_fp38.png','h_0038_fp39.png','h_0039_fp40.png',
    'h_0040_fp41.png','h_0041_fp42.png','h_0042_fp43.png','h_0043_fp44.png',
    'h_0044_fp45.png','h_0045_fp46.png','h_0046_fp47.png','h_0047_fp48.png',
    'h_0048_fp49.png','h_0049_fp50.png','h_0050_fp51.png','h_0051_fp52.png',
    'h_0052_fp53.png','h_0053_fp54.png','h_0054_fp55.png','h_0055_fp56.png',
    'h_0056_fp57.png','h_0057_fp58.png','h_0058_fp59.png','h_0059_fp60.png',
    'h_0060_fp61.png','h_0061_fp62.png','h_0062_fp63.png','h_0063_fp64.png',
    'h_0064_fp65.png','h_0065_fp66.png','h_0066_fp67.png','h_0067_fp68.png',
    'h_0068_fp69.png','h_0069_fp70.png','h_0070_fp71.png','h_0071_fp72.png',
    'h_0072_fp73.png','h_0073_fp74.png','h_0074_fp75.png','h_0075_fp76.png',
    'h_0076_fp77.png','h_0077_fp78.png','h_0078_fp79.png','h_0079_fp80.png',
    'h_0080_fp81.png','h_0081_fp82.png','h_0082_fp83.png','h_0083_fp84.png',
    'h_0084_fp85.png','h_0085_fp86.png','h_0086_fp87.png','h_0087_fp88.png',
    'h_0088_fp89.png','h_0089_fp90.png','h_0090_fp91.png','h_0091_fp92.png',
    'h_0092_fp93.png','h_0093_fp94.png','h_0094_fp95.png','h_0095_fp96.png',
    'h_0096_fp97.png','h_0097_fp98.png'
  ];

  const container = document.createElement('div');
  container.id = 'flower-container';
  srcs.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    container.appendChild(img);
  });
  document.body.appendChild(container);

  // ── Animation
  const imgs = Array.from(container.querySelectorAll('img'));
  const LINGER_COUNT = 7; // exactly this many pieces stay visible at the end

  // Pick lingerers randomly
  const indices = imgs.map((_, i) => i).sort(() => Math.random() - 0.5);
  const lingerSet = new Set(indices.slice(0, LINGER_COUNT));

  const pieces = imgs.map((_, i) => {
    const delay = Math.random() * 0.4;
    const isLinger = lingerSet.has(i);
    return {
      spreadX:      isLinger ? (Math.random() - 0.5) * 120  : (Math.random() - 0.5) * 600,
      spreadY:      isLinger ? -20 - Math.random() * 80      : -800 - Math.random() * 600,
      rotate:       isLinger ? (Math.random() - 0.5) * 45    : (Math.random() - 0.5) * 720,
      finalOpacity: isLinger ? 0.85 + Math.random() * 0.15   : 0,
      delay,
      speed: 1 / (1 - delay)
    };
  });

  let rafPending = false;

  function applyTransforms() {
    const scrollTop      = window.scrollY;
    const maxScroll      = document.body.scrollHeight - window.innerHeight;
    const globalProgress = Math.min(scrollTop / maxScroll, 1);

    imgs.forEach((img, i) => {
      const p = pieces[i];
      const localProgress = Math.min(Math.max((globalProgress - p.delay) * p.speed, 0), 1);
      const eased = 1 - Math.pow(1 - localProgress, 2); // ease-out
      img.style.transform = 'translate(' + (p.spreadX * eased) + 'px, ' + (p.spreadY * eased) + 'px) rotate(' + (p.rotate * eased) + 'deg)';
      img.style.opacity = String(1 - eased * (1 - p.finalOpacity));
    });

    rafPending = false;
  }

  function onScroll() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(applyTransforms);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  applyTransforms();
})();
