#!/usr/bin/env sh
# Replaces CSS and JavaScript URL versions with hashes of their current content.
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$project_dir"

file_hash() {
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" | awk '{print substr($1, 1, 12)}'
    else
        shasum -a 256 "$1" | awk '{print substr($1, 1, 12)}'
    fi
}

css_version=$(file_hash style.css)
script_version=$(file_hash script.js)
temporary_index=$(mktemp)

sed -E \
    -e "s|(href=\"style\.css)(\?v=[^\"]*)?(\")|\\1?v=${css_version}\\3|" \
    -e "s|(src=\"script\.js)(\?v=[^\"]*)?(\")|\\1?v=${script_version}\\3|" \
    index.html > "$temporary_index"

mv "$temporary_index" index.html
