const { execSync } = require('child_process');

execSync('npx playwright install', { stdio: 'inherit' });
execSync('npx playwright install-deps', { stdio: 'inherit' });
