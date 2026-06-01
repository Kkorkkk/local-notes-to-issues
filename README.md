# Local Notes To Issues

[![CI](https://github.com/Kkorkkk/local-notes-to-issues/actions/workflows/ci.yml/badge.svg)](https://github.com/Kkorkkk/local-notes-to-issues/actions/workflows/ci.yml)

Turn messy notes into GitHub-ready issue drafts.

## Install

```bash
npx local-notes-to-issues examples/notes.md
npm install -g local-notes-to-issues
local-notes-to-issues examples/notes.md
```

## Quick start

```bash
npm install
npm test
node src/index.js examples/notes.md > issues.json
node src/index.js examples/notes.md --gh > create-issues.sh
```

The output can be imported by a script or pasted into GitHub issue creation tools. It extracts `TODO`, `FIXME`, `BUG`, `IDEA`, unchecked tasks, `#labels`, `@assignees`, and `P0`-`P3` priority markers.

## Limits

Plain bullet lists are ignored so ordinary notes do not become accidental issues.

`--gh` output uses single-quoted shell arguments so `$` and backticks in note text are not expanded by your shell.

## Status

Experimental 0.1 CLI. The tool is small on purpose, with no runtime dependencies. Review generated commands, code, and reports before using them in production workflows.
