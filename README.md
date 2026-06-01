# Local Notes To Issues

Turn messy notes into GitHub-ready issue drafts.

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
