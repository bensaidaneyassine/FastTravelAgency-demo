DEMO README
============

This document explains how to create a demo repository from the current project and enable Code Scanning so SARIF uploads from CI are accepted.

Steps
-----

1. Ensure `gh` CLI is installed and authenticated: `gh auth login`.
2. Run the helper script in the repository root:

```bash
./.github/scripts/create_demo_repo.sh MyDemoRepo public
```

3. Open the new repo on GitHub, enable Code Scanning in Settings → Security → Code scanning.
4. Push a small change or re-run the `myCI` workflow to produce SARIF and verify Code Scanning alerts appear.

Notes
-----
- The script creates a sanitized copy (removes `.env*`, `vendor`, `node_modules`, `storage`). Edit the script to change what is removed.
- You must have permission to create a repo under your GitHub account.
