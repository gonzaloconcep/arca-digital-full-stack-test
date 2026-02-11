import { execSync } from 'child_process';

console.log('Resetting database...');

// Run seed which will clear and recreate data
execSync('npx ts-node src/database/seeds/run-seed.ts', {
  cwd: __dirname.replace('/src/database', ''),
  stdio: 'inherit',
});
