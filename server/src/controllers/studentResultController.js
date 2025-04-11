import StudentQuizResult from "../models/studentQuizResult.js"; // Import your model for student_quiz_results

export const saveStudentQuizResultController = async (req, res) => {
  const {
    studentId,
    quizTemplateId,
    totalScore,
    scorePercentage,
    questionsAnswered,
    timeTaken,
    completionStatus,
  } = req.body;

  // Validate required fields
  if (
    !studentId ||
    !quizTemplateId ||
    !questionsAnswered ||
    !completionStatus
  ) {
    return res.status(400).json({
      error:
        "The following fields are required: studentId, quizTemplateId, questionsAnswered, completionStatus",
    });
  }

  try {
    // Create a new student quiz result entry
    const newQuizResult = await StudentQuizResult.create({
      student_id: studentId,
      quiz_template_id: quizTemplateId || null, // quiz_template_id is optional
      total_score: totalScore || null, // Optional
      score_percentage: scorePercentage || null, // Optional
      questions_answered: questionsAnswered, // Required as JSONB
      time_taken: timeTaken || null, // Optional
      completion_status: completionStatus, // Required
    });

    // Respond with the saved quiz result
    res.status(201).json({
      success: true,
      message: "Quiz result saved successfully!",
      quizResult: newQuizResult,
    });
  } catch (error) {
    console.error("Error saving student quiz result:", error);
    res.status(500).json({
      error: "An error occurred while saving the quiz result.",
      details: error.message,
    });
  }
};
