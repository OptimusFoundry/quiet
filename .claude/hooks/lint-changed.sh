#!/bin/sh
# PostToolUse (Edit|Write): lint the one file that changed and feed problems back to Claude.
# Non-blocking: exit 2 on findings shows them to Claude (PostToolUse cannot undo the edit); else 0.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
file=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -n "$file" ] || exit 0
rel=${file#"$PWD"/}
case "$rel" in
  src/*.scss|src/*/*.scss|src/*/*/*.scss|src/*/*/*/*.scss)
    out=$(npx --no-install stylelint "$rel" 2>&1) || { printf 'stylelint %s\n%s\n' "$rel" "$out" >&2; exit 2; } ;;
  src/*.tsx|src/*.ts|src/*/*.tsx|src/*/*.ts|src/*/*/*.tsx|src/*/*/*.ts|src/*/*/*/*.tsx|src/*/*/*/*.ts|tests/*.ts|scripts/*.mjs)
    out=$(npx --no-install biome check "$rel" 2>&1) || { printf 'biome %s\n%s\n' "$rel" "$out" >&2; exit 2; } ;;
esac
exit 0
