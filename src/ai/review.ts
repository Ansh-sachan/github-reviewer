import axios from "axios";

export async function reviewCode(diff: string) {
  const prompt = `
You are a senior software engineer.

Review this git diff.
Find:
- bugs
- performance issues
- security issues
- bad practices

Return concise review comments.

Diff:
${diff}
`;

  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "qwen2.5-coder:7b",
      prompt,
      stream: false,
    }
  );

  return response.data.response;
}