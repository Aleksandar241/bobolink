#!/usr/bin/env node
/* eslint-env node */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

// Parse arguments - first is platform (from package.json), second is env (optional, default 'dev')
const platform = args[0];
let env = 'dev';
let useDevice = false;

// Check if second argument is --device
if (args[1] === '--device') {
  useDevice = true;
  // Third argument could be env
  if (args[2]) {
    env = args[2].replace(/^--/, '');
  }
} else {
  // Second argument is env (if present)
  if (args[1]) {
    env = args[1].replace(/^--/, '');
  }
  // Check if third argument is --device
  if (args[2] === '--device') {
    useDevice = true;
  }
}

// Validate platform
if (!['ios', 'android'].includes(platform)) {
  console.error(`❌ Invalid platform: ${platform}`);
  console.error('   Available platforms: ios, android');
  process.exit(1);
}

// Get root directory (two levels up from scripts/js/)
const rootDir = path.resolve(__dirname, '../..');

// Check if native folders exist
const iosDir = path.join(rootDir, 'ios');
const androidDir = path.join(rootDir, 'android');
const needsPrebuild = !fs.existsSync(iosDir) || !fs.existsSync(androidDir);

if (needsPrebuild) {
  console.log('🔨 Native folders not found, running prebuild...\n');
  try {
    execSync('npx expo prebuild', {
      stdio: 'inherit',
      cwd: rootDir,
    });
    console.log('✅ Prebuild completed\n');
  } catch (error) {
    console.error('❌ Prebuild failed:', error.message);
    process.exit(1);
  }
}

console.log(`🔓 Decrypting .env.${env}...`);

try {
  // Decrypt the env file
  execSync(`pnpm run decrypt ${env}`, {
    stdio: 'inherit',
    cwd: rootDir,
  });

  // Read BUNDLE_ID from .env file
  const envFile = path.join(rootDir, '.env');
  if (!fs.existsSync(envFile)) {
    console.error('❌ .env file not found after decryption');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envFile, 'utf8');
  const bundleIdMatch = envContent.match(/^BUNDLE_ID=(.+)$/m);
  const newBundleId = bundleIdMatch ? bundleIdMatch[1].trim() : null;

  if (!newBundleId) {
    console.error('❌ BUNDLE_ID not found in .env file');
    process.exit(1);
  }

  // Check if BUNDLE_ID changed
  let needsCleanPrebuild = false;

  // Check Android applicationId
  if (fs.existsSync(androidDir)) {
    const buildGradlePath = path.join(androidDir, 'app', 'build.gradle');
    if (fs.existsSync(buildGradlePath)) {
      const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
      const androidIdMatch = buildGradleContent.match(
        /applicationId\s+['"]([^'"]+)['"]/
      );
      const currentAndroidId = androidIdMatch ? androidIdMatch[1] : null;

      if (currentAndroidId && currentAndroidId !== newBundleId) {
        console.log(
          `⚠️  Android package changed: ${currentAndroidId} -> ${newBundleId}`
        );
        needsCleanPrebuild = true;
      }
    }
  }

  // Check iOS bundle identifier
  if (fs.existsSync(iosDir)) {
    // Find .xcodeproj folder dynamically
    const iosFiles = fs.readdirSync(iosDir);
    const xcodeprojFolder = iosFiles.find(file => file.endsWith('.xcodeproj'));

    if (xcodeprojFolder) {
      const projectPbxprojPath = path.join(
        iosDir,
        xcodeprojFolder,
        'project.pbxproj'
      );
      if (fs.existsSync(projectPbxprojPath)) {
        const projectContent = fs.readFileSync(projectPbxprojPath, 'utf8');
        const iosIdMatch = projectContent.match(
          /PRODUCT_BUNDLE_IDENTIFIER\s*=\s*([^;]+);/
        );
        const currentIosId = iosIdMatch ? iosIdMatch[1].trim() : null;

        if (currentIosId && currentIosId !== newBundleId) {
          console.log(
            `⚠️  iOS bundle identifier changed: ${currentIosId} -> ${newBundleId}`
          );
          needsCleanPrebuild = true;
        }
      }
    }
  }

  if (needsCleanPrebuild) {
    console.log('\n🔨 Bundle ID changed, running prebuild --clean...\n');
    try {
      execSync('npx expo prebuild --clean', {
        stdio: 'inherit',
        cwd: rootDir,
      });
      console.log('✅ Prebuild --clean completed\n');
    } catch (error) {
      console.error('❌ Prebuild --clean failed:', error.message);
      process.exit(1);
    }
  }

  console.log(`🚀 Running on ${platform}...\n`);

  // Build expo command
  let expoCommand = `EXPO_ATLAS=true expo run:${platform}`;
  if (useDevice) {
    expoCommand += ' --device';
  }

  // Run expo
  execSync(expoCommand, {
    stdio: 'inherit',
    cwd: rootDir,
  });
} catch (error) {
  console.error('❌ Failed:', error.message);
  process.exit(1);
}
