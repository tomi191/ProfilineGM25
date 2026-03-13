#!/usr/bin/env node
/**
 * Generate AI assembly process photos for Profiline GM25
 * Uses Kie.ai Nano Banana 2 API (Gemini 3.1 Flash Image)
 * Reference images from deployed site + local ai-webp folder
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const API_KEY = process.env.KIE_API_KEY || '811a988b5f6cb805d5fac0596c66b253';
const BASE_URL = 'https://api.kie.ai/api/v1/jobs';
const SITE_URL = 'https://profilinegm25.eu';

// Reference images from the deployed site
const REFERENCE_IMAGES = [
  `${SITE_URL}/images/ai-webp/studio-side.webp`,
  `${SITE_URL}/images/ai-webp/flat-lay.webp`,
  `${SITE_URL}/images/ai-webp/motor-internals.webp`,
  `${SITE_URL}/images/ai-webp/studio-top.webp`,
];

// Assembly process scenes to generate
const ASSEMBLY_SCENES = [
  {
    name: 'assembly-step1-unboxing',
    prompt: `Professional product photography of a Profiline GM25 dual-action orbital polisher being unboxed. The black polisher machine with lime-green accents is being carefully lifted from its branded cardboard box. Clean workshop environment with dark background. The box shows the PROFILINE GM25 branding. Soft dramatic studio lighting, photorealistic, high detail, commercial product photography style. The machine has a sleek black body with textured rubber grip, lime-green orbit ring near the backing plate, and a speed dial numbered 1-6.`,
    aspect_ratio: '3:2',
  },
  {
    name: 'assembly-step2-backing-plate',
    prompt: `Professional product photography showing hands attaching a 150mm (6-inch) black backing plate to a Profiline GM25 dual-action orbital polisher. Close-up shot of the mounting process, showing the threaded spindle and the backing plate being screwed on. The polisher is black with lime-green accents. Clean workshop workbench, dark moody lighting, photorealistic, high detail. The backing plate has ventilation holes in a circular pattern with a center bolt.`,
    aspect_ratio: '3:2',
  },
  {
    name: 'assembly-step3-pad-placement',
    prompt: `Professional product photography of a foam polishing pad being placed onto the backing plate of a Profiline GM25 dual-action orbital polisher. The orange cutting pad is being aligned onto the black backing plate via hook-and-loop attachment. The polisher is a sleek black machine with lime-green orbital ring accent. Clean detailing studio environment, dramatic lighting, photorealistic, commercial style. Top-down angle showing the pad centering process.`,
    aspect_ratio: '1:1',
  },
  {
    name: 'assembly-step4-speed-dial',
    prompt: `Professional close-up product photography of a hand adjusting the speed dial on a Profiline GM25 dual-action orbital polisher. The dial shows numbers 1 through 6, currently being set to position 3. The machine body is matte black with textured rubber grip surfaces. Lime-green accents visible. Sharp focus on the speed dial with shallow depth of field. Dark studio background, dramatic side lighting, photorealistic, commercial product photography.`,
    aspect_ratio: '4:3',
  },
  {
    name: 'assembly-step5-ready-to-use',
    prompt: `Professional product photography of a fully assembled Profiline GM25 dual-action orbital polisher ready for use. The complete setup shows: black polisher body with lime-green accents, attached backing plate with orange polishing pad, power cord neatly arranged. Placed on a clean dark workbench next to a bottle of polishing compound. Workshop environment with dramatic lighting, photorealistic, high-end commercial style. The machine looks powerful and professional.`,
    aspect_ratio: '3:2',
  },
  {
    name: 'assembly-exploded-view',
    prompt: `Professional technical product photography showing an exploded/disassembled view of a Profiline GM25 dual-action orbital polisher. All major components are neatly arranged on a dark surface: the main black body housing, electric motor (copper coil armature and stator), white nylon gear, speed controller circuit board, rubber handle grips, the orbit mechanism, backing plate (150mm and 125mm), power cord with lime-green strain relief. Clean studio lighting, photorealistic, technical documentation style. Components arranged in logical assembly order from left to right.`,
    aspect_ratio: '16:9',
  },
];

async function createTask(scene) {
  console.log(`\n🎨 Generating: ${scene.name}...`);

  const body = {
    model: 'nano-banana-2',
    input: {
      prompt: scene.prompt,
      image_input: REFERENCE_IMAGES,
      aspect_ratio: scene.aspect_ratio || '3:2',
      google_search: false,
      resolution: '2K',
      output_format: 'jpg',
    },
  };

  const res = await fetch(`${BASE_URL}/createTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.code !== 200) {
    console.error(`  ❌ Error creating task: ${data.message}`);
    return null;
  }

  console.log(`  ✅ Task created: ${data.data.taskId}`);
  return data.data.taskId;
}

async function queryTask(taskId) {
  const res = await fetch(`${BASE_URL}/recordInfo?taskId=${taskId}`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` },
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error(`  ⚠️  Non-JSON response (status ${res.status}), retrying...`);
    return { code: 0 };
  }
}

async function waitForTask(taskId, maxWait = 120000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const result = await queryTask(taskId);
    if (result.code === 200 && result.data) {
      const state = result.data.state;
      if (state === 'success') {
        const resultJson = JSON.parse(result.data.resultJson);
        return resultJson.resultUrls;
      }
      if (state === 'fail') {
        console.error(`  ❌ Task failed: ${result.data.failMsg}`);
        return null;
      }
      process.stdout.write(`  ⏳ ${state}...`);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  console.error(`  ⏰ Timeout waiting for task`);
  return null;
}

async function downloadImage(url, filename) {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  const outDir = path.join(PROJECT_ROOT, 'public', 'images', 'assembly');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`  💾 Saved: ${outPath}`);
  return outPath;
}

async function main() {
  console.log('🔧 Profiline GM25 Assembly Photo Generator');
  console.log(`📸 Using ${REFERENCE_IMAGES.length} reference images`);
  console.log(`🎯 Generating ${ASSEMBLY_SCENES.length} assembly scenes\n`);

  const results = [];
  // Skip already-generated images
  const outDir = path.join(PROJECT_ROOT, 'public', 'images', 'assembly');
  fs.mkdirSync(outDir, { recursive: true });

  for (const scene of ASSEMBLY_SCENES) {
    const outPath = path.join(outDir, `${scene.name}.jpg`);
    if (fs.existsSync(outPath)) {
      console.log(`\n⏭️  Skipping ${scene.name} (already exists)`);
      results.push({ name: scene.name, path: outPath });
      continue;
    }

    const taskId = await createTask(scene);
    if (!taskId) continue;

    const urls = await waitForTask(taskId, 180000);
    if (!urls || urls.length === 0) continue;

    console.log(`\n  🖼️  Result URL: ${urls[0]}`);
    const savedPath = await downloadImage(urls[0], `${scene.name}.jpg`);
    results.push({ name: scene.name, url: urls[0], path: savedPath });

    // Delay between requests to avoid rate limits
    console.log('  ⏸️  Waiting 3s before next request...');
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\n✅ Done! Generated ${results.length}/${ASSEMBLY_SCENES.length} images.`);
  results.forEach(r => console.log(`  📁 ${r.name}: ${r.path}`));
}

main().catch(console.error);
