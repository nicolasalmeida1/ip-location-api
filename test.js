import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  duration: '50s',
};

export default function () {
  const ip = '1.0.1.1';
  const res = http.get(`http://localhost:3000/ip/location?ip=${ip}`);

  check(res, {
    'status is 200 or 404': (r) => r.status === 200 || r.status === 404,
  });
}
