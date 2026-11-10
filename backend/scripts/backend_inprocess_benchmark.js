const { performance } = require('perf_hooks');
const { EventEmitter } = require('events');
const app = require('../app');

function executeApi(method, url, headers = {}, body = null) {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.originalUrl = url;
    req.headers = { host: 'localhost', 'content-type': 'application/json', ...headers };
    req.body = body;

    const res = new EventEmitter();
    res.statusCode = 200;
    res._headers = {};
    res.setHeader = (k, v) => { res._headers[k.toLowerCase()] = v; };
    res.getHeader = (k) => res._headers[k.toLowerCase()];
    res.removeHeader = (k) => { delete res._headers[k.toLowerCase()]; };
    res.status = (code) => { res.statusCode = code; return res; };
    
    let resBody = '';
    res.send = (data) => {
      const duration = performance.now() - t0;
      resBody = data;
      let parsed = null;
      try { parsed = JSON.parse(data); } catch(e) { parsed = data; }
      resolve({
        statusCode: res.statusCode,
        duration,
        success: res.statusCode >= 200 && res.statusCode < 400,
        body: parsed
      });
      return res;
    };
    res.json = (data) => {
      res.setHeader('content-type', 'application/json');
      return res.send(JSON.stringify(data));
    };

    try {
      app(req, res);
    } catch (err) {
      const duration = performance.now() - t0;
      resolve({ statusCode: 500, duration, success: false, error: err.message });
    }
  });
}

function calculateStats(results) {
  const durations = results.map(r => r.duration).sort((a, b) => a - b);
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;
  const min = durations[0] || 0;
  const max = durations[durations.length - 1] || 0;
  const sum = durations.reduce((acc, d) => acc + d, 0);
  const avg = sum / (durations.length || 1);
  const p50 = durations[Math.floor(durations.length * 0.5)] || 0;
  const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
  const p99 = durations[Math.floor(durations.length * 0.99)] || 0;

  return {
    total: results.length,
    success: successCount,
    failed: failureCount,
    minMs: min.toFixed(2),
    avgMs: avg.toFixed(2),
    p50Ms: p50.toFixed(2),
    p95Ms: p95.toFixed(2),
    p99Ms: p99.toFixed(2),
    maxMs: max.toFixed(2)
  };
}

async function runConcurrentBatch(batchSize, fn) {
  const promises = [];
  for (let i = 0; i < batchSize; i++) {
    promises.push(fn());
  }
  return await Promise.all(promises);
}

