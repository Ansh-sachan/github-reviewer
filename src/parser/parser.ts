export function parseDiff(diff: string) {
  const lines = diff.split("\n");

  const files: any[] = [];

  let currentFile: any = null;

  for (const line of lines) {

    if (line.startsWith("diff --git")) {

      const fileName = line.split(" ")[2].replace("a/", "");

      currentFile = {
        file: fileName,
        added: [],
        removed: []
      };

      files.push(currentFile);
    }

    else if (line.startsWith("+") && !line.startsWith("+++")) {
      currentFile?.added.push(line.slice(1));
    }

    else if (line.startsWith("-") && !line.startsWith("---")) {
      currentFile?.removed.push(line.slice(1));
    }
  }

  return files;
}