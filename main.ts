// gta6-clipper-01 entry (Node 22, standard library only).
// The entry is the video itself: this program copies VIDEO.json from the
// repository root to /output/VIDEO.json, where the gate reads it.
// VIDEO.json holds the address of the public YouTube Short this entry names.
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Read the copied file back and validate it: a placeholder or broken URL
// must fail loudly here instead of slipping through to the grader.
let video: unknown;
try {
  video = JSON.parse(readFileSync(join(OUTPUT_DIR, 'VIDEO.json'), 'utf8'));
} catch (err) {
  console.error(`VIDEO.json in output is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
const url = (video as { url?: unknown } | null)?.url;
if (typeof url !== 'string' || !url.startsWith('https://') || url.includes('<') || url.includes('>')) {
  console.error('VIDEO.json has no valid https:// video URL (missing, not https, or still a placeholder) — refusing to continue.');
  process.exit(1);
}
console.log(`VIDEO.json OK: ${url}`);
