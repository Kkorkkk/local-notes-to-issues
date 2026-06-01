#!/usr/bin/env node
import { readFileSync } from "node:fs";

export function parseNotes(text) {
  const issues = [];
  let currentSection = "Inbox";
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const heading = line.match(/^#{1,3}\s+(.+)/);
    if (heading) currentSection = heading[1];
    const todo = line.match(/^(?:[-*]\s*)?(?:TODO|FIXME|BUG|IDEA)?[:\-\s]*(.+)$/i);
    if (!line || heading || !todo) continue;
    if (!/(TODO|FIXME|BUG|IDEA|\[ \]|^-\s)/i.test(raw)) continue;
    const title = todo[1].replace(/^\[ \]\s*/, "").trim();
    if (title.length < 4) continue;
    const labels = [/bug/i.test(raw) ? "bug" : null, /idea/i.test(raw) ? "idea" : null, /fixme/i.test(raw) ? "fixme" : null].filter(Boolean);
    issues.push({ title, body: `Source section: ${currentSection}`, labels: labels.length ? labels : ["triage"] });
  }
  return issues;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: local-notes-to-issues notes.md");
    process.exit(1);
  }
  console.log(JSON.stringify(parseNotes(readFileSync(file, "utf8")), null, 2));
}
