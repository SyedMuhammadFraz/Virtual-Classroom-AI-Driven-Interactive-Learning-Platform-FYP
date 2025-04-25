import axios from "axios";

// Utility function to check if a string is valid JSON
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export async function getAssignmentFromGroq(difficulty_level, title) {
  const prompt = `
  Generate a coding assignment titled "${title}" at difficulty level ${difficulty_level} out of 10. The assignment should include:
  
  1. A clear and concise problem statement.
  2. Sample input.
  3. Starter code in any programming language.
  4. Expected output.
  
  Respond strictly in JSON format as follows:
  
  {
    "problem": "Problem statement here",
    "input": "Sample input",
    "starter_code": "Starter code in any language",
    "expected_output": "Expected output"
  }
  
  Do not include any explanations or extra text — only the JSON object.
  `;

  try {
    // Send request to Groq API
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    // Inspect raw response
    const content = response.data.choices[0].message.content;
    console.log("Raw response from AI:", content);

    // Trim the content and check if it's valid JSON
    const trimmedContent = content.trim().replace(/^\uFEFF/, ""); // Remove BOM if present
    if (isValidJSON(trimmedContent)) {
      const parsedContent = JSON.parse(trimmedContent);
      return parsedContent;
    } else {
      throw new Error("Invalid JSON response from AI");
    }
  } catch (error) {
    // Log the error and throw a descriptive message
    console.error("[getAssignmentFromGroq] Error:", error.message);
    throw new Error("Failed to generate or parse assignment from Groq");
  }
}
