# This hook blocks commits if there are acceptance criteria from the spec still unchecked.

#!/bin/bash
cmd=$(jq -r '.tool_input.command')

# Only care about commit attempts
if [[ "$cmd" == *"git commit"* ]]; then
  branch=$(git rev-parse --abbrev-ref HEAD)
  spec="specs/${branch#feature/}.md"

  if [[ -f "$spec" ]] && grep -q '^\s*- \[ \]' "$spec"; then
    echo "Blocked: $spec still has unchecked acceptance criteria." >&2
    echo "Check off each item you've actually verified before committing." >&2
    exit 2
  fi
fi

exit 0