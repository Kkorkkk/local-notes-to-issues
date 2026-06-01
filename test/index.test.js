import test from "node:test";
import assert from "node:assert/strict";
import { parseCliArgs, parseNotes, renderGhCommands } from "../src/index.js";

test("extracts issue drafts from notes", () => {
  const issues = parseNotes("# Launch\n- plain list item\n- TODO add screenshots #docs @user-name P1\n- BUG login crashes");
  assert.equal(issues.length, 2);
  assert.deepEqual(issues[1].labels, ["bug"]);
  assert.deepEqual(issues[0].assignees, ["user-name"]);
  assert.equal(issues[0].priority, "P1");
  assert.match(renderGhCommands(issues), /gh issue create/);
  assert.doesNotMatch(renderGhCommands([{ title: "cost $5", body: "run `bad`", labels: ["triage"], assignees: [] }]), /"cost \$5"/);
  assert.deepEqual(parseCliArgs(["notes.md", "--gh"]), { file: "notes.md", gh: true });
  assert.throws(() => parseCliArgs([]), /Usage:/);
});

test("keeps email addresses while removing hyphenated assignees from titles", () => {
  const issues = parseNotes("# Support\n- TODO email user@example.com about follow up @user-name #support P2");
  assert.equal(issues[0].title, "email user@example.com about follow up");
  assert.deepEqual(issues[0].assignees, ["user-name"]);
});
