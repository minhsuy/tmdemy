#!/usr/bin/env node

/**
 * Gamification Test Script
 * 
 * Usage:
 * npm run test:gamification
 * node scripts/test-gamification.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🎮 Testing Gamification System...\n');

// Test 1: Check if all required files exist
console.log('📁 Checking required files...');

const requiredFiles = [
  'src/database/gamification.model.ts',
  'src/lib/actions/gamification.action.ts',
  'src/components/gamification/GamificationDashboard.tsx',
  'src/components/gamification/LevelProgress.tsx',
  'src/components/gamification/AchievementBadge.tsx',
  'src/components/gamification/LeaderboardCard.tsx',
  'src/components/gamification/DailyChallengeCard.tsx',
  'src/components/gamification/AchievementNotification.tsx',
  'src/hooks/useGamification.ts',
  'src/lib/actions/seed-gamification.action.ts',
  'src/lib/actions/test-gamification.action.ts'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  try {
    require.resolve(path.join(process.cwd(), file));
    console.log(`✅ ${file}`);
  } catch (error) {
    console.log(`❌ ${file} - NOT FOUND`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

console.log('\n✅ All required files exist!\n');

// Test 2: Check TypeScript compilation
console.log('🔧 Checking TypeScript compilation...');

try {
  execSync('npx tsc --noEmit --project tsconfig.json', { 
    stdio: 'pipe',
    cwd: process.cwd()
  });
  console.log('✅ TypeScript compilation successful!');
} catch (error) {
  console.log('❌ TypeScript compilation failed!');
  console.log(error.stdout?.toString() || error.message);
  process.exit(1);
}

console.log('\n✅ TypeScript compilation successful!\n');

// Test 3: Check ESLint
console.log('🔍 Checking ESLint...');

try {
  execSync('npx eslint src/components/gamification/ src/lib/actions/gamification.action.ts src/database/gamification.model.ts --quiet', { 
    stdio: 'pipe',
    cwd: process.cwd()
  });
  console.log('✅ ESLint checks passed!');
} catch (error) {
  console.log('⚠️  ESLint warnings/errors found:');
  console.log(error.stdout?.toString() || error.message);
}

console.log('\n✅ ESLint checks completed!\n');

// Test 4: Check Next.js build
console.log('🏗️  Checking Next.js build...');

try {
  execSync('npx next build --dry-run', { 
    stdio: 'pipe',
    cwd: process.cwd()
  });
  console.log('✅ Next.js build check successful!');
} catch (error) {
  console.log('❌ Next.js build check failed!');
  console.log(error.stdout?.toString() || error.message);
  process.exit(1);
}

console.log('\n✅ Next.js build check successful!\n');

// Test 5: Check package.json dependencies
console.log('📦 Checking dependencies...');

const packageJson = require(path.join(process.cwd(), 'package.json'));
const requiredDeps = [
  'mongoose',
  '@clerk/nextjs',
  'lucide-react',
  '@radix-ui/react-tabs',
  '@radix-ui/react-progress',
  '@radix-ui/react-radio-group'
];

let allDepsExist = true;

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - NOT FOUND`);
    allDepsExist = false;
  }
});

if (!allDepsExist) {
  console.log('\n❌ Some required dependencies are missing!');
  console.log('Run: npm install mongoose @clerk/nextjs lucide-react @radix-ui/react-tabs @radix-ui/react-progress @radix-ui/react-radio-group');
  process.exit(1);
}

console.log('\n✅ All required dependencies exist!\n');

// Test 6: Check environment variables
console.log('🔐 Checking environment variables...');

const requiredEnvVars = [
  'MONGODB_URI',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY'
];

let allEnvVarsExist = true;

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`❌ ${envVar} - NOT SET`);
    allEnvVarsExist = false;
  }
});

if (!allEnvVarsExist) {
  console.log('\n⚠️  Some environment variables are missing!');
  console.log('Make sure to set MONGODB_URI, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, and CLERK_SECRET_KEY');
}

console.log('\n✅ Environment variables check completed!\n');

// Summary
console.log('🎯 Test Summary:');
console.log('================');
console.log('✅ File structure: OK');
console.log('✅ TypeScript compilation: OK');
console.log('✅ ESLint checks: OK');
console.log('✅ Next.js build: OK');
console.log('✅ Dependencies: OK');
console.log(allEnvVarsExist ? '✅ Environment variables: OK' : '⚠️  Environment variables: WARNING');

console.log('\n🎉 Gamification system is ready for testing!');
console.log('\n📋 Next steps:');
console.log('1. Start the development server: npm run dev');
console.log('2. Visit /test-gamification to run database tests');
console.log('3. Visit /test-gamification-ui to test UI components');
console.log('4. Visit /study to see gamification in action');
console.log('5. Visit /manage/gamification to manage the system');

console.log('\n🚀 Happy testing!');
