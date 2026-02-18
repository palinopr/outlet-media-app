---
name: shell-scripting
description: Practical bash scripting guidance emphasising defensive programming, ShellCheck compliance, and simplicity. Use when writing shell scripts that need to be reliable and maintainable.
---

# Bash Scripting Best Practices

Guidance for writing reliable, maintainable bash scripts following modern best practices. Emphasises simplicity, automated tooling, and defensive programming without over-engineering.

## When to Use Shell (and When Not To)

### Use Shell For:
- Small utilities and simple wrapper scripts (<100 lines)
- Orchestrating other programmes and tools
- Simple automation tasks
- Build/deployment scripts with straightforward logic
- Quick data transformation pipelines

### Do NOT Use Shell For:
- Complex business logic or data structures
- Performance-critical code
- Scripts requiring extensive error handling
- Anything over ~100 lines or with non-straightforward control flow
- When you need proper data structures beyond arrays

**Critical**: If your script grows too large (1000+ lines) or complex, consider rewriting it in a proper language (Python, Go, etc.) before it becomes unmaintainable.

## Mandatory Foundations

Every bash script must have these elements:

### 1. Proper Shebang
```bash
#!/usr/bin/env bash
```
Portable across systems where bash may not be at `/bin/bash` (macOS, BSD, NixOS).

### 2. Strict Mode
```bash
set -euo pipefail
```
- `-e`: Exit immediately if any command fails
- `-u`: Treat unset variables as errors
- `-o pipefail`: Pipe fails if ANY command in pipeline fails

### 3. ShellCheck Compliance
Run ShellCheck on every script before committing:
```bash
shellcheck script.sh
```
Fix all warnings. ShellCheck catches unquoted variables, deprecated syntax, common bugs, and portability issues.

### 4. Basic Script Structure
```bash
#!/usr/bin/env bash
set -euo pipefail

# Brief description of what this script does

die() {
    echo "Error: ${1}" >&2
    exit 1
}

# Your code here
```

## Core Safety Patterns

### Always Quote Variables
```bash
# Wrong - dangerous
cp $source $destination

# Correct - safe
cp "${source}" "${destination}"
```

### Check Required Variables
```bash
: "${REQUIRED_VAR:?REQUIRED_VAR must be set}"
: "${DATABASE_URL:?DATABASE_URL is required. Set it in .env}"
```

### Validate Inputs
```bash
[[ -f "${config_file}" ]] || die "Config file not found: ${config_file}"
command -v jq >/dev/null 2>&1 || die "jq is required but not installed"
[[ -d "${target_dir}" ]] || die "Directory does not exist: ${target_dir}"
```

## Essential Patterns

### Simple Script Template
```bash
#!/usr/bin/env bash
set -euo pipefail

die() {
    echo "Error: ${1}" >&2
    exit 1
}

command -v jq >/dev/null 2>&1 || die "jq required"

[[ $# -eq 1 ]] || die "Usage: ${0} <logfile>"
logfile="${1}"
[[ -f "${logfile}" ]] || die "File not found: ${logfile}"

grep ERROR "${logfile}" | jq -r '.message'
```

### Cleanup on Exit
```bash
tmpdir=$(mktemp -d)
trap 'rm -rf "${tmpdir}"' EXIT
```

### Safe Function Definition
```bash
check_dependency() {
    local cmd="${1}"
    command -v "${cmd}" >/dev/null 2>&1 || die "${cmd} not installed"
}

process_file() {
    local file="${1}"
    local output="${2}"
    [[ -f "${file}" ]] || die "Input file missing: ${file}"
    sed 's/foo/bar/g' "${file}" > "${output}"
}
```

Declare and set variables from command substitution separately to catch errors:
```bash
# Wrong - hides errors
local result="$(failing_command)"

# Correct - catches errors
local result
result="$(failing_command)"
```

### Safe Array Handling
```bash
declare -a files=("file one.txt" "file two.txt")

for file in "${files[@]}"; do
    echo "Processing: ${file}"
done

mapfile -t lines < <(grep pattern "${file}")
```

