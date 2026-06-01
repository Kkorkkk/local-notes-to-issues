#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

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
    let title = todo[2]
      .replace(/(^|\s)@[A-Za-z0-9-]+/g, " ")
      .replace(/(^|\s)#[-\w]+/g, " ")
      .replace(/\bP[0-3]\b/i, "")
      .replace(/\s+/g, " ")
      .trim();
    if (title.length < 4) continue;
    const labels = [
      marker === "bug" ? "bug" : null,
      marker === "idea" ? "idea" : null,
      marker === "fixme" ? "fixme" : null,
      ...[...raw.matchAll(/#([-\w]+)/g)].map((match) => match[1])
    ].filter(Boolean);
    const assignees = [...raw.matchAll(/(?:^|\s)@([A-Za-z0-9-]+)/g)].map((match) => match[1]);
    const priority = raw.match(/\b(P[0-3])\b/i)?.[1]?.toUpperCase();
    const body = [`Source section: ${currentSection}`, priority ? `Priority: ${priority}` : null].filter(Boolean).join("\n");
    issues.push({ title, body, labels: labels.length ? [...new Set(labels)] : ["triage"], assignees, priority: priority || null });
  }
  return issues;
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

export function renderGhCommands(issues) {
  return issues.map((issue) => {
    const labels = issue.labels.map((label) => ` --label ${shellQuote(label)}`).join("");
    const assignees = issue.assignees.map((assignee) => ` --assignee ${shellQuote(assignee)}`).join("");
    return `gh issue create --title ${shellQuote(issue.title)} --body ${shellQuote(issue.body)}${labels}${assignees}`;
  }).join("\n") + "\n";
}

export function parseCliArgs(args) {
  const file = args.find((arg) => !arg.startsWith("--"));
  if (!file) throw new Error("Usage: local-notes-to-issues notes.md [--gh]");
  return { file, gh: args.includes("--format=gh") || args.includes("--gh") };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { file, gh } = parseCliArgs(process.argv.slice(2));
    const issues = parseNotes(readFileSync(file, "utf8"));
    console.log(gh ? renderGhCommands(issues) : JSON.stringify(issues, null, 2));
  } catch (error) {
    console.error(`local-notes-to-issues: ${error.message}`);
    process.exit(2);
  }
}
