import QuizQuestion from "../models/quizQuestionModel.js"; // Import your model
import { QueryTypes } from 'sequelize';
import sequelize from "../db/db.js";


// Controller function to save quiz questions to the database
export const saveQuizQuestionsToDatabase = async (lessonId, studentId, quizTemplateId, quizData) => {
  try {
    // Validate the incoming quiz data
    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
      throw new Error('Invalid quiz data: questions cannot be empty');
    }

    // Fetch difficulty level from user table
    const difficulty_level_student = await getStudentDifficultyLevel(student_id);

    // Structure the quiz data to be saved in the database
    const quizQuestions = {
      student_id: studentId,
      quiz_template_id: quizTemplateId,
      difficulty_level: difficulty_level_student, // Store difficulty level
      questions: quizData.questions, // Store quiz questions in jsonb format
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Save the quiz questions to the database
    await QuizQuestion.create(quizQuestions);
    console.log("Quiz questions saved successfully!");
    
    return {
      message: 'Quiz questions saved successfully',
    };
  } catch (error) {
    console.error("Error saving quiz questions to the database:", error);
    throw new Error('Error saving quiz questions to the database');
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

