#!/usr/bin/env node
import { readFileSync } from "node:fs";

export function parseNotes(text) {
  const issues = [];
  let currentSection = "Inbox";
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const heading = line.match(/^#{1,3}\s+(.+)/);
    if (heading) currentSection = heading[1];
    if (!line || heading) continue;
    const todo = line.match(/^(?:[-*]\s*)?(?:\[\s\]\s*)?(TODO|FIXME|BUG|IDEA)?[:\-\s]*(.+)$/i);
    if (!todo || !/(TODO|FIXME|BUG|IDEA|\[\s\])/i.test(raw)) continue;
    const marker = (todo[1] || "todo").toLowerCase();
    let title = todo[2].replace(/@\w+/g, "").replace(/#[-\w]+/g, "").replace(/\bP[0-3]\b/i, "").trim();
    if (title.length < 4) continue;
    const labels = [
      marker === "bug" ? "bug" : null,
      marker === "idea" ? "idea" : null,
      marker === "fixme" ? "fixme" : null,
      ...[...raw.matchAll(/#([-\w]+)/g)].map((match) => match[1])
    ].filter(Boolean);
    const assignees = [...raw.matchAll(/@(\w+)/g)].map((match) => match[1]);
    const priority = raw.match(/\b(P[0-3])\b/i)?.[1]?.toUpperCase();
    const body = [`Source section: ${currentSection}`, priority ? `Priority: ${priority}` : null].filter(Boolean).join("\n");
    issues.push({ title, body, labels: labels.length ? [...new Set(labels)] : ["triage"], assignees, priority: priority || null });
  }
  return issues;
}

function quote(value) {
  return JSON.stringify(String(value));
}

export function renderGhCommands(issues) {
  return issues.map((issue) => {
    const labels = issue.labels.map((label) => ` --label ${quote(label)}`).join("");
    const assignees = issue.assignees.map((assignee) => ` --assignee ${quote(assignee)}`).join("");
    return `gh issue create --title ${quote(issue.title)} --body ${quote(issue.body)}${labels}${assignees}`;
  }).join("\n") + "\n";
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: local-notes-to-issues notes.md");
    process.exit(1);
  }
  try {
    const issues = parseNotes(readFileSync(file, "utf8"));
    console.log(process.argv.includes("--format=gh") || process.argv.includes("--gh") ? renderGhCommands(issues) : JSON.stringify(issues, null, 2));
  } catch (error) {
    console.error(`local-notes-to-issues: ${error.message}`);
    process.exit(2);
  }
}
