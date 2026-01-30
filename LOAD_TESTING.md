# ===== Load Testing Configuration =====
# Test the site with Apache Bench, wrk, or k6

## Apache Bench (Simple concurrent users test)
# ab -n 1000000 -c 10000 https://hacashwebsite.com/

## Wrk (Advanced performance testing)
# wrk -t12 -c400 -d30s --latency https://hacashwebsite.com/

## K6 Load Testing Script
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 1000 },
    { duration: '5m', target: 10000 },
    { duration: '10m', target: 100000 },
    { duration: '10m', target: 1000000 },
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],
    'http_req_failed': ['rate<0.1'],
  },
};

export default function () {
  let res = http.get('https://hacashwebsite.com/');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'page load < 500ms': (r) => r.timings.duration < 500,
    'has content': (r) => r.body.length > 0,
  });
  
  sleep(1);
}

# Run with:
# k6 run load-test.js --out csv=results.csv
