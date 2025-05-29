// services/updateUserDifficultyLevelService.js
import sequelize from "../db/db.js";
import { QueryTypes } from "sequelize";

export const updateUserDifficultyLevelWithTimeTaken = async (studentId) => {
  // Fetch quiz and time statistics
  const [quizStats] = await sequelize.query(
    `
    SELECT 
      AVG(COALESCE(total_score, 0)) AS avg_quiz_score,
      AVG(COALESCE(EXTRACT(EPOCH FROM time_taken), 0)) AS avg_quiz_time,
      AVG(COALESCE(time_allowed, 0)) AS avg_time_allowed
    FROM student_quiz_results
    LEFT JOIN quizzes q ON student_quiz_results.quiz_template_id = q.id
    WHERE student_id = :studentId
    `,
    {
      replacements: { studentId },
      type: QueryTypes.SELECT,
    }
  );

  // Fetch assignment statistics
  const [assignmentStats] = await sequelize.query(
    `
    SELECT 
      AVG(COALESCE(score, 0)) AS avg_assignment_score
    FROM student_assignments
    WHERE student_id = :studentId
    `,
    {
      replacements: { studentId },
      type: QueryTypes.SELECT,
    }
  );

  console.log("Quiz Stats:", quizStats);
  console.log("Assignment Stats:", assignmentStats);

  const { avg_quiz_score = 0, avg_quiz_time = 0, avg_time_allowed = 0 } = quizStats;
  const { avg_assignment_score = 0 } = assignmentStats; // Handle null values by defaulting to 0

  // Handle potential empty or zero values
  if (avg_quiz_time === 0) {
    console.warn("Warning: No valid quiz time data found for this student.");
  }

  if (avg_time_allowed === 0) {
    console.warn("Warning: No valid time_allowed data found for this student.");
  }

  const timePenalty = Math.max(0, (avg_quiz_time - avg_time_allowed) / avg_time_allowed); // 0 if within time, >0 if slower

  const rawDifficulty = 
    avg_quiz_score * 0.35 + 
    avg_assignment_score * 0.35 + 
    (1 - timePenalty) * 100 * 0.3;
  
  const difficulty_level = Math.max(1, Math.min(rawDifficulty / 10, 10)); // Clamp between 1–10

  console.log("Calculated Difficulty Level:", difficulty_level);
  // Update user's difficulty level
  if (!isNaN(difficulty_level)) {
    await sequelize.query(
      `
      UPDATE users
      SET difficulty_level = :difficulty
      WHERE id = :studentId
      `,
      {
        replacements: {
          studentId,
          difficulty: difficulty_level,
        },
        type: QueryTypes.UPDATE,
      }
    );
  } else {
    console.error("Invalid float for difficulty_level:", difficulty_level);
    // optionally: set a default value or skip the update
  }

  return {
    student_id: studentId,
    avg_quiz_score,
    avg_assignment_score,
    avg_quiz_time,
    avg_time_allowed,
    difficulty_level: difficulty_level,
  };
};
