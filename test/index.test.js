import test from "node:test";
import assert from "node:assert/strict";
import { parseNotes, renderGhCommands } from "../src/index.js";

test("extracts issue drafts from notes", () => {
  const issues = parseNotes("# Launch\n- plain list item\n- TODO add screenshots #docs @einek P1\n- BUG login crashes");
  assert.equal(issues.length, 2);
  assert.deepEqual(issues[1].labels, ["bug"]);
  assert.deepEqual(issues[0].assignees, ["einek"]);
  assert.equal(issues[0].priority, "P1");
  assert.match(renderGhCommands(issues), /gh issue create/);
});
