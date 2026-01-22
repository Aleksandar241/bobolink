#!/bin/bash

echo "🔐 Encrypting all environment files..."

# Find all .env.* files in root (excluding .env, .env.example, .env.keys)
env_files=$(find . -maxdepth 1 -type f -name ".env.*" ! -name ".env.example" ! -name ".env.keys" ! -name ".env.*.enc")

if [ -z "$env_files" ]; then
  echo "  ℹ️  No .env.* files found to encrypt"
  exit 0
fi

# Track if any encryption failed
failed=0

# Encrypt each file
while IFS= read -r file; do
  # Extract env from filename
  # e.g., .env.dev -> dev
  env_file=$(basename "$file")
  env=${env_file#.env.}
  
  echo "  → Encrypting $file (env: $env)"
  
  # Try to encrypt (pass only env, not app name)
  if ! node scripts/js/encrypt.js "$env"; then
    echo "  ❌ Failed to encrypt $file"
    failed=1
  else
    # Add encrypted file to git staging
    git add "$file" 2>/dev/null || true
  fi
done <<< "$env_files"

if [ $failed -eq 1 ]; then
  echo ""
  echo "❌ Encryption failed for one or more files"
  echo "   Please fix the issues and try again"
  exit 1
fi

echo "✅ All environment files encrypted successfully"
exit 0
