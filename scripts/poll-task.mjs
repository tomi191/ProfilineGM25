// Poll a Kie.ai task until completion
const taskId = process.argv[2];
if (!taskId) { console.error('Usage: node poll-task.mjs <taskId>'); process.exit(1); }

const API_KEY = '811a988b5f6cb805d5fac0596c66b253';
const fs = await import('fs');
const path = await import('path');

for (let i = 0; i < 40; i++) {
  await new Promise(r => setTimeout(r, 5000));
  try {
    const res = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` },
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { console.log(`[${i+1}] non-JSON response`); continue; }

    const state = json.data?.state || 'unknown';
    console.log(`[${i+1}] State: ${state}`);

    if (state === 'success') {
      const result = JSON.parse(json.data.resultJson);
      const url = result.resultUrls[0];
      console.log(`\nImage URL: ${url}`);

      // Download
      const imgRes = await fetch(url);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const outDir = path.join(process.cwd(), 'public', 'images', 'assembly');
      fs.mkdirSync(outDir, { recursive: true });
      const outFile = path.join(outDir, `assembly-test.jpg`);
      fs.writeFileSync(outFile, buf);
      console.log(`Saved: ${outFile}`);
      process.exit(0);
    }
    if (state === 'fail') {
      console.error(`FAILED: ${json.data.failMsg}`);
      process.exit(1);
    }
  } catch (e) { console.log(`[${i+1}] Error: ${e.message}`); }
}
console.error('Timeout');
