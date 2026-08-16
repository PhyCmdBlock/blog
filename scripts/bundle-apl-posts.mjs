import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const postsDir = path.resolve('content/posts');
const entries = Array.from({ length: 10 }, (_, index) => index + 1);

const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[character]));

function makeCover(description) {
  const title = '神剑高程之';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <rect width="1200" height="600" fill="#ffffff"/>
  <g font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" fill="#111111" text-anchor="middle">
    <text x="600" y="250" font-size="106" font-weight="600">${escapeXml(title)}</text>
    <text x="600" y="415" font-size="74" font-weight="500">${escapeXml(description)}</text>
  </g>
</svg>`;
}

for (const number of entries) {
  const sourcePath = path.join(postsDir, `APL-${number}.md`);
  const bundleDir = path.join(postsDir, `APL-${number}`);
  const indexPath = path.join(bundleDir, 'index.md');
  const coverPath = path.join(bundleDir, 'cover.png');
  const markdownPath = await fs.access(indexPath).then(() => indexPath).catch(() => sourcePath);
  const source = await fs.readFile(markdownPath, 'utf8');
  const description = source.match(/^description:\s*(.+)\s*$/m)?.[1]?.trim();

  if (!description) throw new Error(`Missing description in ${sourcePath}`);
  await fs.mkdir(bundleDir, { recursive: true });
  if (markdownPath === sourcePath) await fs.rename(sourcePath, indexPath);
  const bundled = source.replace(/^cover:\s*.*$/m, `cover: /posts/apl-${number}/cover.png`);
  await fs.writeFile(indexPath, bundled, 'utf8');
  await sharp(Buffer.from(makeCover(description))).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(coverPath);
  console.log(`Bundled APL-${number}: ${description}`);
}
