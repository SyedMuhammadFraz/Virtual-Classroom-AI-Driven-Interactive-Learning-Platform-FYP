import StudentQuizResult from "../models/studentQuizResultModel.js"; // Import your model for student_quiz_results
import { updateUserDifficultyLevelWithTimeTaken } from "../services/updateDifficultyStatus.js";
import { updateStudentCourseResult } from "../services/updateStudentCourseResultService.js";

export const saveStudentQuizResultController = async (req, res) => {
  const {
    quizTemplateId,
    totalScore,
    scorePercentage,
    questionsAnswered,
    timeTaken,
    completionStatus,
  } = req.body;

  // Validate required fields
  if (
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
      student_id: req.user.id,
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

export const updateStudentCourseResultController = async (req, res) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      error: 'studentId and courseId are required'
    });
  }

  try {
    const result = await updateStudentCourseResult(studentId, courseId);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Student course result updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating student course result:', error);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      error: 'Failed to update student course result'
    });
  }
};

export const updateDifficultyController = async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required in the URL parameters.' });
  }

  try {
    const result = await updateUserDifficultyLevelWithTimeTaken(studentId);
    res.status(200).json({
      message: 'Difficulty level updated successfully.',
      data: result,
    });
  } catch (error) {
    console.error('Error updating difficulty level:', error);
    res.status(500).json({ error: 'Failed to update difficulty level' });
  }
};