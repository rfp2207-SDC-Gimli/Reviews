import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  thresholds: {
    // 90% of requests must finish within 400ms.
    http_req_duration: ['p(90) < 400'],
  },
  stages: [
    { duration: '15s', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '15s', target: 250 },
    { duration: '30s', target: 250 },
    { duration: '15s', target: 500 },
    { duration: '30s', target: 500 },
    { duration: '15s', target: 1000 },
    { duration: '30s', target: 1000 },
    { duration: '60s', target: 0 },
  ]
};


export default function () {
  let id = Math.floor(Math.random() * 99999);

  const BASE_URL = 'http://localhost:3000/reviews';

  const res = http.get(`${BASE_URL}?product_id=${id}`)
  const res2 = http.get(`${BASE_URL}/meta?product_id=${id}`)
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  check(res2, {
    'is status 200': (r) => r.status === 200,
  });
}