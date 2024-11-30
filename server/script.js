const autocannon = require('autocannon');

const endpoints = [
  { method: 'GET', url: 'https://hollywoodsmile.vercel.app/users' },
  { method: 'POST', url: 'https://hollywoodsmile.vercel.app/users', body: { name: 'John', email: 'john@example.com' } },
  { method: 'GET', url: 'https://hollywoodsmile.vercel.app/services' },
  { method: 'POST', url: 'https://hollywoodsmile.vercel.app/bookings', body: { date: '2024-12-01', user: 'user123',  } },
  { method: 'GET', url: 'https://hollywoodsmile.vercel.app/bookings' },
  { method: 'GET', url: 'https://hollywoodsmile.vercel.app/bookings/1' },
  { method: 'PUT', url: 'https://hollywoodsmile.vercel.app/bookings/1', body: { date: '2024-12-01', user: 'user123',  } },
  { method: 'DELETE', url: 'https://hollywoodsmile.vercel.app/bookings/1' },
  { method: 'GET', url: 'https://hollywoodsmile.vercel.app/bookings/1' },
  { method: 'GET', url: 'https://hollywoodsmile.vercel.app/bookings/2' },
];

const runTest = async (endpoint) => {
  const { method, url, body } = endpoint;
  const opts = {
    url,
    method,
    connections: 10,
    duration: 10,
    ...(body && { requests: [{ body: JSON.stringify(body) }] }),
  };

  const instance = autocannon(opts);
  autocannon.track(instance);

  return new Promise((resolve) => instance.on('done', resolve));
};

(async () => {
  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint.method} ${endpoint.url}`);
    await runTest(endpoint);
    console.log(`Completed ${endpoint.method} ${endpoint.url}\n`);
  }
})();
