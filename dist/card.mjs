export async function createCard(role, origin) {
  const image = new Image();
  const imageLoaded = new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error('The character art could not load. Please try again.')); });
  image.src = new URL('./characters.png', import.meta.url).href;
  await imageLoaded;
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1350;
  const c = canvas.getContext('2d');
  if (!c) throw new Error('Image saving is not supported here. You can still share your result link.');
  c.fillStyle = '#102d2c'; c.fillRect(0, 0, 1080, 1350);
  c.fillStyle = '#fff4d9'; c.fillRect(42, 42, 996, 1266);
  c.strokeStyle = '#132e2c'; c.lineWidth = 3; c.strokeRect(60, 60, 960, 1230);
  c.textBaseline = 'top'; c.fillStyle = '#132e2c';
  c.font = 'bold 25px monospace'; c.fillText('SIDE QUEST ME', 92, 90);
  c.textAlign = 'right'; c.fillText('LV. 01 NPC', 988, 90); c.textAlign = 'left';
  c.fillRect(92, 135, 896, 2);
  function textBlock(text, x, y, width, font, lineHeight, align = 'left') {
    c.font = font; c.textAlign = align;
    const lines = []; let line = '';
    for (const word of text.split(' ')) { const trial = line ? line + ' ' + word : word; if (line && c.measureText(trial).width > width) { lines.push(line); line = word; } else line = trial; }
    if (line) lines.push(line);
    lines.forEach((line, i) => c.fillText(line, x, y + i * lineHeight)); c.textAlign = 'left';
    return y + lines.length * lineHeight;
  }
  let y = textBlock(role.title, 92, 169, 896, 'bold 65px Georgia', 73);
  c.fillStyle = '#566351'; y = textBlock(role.job, 92, y + 12, 896, '29px "Trebuchet MS", sans-serif', 37);
  const artY = y + 23; const artSize = 360; const artX = 360;
  c.imageSmoothingEnabled = false;
  c.drawImage(image, (role.art % 4) * image.naturalWidth / 4, Math.floor(role.art / 4) * image.naturalHeight / 2, image.naturalWidth / 4, image.naturalHeight / 2, artX, artY, artSize, artSize);
  c.strokeStyle = '#132e2c'; c.strokeRect(artX, artY, artSize, artSize);
  c.font = 'bold 24px monospace'; const badgeWidth = c.measureText(role.badge).width + 36;
  c.fillStyle = role.color; c.fillRect((1080 - badgeWidth) / 2, artY + artSize - 4, badgeWidth, 42);
  c.fillStyle = '#132e2c'; c.textAlign = 'center'; c.fillText(role.badge, 540, artY + artSize + 4); c.textAlign = 'left';
  y = textBlock(role.line, 92, artY + artSize + 64, 896, '33px "Trebuchet MS", sans-serif', 44);
  c.font = '24px monospace'; c.fillStyle = '#566351'; c.fillText(role.talents.join('   /   '), 92, y + 18);
  y += 70;
  c.fillStyle = '#132e2c'; c.fillRect(92, y, 896, 180);
  c.fillStyle = '#f7cf54'; c.font = 'bold 25px monospace'; c.fillText('YOUR TINY QUEST', 122, y + 22);
  c.fillStyle = '#fff4d9'; textBlock(role.quest, 122, y + 67, 836, '31px "Trebuchet MS", sans-serif', 41);
  c.fillStyle = '#132e2c'; textBlock(role.quote, 540, y + 212, 896, 'italic 30px Georgia', 39, 'center');
  c.fillStyle = '#566351'; c.font = '22px monospace'; c.textAlign = 'center';
  const hostname = new URL(origin).hostname;
  c.fillText(hostname, 540, 1217); c.font = '21px "Trebuchet MS", sans-serif'; c.fillText('Fantasy roleplay, just for fun. Find your village self.', 540, 1250);
  const blob = await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not create the image. Please try again.')), 'image/png'));
  return { blob, canvas };
}
