import { generateQuizFromLlama } from '../services/groqQuizGen.js';
import { saveQuizQuestionsToDatabase, getQuizQuestionsFromDatabase } from '../services/QuizQuestionService.js';
import QuizQuestion from "../models/quizQuestionModel.js";
import { getStudentDifficultyLevel } from "../services/User.service.js";
import StudentQuizResult from "../models/studentQuizResultModel.js";
import Sequelize from 'sequelize';
export const generateQuizController = async (req, res) => {
  const { lessonId, lessonName, course, quizTemplateId } = req.body;
  // Validate required fields
  if (!lessonId || !lessonName || !course || !quizTemplateId) {
    return res.status(400).json({ error: 'All fields (lessonId, lessonName,course, quizTemplateId) are required' });
  }

  try {

    const difficulty_level = await getStudentDifficultyLevel(req.user.id)
    // Generate the quiz using the Llama model
    const result = await generateQuizFromLlama(lessonId, lessonName, difficulty_level, course);
    
    if (!result.success) {
      return res.status(500).json({
        error: result.error || 'Unknown error',
        rawContent: result.rawContent || null
      });
    }
    console.log(result.quiz);
    // Save the generated quiz questions to the database
    await saveQuizQuestionsToDatabase(lessonId, req.user.id, quizTemplateId, {
      lessonName: lessonName,
      questions: result.quiz,  // result.quiz contains the questions
    });


    // Respond with the generated quiz
    res.json({ quiz: result.quiz });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unexpected error generating quiz' });
  }
};

export const getQuizController = async (req, res) => {

  const {quizTemplateId } = req.body;

  // Validate required query parameters
  if (!quizTemplateId) {
    return res.status(400).json({
      error: 'Query parameters  quizTemplateId are required'
    });
  }

  try {
    const questions = await getQuizQuestionsFromDatabase(req.user.id, quizTemplateId);

    if (!questions) {
      return res.status(404).json({ error: 'Quiz not found ' });
    }

    res.status(200).json({ quiz: questions });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Unexpected error fetching quiz' });
  }
};
export const getQuizData = async (req, res) => {
  try {
    // Remove studentId check since we are fetching data for all students
    const results = await StudentQuizResult.findAll({
      attributes: [
        'student_id',  // Include student_id in the result to know which student the score belongs to
        'quiz_template_id',
        [Sequelize.fn('SUM', Sequelize.col('score_percentage')), 'total_score_percentage'],
      ],
      group: ['student_id', 'quiz_template_id'], // Group by both student_id and quiz_template_id
    });

    res.status(200).json({
      message: 'Quiz data fetched successfully.',
      data: results,
    });
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    res.status(500).json({ error: 'Failed to fetch quiz data.' });
  }
};
