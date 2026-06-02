# Local Notes To Issues

[![CI](https://github.com/Kkorkkk/local-notes-to-issues/actions/workflows/ci.yml/badge.svg)](https://github.com/Kkorkkk/local-notes-to-issues/actions/workflows/ci.yml)

## Overview / 项目说明

English: Local Notes To Issues turns rough notes, TODOs, bugs, ideas, labels, assignees, and priorities into GitHub-ready issue drafts. It is useful when planning work from local markdown before deciding what should become real issues.

中文：Local Notes To Issues 可以把零散笔记、TODO、BUG、IDEA、标签、负责人和优先级转换成可用于 GitHub 的 issue 草稿。它适合先在本地 markdown 中整理想法，再筛选哪些内容值得变成正式 issue。

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
