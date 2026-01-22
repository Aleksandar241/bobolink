#!/bin/bash

# Check if sensitive files are staged for commit

echo "🔍 Checking for sensitive files in staging..."

# Check for .env.keys
if git diff --cached --name-only | grep -q "^\.env\.keys$"; then
  echo ""
  echo "❌ ERROR: .env.keys is staged for commit!"
  echo "   This file contains encryption keys and should NEVER be committed."
  echo ""
  echo "   To fix:"
  echo "   git reset HEAD .env.keys"
  echo ""
  exit 1
fi

# Check for temporary encryption files
if git diff --cached --name-only | grep -q "\.env\.keys\.temp$"; then
  echo ""
  echo "❌ ERROR: .env.keys.temp file(s) are staged for commit!"
  echo "   These are temporary files and should NEVER be committed."
  echo ""
  echo "   Found:"
  git diff --cached --name-only | grep "\.env\.keys\.temp$"
  echo ""
  echo "   To fix:"
  echo "   git reset HEAD <file>"
  echo ""
  exit 1
fi

# Check for temporary decrypt files
if git diff --cached --name-only | grep -q "\.env\.temp$"; then
  echo ""
  echo "❌ ERROR: .env.temp file(s) are staged for commit!"
  echo "   These are temporary files and should NEVER be committed."
  echo ""
  echo "   Found:"
  git diff --cached --name-only | grep "\.env\.temp$"
  echo ""
  echo "   To fix:"
  echo "   git reset HEAD <file>"
  echo ""
  exit 1
fi

# Check for any .env files in subdirectories (not .env.dev, .env.prod, etc.)
if git diff --cached --name-only | grep -q "/\.env$"; then
  echo ""
  echo "❌ ERROR: .env file(s) are staged for commit!"
  echo "   These files contain decrypted secrets and should NEVER be committed."
  echo ""
  echo "   Found:"
  git diff --cached --name-only | grep "/\.env$"
  echo ""
  echo "   To fix:"
  echo "   git reset HEAD <file>"
  echo ""
  exit 1
fi

# Check for root .env file
if git diff --cached --name-only | grep -q "^\.env$"; then
  echo ""
  echo "❌ ERROR: Root .env file is staged for commit!"
  echo "   This file should NEVER be committed."
  echo ""
  echo "   To fix:"
  echo "   git reset HEAD .env"
  echo ""
  exit 1
fi

echo "✅ No sensitive files in staging"
exit 0
