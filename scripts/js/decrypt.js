#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);

// Parse arguments - env is required
if (args.length < 1) {
  console.error('Usage: node decrypt.js <env>');
  console.error('Example: node decrypt.js dev');
  console.error('         node decrypt.js prod');
  console.error('\nAvailable envs: dev, prod, staging, etc.');
  process.exit(1);
}

const env = args[0];

// Construct paths - root is two levels up from scripts/js/
const rootDir = path.resolve(__dirname, '../..');
const rootKeysFile = path.join(rootDir, '.env.keys');

// Function to decrypt a single env file
function decryptEnvFile(envName) {
  // Skip .env.example
  if (envName === 'example') {
    console.error(`❌ Cannot decrypt .env.example file`);
    return false;
  }

  const encryptedEnvFile = path.join(rootDir, `.env.${envName}`);
  const decryptedEnvFile = path.join(rootDir, '.env');

  // Check if encrypted .env file exists
  if (!fs.existsSync(encryptedEnvFile)) {
    console.error(`❌ Encrypted file not found: .env.${envName}`);
    return false;
  }

  // Check if root .env.keys exists
  if (!fs.existsSync(rootKeysFile)) {
    console.error(`❌ Keys file not found: .env.keys`);
    console.error(`   Make sure .env.keys exists in root directory`);
    return false;
  }

  console.log(`🔓 Decrypting .env.${envName} -> .env...`);

  // Create custom key name to match encryption: DOTENV_PRIVATE_KEY_<ENV>
  const keyName = `DOTENV_PRIVATE_KEY_${envName.toUpperCase()}`;

  try {
    // Temporarily copy .env.keys to root for dotenvx
    const tempKeysFile = path.join(rootDir, '.env.keys.temp');
    fs.copyFileSync(rootKeysFile, tempKeysFile);

    // Create a temporary copy of the encrypted file
    const tempFile = path.join(rootDir, '.env.temp');
    fs.copyFileSync(encryptedEnvFile, tempFile);

    // Decrypt the temp file (this modifies it in place)
    // dotenvx will automatically use the correct key based on the public key in the file
    execSync(`npx dotenvx decrypt -f "${tempFile}"`, {
      cwd: rootDir,
      stdio: 'inherit',
    });

    // Read the decrypted content from temp file
    let decryptedContent = fs.readFileSync(tempFile, 'utf8');

    // Filter out any dotenvx messages, metadata, and DOTENV_PUBLIC_KEY_ lines
    decryptedContent = decryptedContent
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        // Skip dotenvx metadata comments
        if (trimmed.startsWith('#/---')) return false;
        if (trimmed.startsWith('#/filename:')) return false;
        if (trimmed.startsWith('#/keyname:')) return false;
        // Skip dotenvx messages
        if (trimmed.startsWith('no changes')) return false;
        // Skip DOTENV_PUBLIC_KEY lines
        if (trimmed.startsWith('DOTENV_PUBLIC_KEY')) return false;
        // Skip empty lines at the start
        if (trimmed === '' && decryptedContent.indexOf(line) < 10) return false;
        // Keep regular comments and env vars
        return trimmed.startsWith('#') || line.includes('=') || trimmed !== '';
      })
      .join('\n')
      .trim(); // Remove leading/trailing whitespace

    // Final content is just the cleaned decrypted variables
    const finalContent = decryptedContent;

    // Write to .env file
    fs.writeFileSync(decryptedEnvFile, finalContent);

    // Clean up temp files
    fs.unlinkSync(tempFile);
    if (fs.existsSync(tempKeysFile)) {
      fs.unlinkSync(tempKeysFile);
    }

    console.log(`✅ Successfully decrypted to: .env`);
    console.log(`   Source: .env.${envName} (remains encrypted)`);
    console.log(`   Key used: ${keyName}`);
    return true;
  } catch (error) {
    console.error(`❌ Decryption failed for .env.${envName}:`, error.message);

    // Clean up temporary files if they exist
    const tempFile = path.join(rootDir, '.env.temp');
    const tempKeysFile = path.join(rootDir, '.env.keys.temp');

    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    if (fs.existsSync(tempKeysFile)) {
      fs.unlinkSync(tempKeysFile);
    }

    return false;
  }
}

// Main execution
try {
  // Decrypt specific env (required)
  const success = decryptEnvFile(env);
  if (!success) {
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Decryption failed:', error.message);
  process.exit(1);
}
