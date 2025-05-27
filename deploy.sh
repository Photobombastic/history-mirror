#!/usr/bin/env bash
set -euo pipefail

# 1) Make sure your GPT key is set
if [ -z "${GPT_API_KEY:-}" ]; then
  echo "Error: please export your GPT_API_KEY first:"
  echo "  export GPT_API_KEY=sk-..." >&2
  exit 1
fi

# 2) Define paths and placeholders
EXT_ROOT="$(pwd)"
FILE="background.js"
PLACEHOLDER="YOUR_API_KEY_HERE"
ZIP_NAME="history-mirror.zip"

# 3) Inject real key into background.js (use a backup so sed -i is portable)
sed -i.bak "s|$PLACEHOLDER|$GPT_API_KEY|g" "$FILE"
rm "${FILE}.bak"

# 4) Create a ZIP of the entire extension directory
zip -r "$ZIP_NAME" . -x "*.git*" >/dev/null
echo "📦 Packaged extension as $ZIP_NAME"

# 5) Stash the key change so it doesn’t end up in Git
git stash push -u -m "temp stash: inject GPT_API_KEY" -- "$FILE" >/dev/null

# 6) Commit & push all other changes
git add -A
git commit -m "chore: update HistoryMirror extension"
git push
echo "✅ Code pushed without exposing GPT_API_KEY"

# 7) Restore your local background.js (with real key) from stash
git stash pop >/dev/null
echo "🔑 Restored local API key in $FILE"

echo "All done! Your zip is ready and your repo is clean."
