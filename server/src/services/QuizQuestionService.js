import QuizQuestion from "../models/quizQuestionModel.js"; // Import your model
import { QueryTypes } from 'sequelize';
import sequelize from "../db/db.js";

export const saveQuizQuestionsToDatabase = async (
  lessonId,
  studentId,
  quizTemplateId,
  difficultyLevel,
  quizData
) => {
  try {
    // Structure the quiz data to be saved in the database
    const quizQuestions = {
      student_id: studentId,
      quiz_template_id: quizTemplateId,
      difficulty_level: difficultyLevel, // Store difficulty level
      questions: quizData.questions, // Store quiz questions in jsonb format
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert the quiz questions into the database
    await QuizQuestion.create(quizQuestions);
    console.log("Quiz questions saved successfully!");
  } catch (error) {
    console.error("Error saving quiz questions to the database:", error);
    throw error; // Re-throw error to handle it in the caller
  }
};


export const getQuizQuestionsFromDatabase = async (studentId, quizTemplateId) => {
  const query = `
    SELECT questions
    FROM quiz_questions
    WHERE student_id = :studentId AND quiz_template_id = :quizTemplateId
    LIMIT 1
  `;

  const results = await sequelize.query(query, {
    replacements: { studentId, quizTemplateId },
    type: QueryTypes.SELECT,
  });

  return results.length > 0 ? results[0].questions : null;
};

