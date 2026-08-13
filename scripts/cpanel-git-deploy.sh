#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${SOURCE_DIR:-/home/fluxrcoz/fluxr.co.za-source}"
PUBLIC_DIR="${PUBLIC_DIR:-/home/fluxrcoz/public_html}"
BRANCH="${BRANCH:-main}"
REMOTE="${REMOTE:-origin}"
LOG_FILE="${LOG_FILE:-/home/fluxrcoz/fluxr-co-za-deploy.log}"
LOCK_DIR="${LOCK_DIR:-/tmp/fluxr-co-za-deploy.lock}"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" >> "$LOG_FILE"
}

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  log "another deployment is already running"
  exit 0
fi
trap 'rmdir "$LOCK_DIR"' EXIT

cd "$SOURCE_DIR"

log "fetching $REMOTE/$BRANCH"
git fetch --prune "$REMOTE" "$BRANCH" >> "$LOG_FILE" 2>&1
git reset --hard "$REMOTE/$BRANCH" >> "$LOG_FILE" 2>&1

log "syncing approved public files into $PUBLIC_DIR"
git ls-files -z |
  while IFS= read -r -d '' path; do
    case "$path" in
      assets/*)
        printf '%s\0' "$path"
        ;;
      agents/*.html)
        printf '%s\0' "$path"
        ;;
      */*)
        ;;
      .htaccess|*.html|*.css|*.js|*.png|*.jpg|*.jpeg|*.gif|*.svg|*.webp|*.ico|*.txt)
        printf '%s\0' "$path"
        ;;
    esac
  done |
  rsync -a --from0 --files-from=- "$SOURCE_DIR"/ "$PUBLIC_DIR"/ >> "$LOG_FILE" 2>&1

rm -rf \
  "$PUBLIC_DIR/src" \
  "$PUBLIC_DIR/scripts" \
  "$PUBLIC_DIR/package.json" \
  "$PUBLIC_DIR/package-lock.json" \
  "$PUBLIC_DIR/README.md" \
  "$PUBLIC_DIR/AGENT_PAGE.md" \
  "$PUBLIC_DIR/CPANEL_CICD.md"

log "deployment complete at $(git rev-parse --short HEAD)"