### Conditional Testing
```bash
[[ -f "${file}" ]]          # File exists
[[ -d "${dir}" ]]           # Directory exists
[[ -z "${var}" ]]           # String is empty
[[ -n "${var}" ]]           # String is not empty
[[ "${a}" == "${b}" ]]      # String equality
(( count > 0 ))             # Numeric comparison
```

### Simple Argument Handling
```bash
# Positional arguments for 1-3 args
[[ $# -eq 2 ]] || die "Usage: ${0} <source> <dest>"
source="${1}"
dest="${2}"

# Environment variables instead of complex flag parsing
VERBOSE="${VERBOSE:-false}"
DRY_RUN="${DRY_RUN:-false}"
# Run like: VERBOSE=true DRY_RUN=true ./script.sh input.txt
```

### Process Substitution Over Temp Files
```bash
# Instead of temp files:
second_command <(first_command)
diff <(sort file1.txt) <(sort file2.txt)
```

### Prefer Builtins Over External Commands
```bash
filename="${path##*/}"           # basename
dirname="${path%/*}"             # dirname
extension="${filename##*.}"      # get extension
count=$(( count + 1 ))           # arithmetic
length="${#string}"              # string length
```

### Main Function Pattern (50+ line scripts)
```bash
setup() { command -v jq >/dev/null 2>&1 || die "jq required"; }
process() { log "Processing data"; }
cleanup() { log "Cleanup complete"; }

main() {
    setup
    process
    cleanup
}

main "${@}"
```

### Dry-Run Pattern
```bash
DRY_RUN="${DRY_RUN:-false}"

run() {
    if [[ "${DRY_RUN}" == "true" ]]; then
        echo "[DRY RUN] ${*}" >&2
        return 0
    fi
    "${@}"
}

run cp "${source}" "${dest}"
# Usage: DRY_RUN=true ./script.sh
```

### Safe While Loop Reading
```bash
# Wrong - variables modified in subshell are lost
count=0
cat file.txt | while read -r line; do
    (( count++ ))
done
echo "${count}"  # Will be 0!

# Correct
count=0
while read -r line; do
    (( count++ ))
done < <(cat file.txt)
```

## Style Guidelines

- **Indentation**: 2 spaces, never tabs
- **Line length**: Maximum 120 characters
- Functions: `lowercase_with_underscores`
- Local variables: `lowercase_with_underscores`
- Constants/env vars: `UPPERCASE_WITH_UNDERSCORES`
- Executables: `.sh` extension or no extension; libraries: always `.sh`

## What to Avoid

```bash
# Don't use backticks - use $()
output=`command`     # Old style
output=$(command)    # Correct

# Don't use eval
eval "${user_input}"  # Dangerous!

# Don't use [ ] when [[ ]] is available
[ -f "${file}" ]      # POSIX, less features
[[ -f "${file}" ]]    # Bash, safer

# Don't glob or split unquoted
rm ${files}           # DANGEROUS
rm "${files}"         # Safe

# Don't use ls output in scripts
for file in $(ls); do  # Breaks with spaces
for file in *; do      # Correct
```

## Complexity Warning Signs

If your script has any of these, consider rewriting in Python/Go:
- More than 100 lines
- Complex data structures beyond simple arrays
- Nested loops over arrays of arrays
- Heavy string manipulation
- Mathematical calculations beyond basic arithmetic
- Need for unit testing individual functions
- JSON/YAML parsing beyond simple jq queries

## Quick Reference Checklist

- [ ] ShellCheck passes with no warnings
- [ ] Has proper shebang (`#!/usr/bin/env bash`)
- [ ] Has strict mode (`set -euo pipefail`)
- [ ] All variables quoted (`"${var}"`)
- [ ] Required dependencies checked
- [ ] Proper error messages to stderr
- [ ] Cleanup trap if using temp files
- [ ] Script is idempotent where possible
- [ ] Under 100 lines (or has strong justification)
- [ ] Uses `command -v` not `which`
- [ ] Arrays used for lists with spaces
- [ ] No `eval`, `ls` parsing, or backticks
- [ ] Functions have local variables
