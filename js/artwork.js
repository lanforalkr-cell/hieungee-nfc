/**
 * artwork.js - Canvas-based artwork generator for Korean name art
 * Creates Instagram-ready 1080x1080 images with traditional Korean design
 */

const ArtworkGenerator = (() => {
  const SIZE = 1080;

  /**
   * Draw traditional Korean cloud pattern
   */
  function drawCloudPattern(ctx, x, y, scale, color, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1 * scale;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.arc(0, 0, 12, Math.PI, 0);
    ctx.arc(15, 0, 10, Math.PI, 0);
    ctx.arc(28, 0, 8, Math.PI, 0);
    ctx.arc(14, -8, 18, 0.3, Math.PI - 0.3);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draw lotus petal pattern
   */
  function drawLotusPetal(ctx, x, y, angle, scale, color, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8 * scale;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.bezierCurveTo(12, -15, 12, 5, 0, 20);
    ctx.bezierCurveTo(-12, 5, -12, -15, 0, -20);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draw decorative border frame
   */
  function drawFrame(ctx, centerX, centerY, radius, color) {
    ctx.save();
    ctx.strokeStyle = color;

    // Outer circle
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner circle
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2);
    ctx.stroke();

    // Decorative dots
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    const dotCount = 36;
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;
      const dotX = centerX + Math.cos(angle) * (radius - 7);
      const dotY = centerY + Math.sin(angle) * (radius - 7);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Corner ornaments (4 lotus petals at cardinal points)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const px = centerX + Math.cos(angle) * (radius + 20);
      const py = centerY + Math.sin(angle) * (radius + 20);
      drawLotusPetal(ctx, px, py, angle + Math.PI / 2, 1.2, color, 0.3);
    }

    ctx.restore();
  }

  /**
   * Draw background patterns
   */
  function drawBackground(ctx) {
    // Gradient background
    const grad = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE * 0.7);
    grad.addColorStop(0, '#1a1018');
    grad.addColorStop(0.5, '#0f0a10');
    grad.addColorStop(1, '#0a0a0c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Scatter cloud patterns
    const goldColor = '#d4a853';
    const redColor = '#8b2525';

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * SIZE;
      const y = Math.random() * SIZE;
      const s = 0.8 + Math.random() * 1.5;
      drawCloudPattern(ctx, x, y, s, goldColor, 0.04 + Math.random() * 0.04);
    }

    // Scatter lotus petals
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * SIZE;
      const y = Math.random() * SIZE;
      const angle = Math.random() * Math.PI * 2;
      const s = 0.6 + Math.random() * 1.2;
      drawLotusPetal(ctx, x, y, angle, s, redColor, 0.03 + Math.random() * 0.03);
    }

    // Diamond lattice overlay (subtle)
    ctx.save();
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.025;
    const spacing = 80;
    for (let x = -SIZE; x < SIZE * 2; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + SIZE, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + SIZE, 0);
      ctx.lineTo(x, SIZE);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Generate the artwork
   * @param {HTMLCanvasElement} canvas
   * @param {string} hangulName - Korean name
   * @param {string} englishName - Original English name
   * @returns {string} Data URL of the image
   */
  function generate(canvas, hangulName, englishName) {
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');

    // 1. Draw background with patterns
    drawBackground(ctx);

    // 2. Draw central frame
    const centerX = SIZE / 2;
    const centerY = SIZE / 2 - 30;
    const frameRadius = 280;
    drawFrame(ctx, centerX, centerY, frameRadius, '#d4a853');

    // 3. Draw Hangul name (centered, large)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Determine font size based on name length
    let fontSize = 160;
    if (hangulName.length > 5) fontSize = 120;
    if (hangulName.length > 8) fontSize = 90;
    if (hangulName.length > 12) fontSize = 70;

    // Gold glow effect
    ctx.shadowColor = 'rgba(212, 168, 83, 0.5)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#f0d48a';
    ctx.font = `800 ${fontSize}px 'Nanum Myeongjo', serif`;
    ctx.fillText(hangulName, centerX, centerY - 10);

    // Sharper overlay
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#d4a853';
    ctx.fillText(hangulName, centerX, centerY - 10);
    ctx.restore();

    // 4. Draw English name (below Hangul)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#9a9490';
    ctx.font = '300 32px Outfit, sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText(englishName.toUpperCase(), centerX, centerY + fontSize / 2 + 40);
    ctx.restore();

    // 5. Draw "My Korean Name" label at top
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(212, 168, 83, 0.6)';
    ctx.font = '500 24px Outfit, sans-serif';
    ctx.fillText('My Korean Name', centerX, 80);
    ctx.restore();

    // 6. Decorative line under top label
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 168, 83, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 60, 105);
    ctx.lineTo(centerX + 60, 105);
    ctx.stroke();

    // Small diamond
    ctx.fillStyle = 'rgba(212, 168, 83, 0.4)';
    ctx.beginPath();
    ctx.moveTo(centerX, 100);
    ctx.lineTo(centerX + 5, 105);
    ctx.lineTo(centerX, 110);
    ctx.lineTo(centerX - 5, 105);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 7. Draw hashtags at bottom
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(154, 148, 144, 0.5)';
    ctx.font = '400 20px Outfit, sans-serif';
    ctx.fillText('#Lanforal  #Hangeul  #히응이  #MyKoreanName', centerX, SIZE - 100);
    ctx.restore();

    // 8. Watermark
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(154, 148, 144, 0.3)';
    ctx.font = '400 18px Outfit, sans-serif';
    ctx.fillText('lanforal.com', centerX, SIZE - 50);
    ctx.restore();

    // 9. Top-left & top-right decorative ㅎ symbols
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = '#d4a853';
    ctx.font = '800 200px "Nanum Myeongjo", serif';
    ctx.fillText('ㅎ', 30, 200);
    ctx.fillText('ㅎ', SIZE - 180, SIZE - 50);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }

  return { generate };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArtworkGenerator;
}
