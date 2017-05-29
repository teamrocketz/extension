#!/bin/bash
#
# Install Pomander-Rockets as a pre-commit hook
#
# Regular HR Pomander, modified to use local eslint rather than global eslint exec
# for compatibility w/Airbnb eslint config files

set -e

git rev-parse --is-inside-work-tree &> /dev/null
if [[ "$?" > 0 ]]; then
  echo "Pomander-Airbnb install failed: Not a git repository"
  exit 1
fi

ROOT_DIR=$(git rev-parse --show-toplevel)

cd "$ROOT_DIR/.git/hooks"
rm -f pre-commit
cp "$ROOT_DIR/pomander/pomander-airbnb.sh" pre-commit
chmod +x pre-commit
echo "Pomander-Airbnb installed successfully."
exit 0
