export interface ParsedFile {
  file: string;
  added: string[];
  removed: string[];
}

export function parseDiff(diff: string): ParsedFile[] {

  const lines = diff.split("\n");

  const files: ParsedFile[] = [];

  let currentFile: ParsedFile | null = null;

  for (const line of lines) {

    // New file
    if (line.startsWith("diff --git")) {

      const match = line.match(/a\/(.+?)\s/);

      if (match) {

        currentFile = {
          file: match[1],
          added: [],
          removed: []
        };

        files.push(currentFile);
      }
    }

    // Ignore metadata
    if (
      line.startsWith("+++") ||
      line.startsWith("---") ||
      line.startsWith("@@") ||
      line.startsWith("index")
    ) {
      continue;
    }

    // Added lines
    if (
      line.startsWith("+") &&
      !line.startsWith("+++")
    ) {
      currentFile?.added.push(
        line.slice(1)
      );
    }

    // Removed lines
    else if (
      line.startsWith("-") &&
      !line.startsWith("---")
    ) {
      currentFile?.removed.push(
        line.slice(1)
      );
    }
  }

  return files;
}