async function main() {
  console.log('================================================================');
  console.log('⚡ RANKERS PATH BACKEND RESPONSIVENESS & PERFORMANCE BENCHMARK ⚡');
  console.log('================================================================\n');

  const initialMem = process.memoryUsage();
  console.log(`Memory Baseline -> Heap Used: ${(initialMem.heapUsed / 1024 / 1024).toFixed(2)} MB | RSS: ${(initialMem.rss / 1024 / 1024).toFixed(2)} MB\n`);

  // Section 1: Single Request Micro-benchmarks
  console.log('--- 1. SINGLE-REQUEST LATENCY BENCHMARK (Cold vs Warm) ---');
  const testEndpoints = [
    { method: 'GET', url: '/api/health' },
    { method: 'GET', url: '/api/courses' },
    { method: 'GET', url: '/api/fees/config' },
    { method: 'GET', url: '/api/faculty' },
    { method: 'GET', url: '/api/cms/banners' },
    { method: 'GET', url: '/api/questions/list' },
    { method: 'POST', url: '/api/auth/staff-login', body: { email: 'admin@rankerspath.in', password: 'Admin@123' } }
  ];

  let adminToken = null;
  for (const ep of testEndpoints) {
    const res = await executeApi(ep.method, ep.url, {}, ep.body);
    if (ep.url.includes('staff-login') && res.body?.data?.token) {
      adminToken = res.body.data.token;
    }
    console.log(`  ${ep.method.padEnd(5)} ${ep.url.padEnd(25)} -> Status: ${res.statusCode} | Latency: ${res.duration.toFixed(2)}ms | Success: ${res.success}`);
  }

  // Section 2: Concurrency & RPS on Public Read Endpoints (GET /api/courses)
  console.log('\n--- 2. CONCURRENT LOAD SCALING: GET /api/courses ---');
  for (const concurrency of [10, 50, 100, 200]) {
    const t0 = performance.now();
    const results = await runConcurrentBatch(concurrency, () => executeApi('GET', '/api/courses'));
    const totalTime = performance.now() - t0;
    const stats = calculateStats(results);
    const rps = ((concurrency / (totalTime / 1000))).toFixed(1);
    console.log(`  Concurrency: ${concurrency.toString().padStart(4)} | Total: ${totalTime.toFixed(0).padStart(4)}ms | RPS: ${rps.padStart(7)} req/s | Avg: ${stats.avgMs.padStart(5)}ms | P95: ${stats.p95Ms.padStart(5)}ms | Max: ${stats.maxMs.padStart(5)}ms | Pass: ${stats.success}/${stats.total}`);
  }

  // Section 3: Concurrency on Config Endpoints (GET /api/fees/config)
  console.log('\n--- 3. CONCURRENT LOAD SCALING: GET /api/fees/config ---');
  for (const concurrency of [10, 50, 100, 200]) {
    const t0 = performance.now();
    const results = await runConcurrentBatch(concurrency, () => executeApi('GET', '/api/fees/config'));
    const totalTime = performance.now() - t0;
    const stats = calculateStats(results);
    const rps = ((concurrency / (totalTime / 1000))).toFixed(1);
    console.log(`  Concurrency: ${concurrency.toString().padStart(4)} | Total: ${totalTime.toFixed(0).padStart(4)}ms | RPS: ${rps.padStart(7)} req/s | Avg: ${stats.avgMs.padStart(5)}ms | P95: ${stats.p95Ms.padStart(5)}ms | Max: ${stats.maxMs.padStart(5)}ms | Pass: ${stats.success}/${stats.total}`);
  }

  // Section 4: CPU-Heavy Bcrypt Authentication Load (POST /api/auth/staff-login)
  console.log('\n--- 4. CPU-INTENSIVE CONCURRENCY: POST /api/auth/staff-login (Bcrypt) ---');
  for (const concurrency of [5, 15, 30]) {
    const t0 = performance.now();
    const results = await runConcurrentBatch(concurrency, () =>
      executeApi('POST', '/api/auth/staff-login', {}, { email: 'admin@rankerspath.in', password: 'Admin@123' })
    );
    const totalTime = performance.now() - t0;
    const stats = calculateStats(results);
    const rps = ((concurrency / (totalTime / 1000))).toFixed(1);
    console.log(`  Concurrency: ${concurrency.toString().padStart(4)} | Total: ${totalTime.toFixed(0).padStart(4)}ms | RPS: ${rps.padStart(7)} req/s | Avg: ${stats.avgMs.padStart(5)}ms | P95: ${stats.p95Ms.padStart(5)}ms | Max: ${stats.maxMs.padStart(5)}ms | Pass: ${stats.success}/${stats.total}`);
  }

  // Section 5: Authenticated Heavy Read (GET /api/students)
  if (adminToken) {
    console.log('\n--- 5. AUTHENTICATED ADMIN READ: GET /api/students ---');
    for (const concurrency of [10, 50, 100]) {
      const t0 = performance.now();
      const results = await runConcurrentBatch(concurrency, () =>
        executeApi('GET', '/api/students', { authorization: `Bearer ${adminToken}` })
      );
      const totalTime = performance.now() - t0;
      const stats = calculateStats(results);
      const rps = ((concurrency / (totalTime / 1000))).toFixed(1);
      console.log(`  Concurrency: ${concurrency.toString().padStart(4)} | Total: ${totalTime.toFixed(0).padStart(4)}ms | RPS: ${rps.padStart(7)} req/s | Avg: ${stats.avgMs.padStart(5)}ms | P95: ${stats.p95Ms.padStart(5)}ms | Max: ${stats.maxMs.padStart(5)}ms | Pass: ${stats.success}/${stats.total}`);
    }
  }

  const finalMem = process.memoryUsage();
  console.log(`\nMemory After Load -> Heap Used: ${(finalMem.heapUsed / 1024 / 1024).toFixed(2)} MB (Delta: ${((finalMem.heapUsed - initialMem.heapUsed) / 1024 / 1024).toFixed(2)} MB) | RSS: ${(finalMem.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n================================================================');
  console.log('✅ BACKEND RESPONSIVENESS BENCHMARK COMPLETE');
  console.log('================================================================');
}

main().catch(err => console.error('Benchmark Error:', err));
