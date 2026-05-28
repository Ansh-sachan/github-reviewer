import axios from "axios";

function cleanJsonResponse(text: string) {

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function reviewCode(
  formattedDiff: string
) {

  const prompt = `
You are a senior software engineer.

Review the following code changes.

Focus on:
- bugs
- security issues
- performance issues
- bad practices

IMPORTANT:
Return ONLY raw JSON.
DO NOT wrap JSON in markdown.

Format:
[
  {
    "filename": "",
    "severity": "low | medium | high",
    "issue": "",
    "best_practices": "",
    "suggestion": ""
  }
]

CODE CHANGES:
${formattedDiff}
`;

  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "qwen2.5-coder:14b",
      prompt,
      stream: false,
      format: "json"
    }
  );

  console.log(
    "AI Review Response:",
    response.data
  );

  /**
   * Clean markdown wrappers
   */
  const cleaned =
    cleanJsonResponse(
      response.data.response
    );

  /**
   * Convert string -> JS object
   */
  return JSON.parse(cleaned);
}