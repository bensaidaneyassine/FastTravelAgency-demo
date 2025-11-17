#!/usr/bin/env bash
set -euo pipefail

# create_demo_repo.sh
# Prepare a sanitized copy of the current repository and create a new GitHub
# repository (using `gh`) then push the sanitized repo as `main`.
#
# Requirements:
# - gh CLI installed and authenticated (run `gh auth login`)
# - jq (optional, for nicer output)
#
# Usage: ./create_demo_repo.sh [demo-repo-name] [public|private]

REPO_NAME=${1:-FastTravelAgency-demo}
VISIBILITY=${2:-public}

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install it: https://cli.github.com/"
  exit 1
fi

echo "Checking gh authentication..."
if ! gh auth status >/dev/null 2>&1; then
  echo "gh is not authenticated. Run: gh auth login"
  exit 1
fi

USER=$(gh api user --jq .login)
echo "Authenticated as $USER"

TMPDIR=$(mktemp -d)
echo "Creating sanitized export in $TMPDIR"

# Export current HEAD into tmpdir
(cd "$PWD" && git archive --format=tar HEAD) | (cd "$TMPDIR" && tar xf -)

cd "$TMPDIR"

echo "Removing sensitive/unnecessary files from demo copy"
# Remove environment files and local build artefacts
find . -type f -name '.env*' -delete || true
find . -type d -name 'node_modules' -prune -exec rm -rf {} + || true
rm -rf vendor || true
rm -rf storage || true
rm -rf .git || true

echo "Initializing new git repository"
git init -b main
git add .
git commit -m "chore(demo): sanitized demo copy"

echo "Creating GitHub repository ${USER}/${REPO_NAME} (visibility: ${VISIBILITY})"
if [ "$VISIBILITY" = "private" ]; then
  gh repo create "${USER}/${REPO_NAME}" --private --confirm
else
  gh repo create "${USER}/${REPO_NAME}" --public --confirm
fi

echo "Pushing demo repo to GitHub"
git remote add origin "git@github.com:${USER}/${REPO_NAME}.git"
git push -u origin main

cat <<EOF
Demo repository created: https://github.com/${USER}/${REPO_NAME}

Next steps:
- In the new repo, go to Settings → Security → Code scanning and enable Code Scanning (CodeQL or allow SARIF uploads).
- Re-run the `myCI` workflow (push a small commit) to generate SARIF and populate Code scanning alerts.

NOTE: This script creates a sanitized copy. If you need additional files removed
or included, edit the script to adjust removal rules before running.
EOF
