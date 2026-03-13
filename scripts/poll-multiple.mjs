import fs from 'fs';
import path from 'path';

const API_KEY = '811a988b5f6cb805d5fac0596c66b253';
const tasks = {
  'assembly-backing-plate': '707b59b5e7a036f90572416a64a9ac76',
  'assembly-housing-close': '67a01164ff15bfd880ab3a0ce5cca091',
  'assembly-quality-test': '48cdd13c2a5da8ff28b29738e2670d9a',
  'assembly-soldering': '528cda354b2e3e1f1241c3a1da998ffa',
};

const outDir = path.join(process.cwd(), 'public', 'images', 'assembly');
fs.mkdirSync(outDir, { recursive: true });

const pending = new Map(Object.entries(tasks));
const completed = [];

for (let i = 0; i < 40 && pending.size > 0; i++) {
  await new Promise(r => setTimeout(r, 5000));
  for (const [name, taskId] of [...pending]) {
    try {
      const res = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` },
      });
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { continue; }

      const state = json.data?.state;
      if (state === 'success') {
        const result = JSON.parse(json.data.resultJson);
        const url = result.resultUrls[0];
        console.log(`✅ ${name}: ${url}`);
        const imgRes = await fetch(url);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        fs.writeFileSync(path.join(outDir, `${name}.jpg`), buf);
        console.log(`   Saved: ${name}.jpg`);
        pending.delete(name);
        completed.push(name);
      } else if (state === 'fail') {
        console.log(`❌ ${name}: ${json.data.failMsg}`);
        pending.delete(name);
      } else {
        process.stdout.write(`.`);
      }
    } catch (e) { /* retry */ }
  }
}
console.log(`\nDone: ${completed.length} completed, ${pending.size} remaining`);
