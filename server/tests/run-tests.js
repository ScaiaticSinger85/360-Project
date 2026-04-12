const path = require('path');
const fs = require('fs');

const checks = [
  {
    name: 'server.js exists',
    run: () => fs.existsSync(path.join(__dirname, '..', 'server.js')),
  },
  {
    name: 'event routes expose comments',
    run: () =>
      fs.readFileSync(path.join(__dirname, '..', 'routes', 'eventRoutes.js'), 'utf8').includes('/:eventId/comments'),
  },
  {
    name: 'event routes expose reactions',
    run: () =>
      fs.readFileSync(path.join(__dirname, '..', 'routes', 'eventRoutes.js'), 'utf8').includes('/:eventId/reactions'),
  },
  {
    name: 'user routes expose usage report',
    run: () =>
      fs.readFileSync(path.join(__dirname, '..', 'routes', 'userRoutes.js'), 'utf8').includes('/reports/usage'),
  },
  {
    name: '.env.example documents admin credentials',
    run: () =>
      fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8').includes('ADMIN_EMAIL'),
  },
];

let passed = 0;

for (const check of checks) {
  const result = Boolean(check.run());
  if (result) passed += 1;
  console.log(`${result ? 'PASS' : 'FAIL'} - ${check.name}`);
}

console.log(`\n${passed}/${checks.length} tests passed`);

if (passed !== checks.length) {
  process.exit(1);
}
