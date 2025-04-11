import fetch from "node-fetch";

// Function to generate a quiz using the LLaMA model via Groq API
async function generateQuizFromLlama(lessonId, lessonName, difficulty, course) {
  const prompt = `
Generate a quiz for the lesson ID: ${lessonId} titled "${lessonName}" from the course "${course}".
The difficulty level should be "${difficulty}/10". 
The quiz should include multiple choice questions with one correct answer and several options.
The questions should match the lesson content and difficulty level.
Return ONLY the quiz as a raw JSON array in this format (no explanation, no markdown, no extra text):

[
  {
    "question": "Your question here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "Correct option here"
  }
]
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
            content: "You are a quiz generator. Output must be a valid JSON array.",
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
        quiz: [],
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    console.log(content)

    if (!content) {
      return {
        success: false,
        error: "Groq response content is empty.",
        quiz: [],
        rawContent: null,
      };
    }

    let quizData;
    try {
      quizData = JSON.parse(content);
    } catch (parseError) {
      return {
        success: false,
        error: "Failed to parse quiz JSON from Groq response",
        rawContent: content,
        quiz: [],
      };
    }

    if (!Array.isArray(quizData)) {
      return {
        success: false,
        error: "Quiz data is not in the expected array format.",
        rawContent: content,
        quiz: [],
      };
    }

    return {
      success: true,
      quiz: quizData,
      rawContent: content, // Include original response from Groq
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      quiz: [],
      rawContent: null,
    };
  }
}

export { generateQuizFromLlama };
