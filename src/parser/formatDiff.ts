import { ParsedFile } from "./parser.js";

export function formatDiffForAI(
  parsedFiles: ParsedFile[]
) {

  return parsedFiles.map(file => {

    return `
====================================
FILE: ${file.file}
====================================

REMOVED CODE:
${file.removed.join("\n") || "None"}

ADDED CODE:
${file.added.join("\n") || "None"}

`;

  }).join("\n");
}