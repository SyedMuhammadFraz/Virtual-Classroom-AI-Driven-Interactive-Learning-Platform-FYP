import { generateQuizFromLlama } from '../services/groqQuizGen.js';
import { saveQuizQuestionsToDatabase, getQuizQuestionsFromDatabase } from '../services/QuizQuestionService.js';

export const generateQuizController = async (req, res) => {
  const { lessonId, lessonName, difficulty, course, studentId, quizTemplateId } = req.body;

  // Validate required fields
  if (!lessonId || !lessonName || !difficulty || !course || !studentId || !quizTemplateId) {
    return res.status(400).json({ error: 'All fields (lessonId, lessonName, difficulty, course, studentId, quizTemplateId) are required' });
  }

  try {
    // Generate the quiz using the Llama model
    const result = await generateQuizFromLlama(lessonId, lessonName, difficulty, course);

    if (!result.success) {
      return res.status(500).json({
        error: result.error || 'Unknown error',
        rawContent: result.rawContent || null
      });
    }

    // Save the generated quiz questions to the database
    await saveQuizQuestionsToDatabase(lessonId, studentId, quizTemplateId, difficulty, {
      lessonName: lessonName,
      questions: result.quiz,  // Pass the questions from Llama
    });

    // Respond with the generated quiz
    res.json({ quiz: result.quiz });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unexpected error generating quiz' });
  }
};

export const getQuizController = async (req, res) => {
  const { studentId, quizTemplateId } = req.query;

  // Validate required query parameters
  if (!studentId || !quizTemplateId) {
    return res.status(400).json({
      error: 'Query parameters studentId and quizTemplateId are required'
    });
  }

  try {
    const questions = await getQuizQuestionsFromDatabase(studentId, quizTemplateId);

    if (!questions) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(200).json({ quiz: questions });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Unexpected error fetching quiz' });
  }
};

