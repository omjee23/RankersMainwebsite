const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:5002/api';

async function measureRequest(fn) {
  const start = performance.now();
  try {
    const res = await fn();
    const duration = performance.now() - start;
    return { success: res.ok, status: res.status, duration };
  } catch (err) {
    const duration = performance.now() - start;
    return { success: false, error: err.message, duration };
  }
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
    promises.push(measureRequest(fn));
  }
  return await Promise.all(promises);
}

async function main() {
  console.log('=== STARTING BACKEND RESPONSIVENESS & CONCURRENCY BENCHMARK ===');
  console.log(`Target: ${BASE_URL}\n`);

  // 1. Single request baseline
  console.log('--- 1. Baseline Endpoint Latency (Single Requests) ---');
  for (const endpoint of ['/health', '/courses', '/fees/config', '/centers']) {
    const start = performance.now();
    const res = await fetch(`${BASE_URL}${endpoint}`);
    const time = (performance.now() - start).toFixed(2);
    console.log(`GET ${endpoint.padEnd(16)} -> Status: ${res.status} | Latency: ${time}ms`);
  }

  // 2. Concurrency test: GET /courses (Public Read)
  console.log('\n--- 2. Public Read Throughput (GET /courses) ---');
  for (const concurrency of [10, 50, 100]) {
    const t0 = performance.now();
    const results = await runConcurrentBatch(concurrency, () => fetch(`${BASE_URL}/courses`));
    const totalTime = performance.now() - t0;
    const stats = calculateStats(results);
    const rps = ((concurrency / (totalTime / 1000))).toFixed(1);
    console.log(`Concurrency ${concurrency.toString().padStart(3)}: Total: ${totalTime.toFixed(0).padStart(4)}ms | RPS: ${rps.padStart(6)} req/s | Avg: ${stats.avgMs.padStart(5)}ms | P95: ${stats.p95Ms.padStart(5)}ms | Max: ${stats.maxMs.padStart(5)}ms | Success: ${stats.success}/${stats.total}`);
  }

  // 3. Concurrency test: GET /fees/config (Public Read)
  console.log('\n--- 3. Public Config Throughput (GET /fees/config) ---');
  for (const concurrency of [10, 50, 100]) {
    const t0 = performance.now();
    const results = await runConcurrentBatch(concurrency, () => fetch(`${BASE_URL}/fees/config`));
    const totalTime = performance.now() - t0;
    const stats = calculateStats(results);
    const rps = ((concurrency / (totalTime / 1000))).toFixed(1);
    console.log(`Concurrency ${concurrency.toString().padStart(3)}: Total: ${totalTime.toFixed(0).padStart(4)}ms | RPS: ${rps.padStart(6)} req/s | Avg: ${stats.avgMs.padStart(5)}ms | P95: ${stats.p95Ms.padStart(5)}ms | Max: ${stats.maxMs.padStart(5)}ms | Success: ${stats.success}/${stats.total}`);
  }

  // 4. CPU-Intensive Concurrency: Staff Login (Bcrypt verification)
  console.log('\n--- 4. CPU / Auth Concurrency (POST /auth/staff-login) ---');
  for (const concurrency of [5, 15, 30]) {
    const t0 = performance.now();
    const results = await runConcurrentBatch(concurrency, () =>
      fetch(`${BASE_URL}/auth/staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@rankerspath.in', password: 'Admin@123' })
      })
    );
    const totalTime = performance.now() - t0;
    const stats = calculateStats(results);
    const rps = ((concurrency / (totalTime / 1000))).toFixed(1);
    console.log(`Concurrency ${concurrency.toString().padStart(3)}: Total: ${totalTime.toFixed(0).padStart(4)}ms | RPS: ${rps.padStart(6)} req/s | Avg: ${stats.avgMs.padStart(5)}ms | P95: ${stats.p95Ms.padStart(5)}ms | Max: ${stats.maxMs.padStart(5)}ms | Success: ${stats.success}/${stats.total}`);
  }

  // 5. Authenticated Admin Queries: Admin Token retrieval + Concurrent queries
  console.log('\n--- 5. Authenticated Admin Route Throughput (GET /students) ---');
  const loginRes = await fetch(`${BASE_URL}/auth/staff-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@rankerspath.in', password: 'Admin@123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  if (token) {
    for (const concurrency of [10, 30, 50]) {
      const t0 = performance.now();
      const results = await runConcurrentBatch(concurrency, () =>
        fetch(`${BASE_URL}/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      const totalTime = performance.now() - t0;
      const stats = calculateStats(results);
      const rps = ((concurrency / (totalTime / 1000))).toFixed(1);
      console.log(`Concurrency ${concurrency.toString().padStart(3)}: Total: ${totalTime.toFixed(0).padStart(4)}ms | RPS: ${rps.padStart(6)} req/s | Avg: ${stats.avgMs.padStart(5)}ms | P95: ${stats.p95Ms.padStart(5)}ms | Max: ${stats.maxMs.padStart(5)}ms | Success: ${stats.success}/${stats.total}`);
    }
  }

  console.log('\n=== BACKEND BENCHMARK COMPLETE ===');
}

main().catch(err => console.error('Benchmark failed:', err));
