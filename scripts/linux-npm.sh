#!/usr/bin/env bash
# Run with: bash scripts/linux-npm.sh ci | run dev | run build
set -euo pipefail
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$root"
if ! mountpoint -q -- "$root/node_modules"; then
  echo 'STOP: node_modules is not a mount point. Read LINUX-HANDOFF.md before using npm.' >&2
  exit 1
fi
fstype="$(findmnt -n -o FSTYPE -T "$root/node_modules")"
case "$fstype" in
  ntfs*|fuse*|exfat|vfat)
    echo "STOP: node_modules is on $fstype; bind mount a Linux-native directory first." >&2
    exit 1
    ;;
esac
export HUGO_CACHEDIR="${XDG_CACHE_HOME:-$HOME/.cache}/blog-website/hugo"
mkdir -p "$HUGO_CACHEDIR"

# Codex Desktop and other tools may prepend their own Node runtime to PATH.
# Use Arch's Node/npm explicitly so this project stays on the supported Node 22.
system_node=/usr/bin/node
system_npm=/usr/bin/npm
if [[ ! -x "$system_node" || ! -x "$system_npm" ]]; then
  echo 'STOP: system Node.js/npm is missing. Install nodejs-lts-jod and npm first.' >&2
  exit 1
fi
node_version="$($system_node --version)"
node_major="${node_version#v}"
node_major="${node_major%%.*}"
if (( node_major < 22 )); then
  echo "STOP: Node.js 22 or newer is required; found $node_version." >&2
  exit 1
fi
export PATH="/usr/bin:$PATH"
exec "$system_npm" "$@"
