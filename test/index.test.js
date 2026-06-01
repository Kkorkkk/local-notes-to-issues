import test from "node:test";
import assert from "node:assert/strict";
import { parseNotes } from "../src/index.js";

test("extracts issue drafts from notes", () => {
  const issues = parseNotes("# Launch\n- TODO add screenshots\n- BUG login crashes");
  assert.equal(issues.length, 2);
  assert.deepEqual(issues[1].labels, ["bug"]);
});
