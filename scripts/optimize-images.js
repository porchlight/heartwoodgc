import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, parse, join } from 'node:path';
import sharp from 'sharp';

const PROJECTS_DIR = resolve('src/assets/projects');
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

async function optimizeImage(filePath) {
  const { dir, name } = parse(filePath);
  const webpPath = join(dir, `${name}.webp`);

  const image = sharp(filePath);
  const metadata = await image.metadata();

  // Resize if wider than max, strip EXIF
  const pipeline = image
    .rotate() // auto-rotate based on EXIF before stripping
    .withMetadata({ orientation: undefined }) // strip EXIF
    .resize(
      metadata.width > MAX_WIDTH ? { width: MAX_WIDTH, withoutEnlargement: true } : undefined
    );

  // Overwrite original (resized, EXIF stripped)
  const buffer = await pipeline.toBuffer();
  await sharp(buffer).toFile(filePath);
  console.log(`  ✓ Optimized: ${filePath}`);

  // Generate WebP
  await sharp(buffer).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
  console.log(`  ✓ WebP created: ${webpPath}`);
}

async function main() {
  const imageExtensions = ['.jpg', '.jpeg', '.png'];

  // Check if running as a git hook (staged files) or standalone
  let files = [];

  try {
    const staged = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    }).trim();

    if (staged) {
      files = staged
        .split('\n')
        .filter((f) => {
          const ext = parse(f).ext.toLowerCase();
          return f.startsWith('src/assets/projects/') && imageExtensions.includes(ext);
        })
        .map((f) => resolve(f));
    }
  } catch {
    // Not in a git context or no staged files — scan the directory
    if (existsSync(PROJECTS_DIR)) {
      const { readdirSync } = await import('node:fs');
      files = readdirSync(PROJECTS_DIR)
        .filter((f) => imageExtensions.includes(parse(f).ext.toLowerCase()))
        .map((f) => join(PROJECTS_DIR, f));
    }
  }

  if (files.length === 0) {
    console.log('No images to optimize.');
    return;
  }

  console.log(`Optimizing ${files.length} image(s)...`);

  for (const file of files) {
    if (existsSync(file)) {
      await optimizeImage(file);
    }
  }

  // Re-stage optimized files if running in git context
  try {
    for (const file of files) {
      const { dir, name } = parse(file);
      const webpPath = join(dir, `${name}.webp`);
      execSync(`git add "${file}" "${webpPath}"`, { stdio: 'ignore' });
    }
  } catch {
    // Not in git context, skip staging
  }

  console.log('Done!');
}

main().catch((err) => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
