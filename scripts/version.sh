#!/bin/sh
# version.sh - Generates a version file for an Angular project.

# The directory where this script is located.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Output relative to this script's location.
OUT_FILE="../client/environments/version.ts"

if [ ! -e "$(which git)" ]
then
  echo "git binary not found"
  exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git rev-parse HEAD)
SHORT=$(git rev-parse --short HEAD)

if git describe 2>&1 > /dev/null
then
  TAG=$(git describe --abbrev=0)
  STRING=$(git describe --dirty='*')
else
  TAG=v0.0.0
  STRING=v0.0.0-$SHORT*
fi

cat > "$SCRIPT_DIR/$OUT_FILE" <<VERSIONFILE
export const VERSION = {
  tag: '$TAG',
  branch: '$BRANCH',
  commit: '$COMMIT',
  short: '$SHORT',
  string: '$STRING',
}
VERSIONFILE
