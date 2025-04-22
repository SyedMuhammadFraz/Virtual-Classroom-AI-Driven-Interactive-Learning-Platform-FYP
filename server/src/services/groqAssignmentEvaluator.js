import fetch from "node-fetch";

/**
 * Parse the raw LLaMA response to extract score, feedback, and test status.
 * @param {string} rawContent
 * @returns {{ score: number|null, feedback: string, wouldPassTests: boolean }}
 */
function parseEvaluationResponse(rawContent) {
  const scoreMatch = rawContent.match(/^(\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

  const feedback = rawContent.replace(/^(\d+)\s*/, "").trim();

  const wouldPassTests = /pass basic test cases\s*yes/i.test(rawContent);

  return { score, feedback, wouldPassTests };
}

/**
 * Evaluates a student's assignment using Groq + LLaMA 3.
 * @param {string} sourceCode - The student's submitted code.
 * @param {string} questionPrompt - The original assignment prompt.
 * @param {string} [expectedOutput] - (Optional) Expected output for context.
 * @returns {Object} Evaluation result including success, score, feedback, and raw content.
 */
async function evaluateAssignmentWithLlama(sourceCode, questionPrompt, expectedOutput = "") {
  const prompt = `
You are an expert code evaluator.

Evaluate the following student submission for this coding assignment.

Assignment Prompt:
"${questionPrompt}"

Student Code:
\`\`\`js
${sourceCode}
\`\`\`

${expectedOutput ? `Expected Output:\n\`\`\`\n${expectedOutput}\n\`\`\`` : ""}

Please provide:
1. A score out of 10
2. Detailed feedback on correctness, style, and edge cases
3. Suggestions for improvement
4. Whether the code would pass basic test cases (yes/no)

Return ONLY the result in plain text format. Do not include any markdown formatting or extra commentary.

`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a code evaluator. Respond with plain text only, no markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Groq API Error ${response.status}: ${errorText}`,
        score: null,
        feedback: null,
        wouldPassTests: false,
        rawContent: null,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "Groq response content is empty.",
        score: null,
        feedback: null,
        wouldPassTests: false,
        rawContent: null,
      };
    }

    const parsed = parseEvaluationResponse(content);

    return {
      success: true,
      score: parsed.score,
      feedback: parsed.feedback,
      wouldPassTests: parsed.wouldPassTests,
      rawContent: content,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      score: null,
      feedback: null,
      wouldPassTests: false,
      rawContent: null,
    };
  }
}

export { evaluateAssignmentWithLlama };
