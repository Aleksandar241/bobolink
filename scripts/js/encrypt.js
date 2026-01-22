#!/usr/bin/env node
/* eslint-env node */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

// Parse arguments - env is optional
const env = args[0] || null;

// Construct paths - root is two levels up from scripts/js/
const rootDir = path.resolve(__dirname, '../..');
const rootKeysFile = path.join(rootDir, '.env.keys');

// Function to encrypt a single env file
function encryptEnvFile(envName) {
  // Skip .env.example
  if (envName === 'example') {
    console.error(`❌ Cannot encrypt .env.example file`);
    return false;
  }

  const envFile = path.join(rootDir, `.env.${envName}`);

  // Check if .env file exists
  if (!fs.existsSync(envFile)) {
    console.error(`❌ Environment file not found: .env.${envName}`);
    return false;
  }

  console.log(`🔐 Encrypting .env.${envName}...`);

  const tempKeysFile = path.join(rootDir, '.env.keys.temp');

  // Create custom key name: DOTENV_PRIVATE_KEY_<ENV>
  const keyName = `DOTENV_PRIVATE_KEY_${envName.toUpperCase()}`;
  const publicKeyName = `DOTENV_PUBLIC_KEY_${envName.toUpperCase()}`;

  try {
    // Check if root .env.keys exists and has this key
    let hasExistingKey = false;
    if (fs.existsSync(rootKeysFile)) {
      const rootKeysContent = fs.readFileSync(rootKeysFile, 'utf8');
      hasExistingKey = rootKeysContent.includes(`${keyName}=`);

      if (hasExistingKey) {
        console.log(`   Using existing keys from .env.keys...`);
        // Always ensure .env.keys is present in root before encryption
        fs.copyFileSync(rootKeysFile, tempKeysFile);
      } else {
        console.log(`   Creating new encryption keys...`);
        // Remove any old temp .env.keys that might interfere
        if (fs.existsSync(tempKeysFile)) {
          fs.unlinkSync(tempKeysFile);
        }
      }
    } else {
      console.log(`   Creating new encryption keys...`);
      // Remove any old temp .env.keys that might interfere
      if (fs.existsSync(tempKeysFile)) {
        fs.unlinkSync(tempKeysFile);
      }
    }

    // Use dotenvx to encrypt the file
    execSync(`npx dotenvx encrypt -f "${envFile}"`, {
      stdio: 'inherit',
      cwd: rootDir,
    });

    // Update encrypted file to use custom key names and remove duplicates
    let encryptedContent = fs.readFileSync(envFile, 'utf8');

    // Remove duplicate headers and DOTENV_PUBLIC_KEY lines
    const lines = encryptedContent.split('\n');
    const cleanedLines = [];
    let publicKeyFound = false;
    let headerFound = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip duplicate headers (keep only first occurrence)
      if (trimmed.startsWith('#/-------------------[DOTENV_PUBLIC_KEY]')) {
        if (headerFound) continue; // Skip duplicate header
        headerFound = true;
        cleanedLines.push(line);
        continue;
      }

      // Skip unwanted decoration lines and comments
      if (
        trimmed.startsWith('#/            public-key') ||
        trimmed.startsWith('#/       [how it works]') ||
        (trimmed.startsWith('#/---') && !trimmed.includes('[DOTENV_PUBLIC_KEY]')) ||
        trimmed === `# .env.${envName}`
      ) {
        continue;
      }

      // Replace keyname in metadata
      if (line.includes('#/keyname:')) {
        if (!cleanedLines.find(l => l.includes('#/keyname:'))) {
          cleanedLines.push(`#/keyname: ${keyName}/`);
        }
        continue;
      }

      // Handle DOTENV_PUBLIC_KEY lines - keep only the first one with custom name
      if (trimmed.startsWith('DOTENV_PUBLIC_KEY')) {
        if (!publicKeyFound) {
          const keyValue = line.split('=')[1];
          cleanedLines.push(`${publicKeyName}=${keyValue}`);
          publicKeyFound = true;
        }
        // Skip any additional DOTENV_PUBLIC_KEY lines (duplicates)
        continue;
      }

      // Keep all other lines
      cleanedLines.push(line);
    }

    fs.writeFileSync(envFile, cleanedLines.join('\n'));

    // Handle .env.keys file - only update if we created NEW keys
    if (fs.existsSync(tempKeysFile) && !hasExistingKey) {
      // Read the temp keys file
      let keysContent = fs.readFileSync(tempKeysFile, 'utf8');

      // Replace default key names with custom key names
      keysContent = keysContent
        .replace(/DOTENV_PRIVATE_KEY(_[A-Z_]+)?=/g, `${keyName}=`)
        .replace(/DOTENV_PUBLIC_KEY(_[A-Z_]+)?=/g, `${publicKeyName}=`);

      // Manage root .env.keys
      if (fs.existsSync(rootKeysFile)) {
        let existingRootContent = fs.readFileSync(rootKeysFile, 'utf8');

        // Remove any existing entries for this key to avoid duplicates
        const privateKeyRegex = new RegExp(`^${keyName}=.*$`, 'gm');
        const publicKeyRegex = new RegExp(`^${publicKeyName}=.*$`, 'gm');

        existingRootContent = existingRootContent
          .replace(privateKeyRegex, '')
          .replace(publicKeyRegex, '')
          .replace(/\n\n+/g, '\n') // Clean up multiple empty lines
          .trim();

        // Add the new keys
        const finalContent = existingRootContent
          ? existingRootContent + '\n' + keysContent
          : keysContent;
        fs.writeFileSync(rootKeysFile, finalContent);

        console.log(`   Added new key: ${keyName}`);
      } else {
        fs.writeFileSync(rootKeysFile, keysContent);
        console.log(`   Created .env.keys with key: ${keyName}`);
      }
    } else if (hasExistingKey) {
      console.log(`   Using existing key: ${keyName}`);
    }

    // Always remove the temp .env.keys file if it exists
    if (fs.existsSync(tempKeysFile)) {
      fs.unlinkSync(tempKeysFile);
    }

    console.log(`✅ Successfully encrypted: .env.${envName}`);
    return true;
  } catch (error) {
    console.error(`❌ Encryption failed for .env.${envName}:`, error.message);
    // Clean up temp file
    if (fs.existsSync(tempKeysFile)) {
      fs.unlinkSync(tempKeysFile);
    }
    return false;
  }
}

// Main execution
try {
  if (env) {
    // Encrypt specific env
    const success = encryptEnvFile(env);
    if (!success) {
      process.exit(1);
    }
  } else {
    // Find all .env.* files (excluding .env.keys and .env.example)
    const files = fs.readdirSync(rootDir);
    const envFiles = files
      .filter(
        file =>
          file.startsWith('.env.') &&
          file !== '.env.keys' &&
          file !== '.env.example'
      )
      .map(file => file.replace('.env.', ''));

    if (envFiles.length === 0) {
      console.error('❌ No .env.* files found in root directory');
      process.exit(1);
    }

    console.log(`🔐 Found ${envFiles.length} environment file(s) to encrypt...\n`);

    let allSuccess = true;
    for (const envName of envFiles) {
      const success = encryptEnvFile(envName);
      if (!success) {
        allSuccess = false;
      }
      console.log(''); // Empty line between files
    }

    if (!allSuccess) {
      process.exit(1);
    }
  }
} catch (error) {
  console.error('❌ Encryption failed:', error.message);
  process.exit(1);
}
