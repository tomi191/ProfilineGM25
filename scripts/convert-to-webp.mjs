/**
 * Convert AI photos to optimized WebP with clean names
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, unlinkSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC = 'public/images/ai';
const OUT = 'public/images/ai-webp';

// Map: source filename → clean output name
const FILE_MAP = {
  'hero-cinematic.png':                               'hero-cinematic',
  'studio-top.png':                                   'studio-top',
  'in-action-detail.png':                             'in-action-detail',
  'lifestyle-workshop.png':                           'lifestyle-workshop',
  'motor-internals.png':                              'motor-internals',
  'with-box-front-v2.png':                            'with-box-front',
  'with-box-rear-v2.png':                             'with-box-rear',
  '1773339366945-egusggleiqi.jpeg':                   'in-action-polishing',
  'd912e325df1005302fcbbc5a69ac1d371155008.png':      'studio-top-alt',
  '7de2810a583b8eab1e3d52f5f3da57b11217265.png':     'studio-side',
  'f3e75605c22cd7e272c38e79008a065d1713325.png':      'flat-lay',
};

// Max dimensions for web
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

async function convert(srcFile, outName) {
  const input = join(SRC, srcFile);
  const output = join(OUT, `${outName}.webp`);

  const meta = await sharp(input).metadata();
  const needsResize = meta.width > MAX_WIDTH || meta.height > MAX_HEIGHT;

  let pipeline = sharp(input);
  if (needsResize) {
    pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true });
  }

  await pipeline.webp({ quality: 82, effort: 6 }).toFile(output);

  const srcSize = statSync(input).size;
  const outSize = statSync(output).size;
  const pct = ((1 - outSize / srcSize) * 100).toFixed(0);
  console.log(`✓ ${outName}.webp  ${(outSize / 1024).toFixed(0)}KB  (${pct}% smaller)`);
}

async function main() {
  console.log('=== Converting to WebP ===\n');

  for (const [src, name] of Object.entries(FILE_MAP)) {
    try {
      await convert(src, name);
    } catch (err) {
      console.error(`✗ ${src}: ${err.message}`);
    }
  }

  console.log('\n✓ Done! Output: ' + OUT);
}

main().catch(console.error);
