import axios from "axios";

export async function reviewCode(diff: string) {
const prompt = `
You are a senior code reviewer.

Review the git diff and return ONLY valid JSON.

Strictly follow the format below. Do not include any explanations or text outside of the JSON.
Don't include /n or any other escape characters in the JSON.

The JSON should be an array of objects, where each object represents a potential issue in the code. Each object should have the following properties:

- severity: A string that can be "low", "medium", or "high" indicating the severity of the issue.
- issue: A string describing the issue found in the code.
- suggestion: A string providing a suggestion on how to fix the issue.

DO NOT wrap response in markdown.

Format:
[
  {
    "severity": "low | medium | high",
    "issue": "",
    "suggestion": ""
  }
]

Here is the git diff to review:
\`\`\`
${diff}
\`\`\`
`;

  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "qwen2.5-coder:14b",
      prompt,
      stream: false,
    }
  );

  console.log("AI Review Response:", response.data);

  return JSON.parse(response.data.response);
}