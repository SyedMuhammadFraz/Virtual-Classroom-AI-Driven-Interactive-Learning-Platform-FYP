// services/updateStudentCourseResultService.js
import sequelize from "../db/db.js"; // Import your Sequelize instance
import { QueryTypes } from "sequelize";

export const updateStudentCourseResult = async (studentId, courseId) => {
  // Fetch average quiz score
  const [quizResult] = await sequelize.query(
    `
  SELECT AVG(qr.total_score) as avg_quiz_score
FROM student_quiz_results qr
JOIN quizzes q ON qr.quiz_template_id = q.id  
JOIN lessons l ON q.lesson_id = l.id
WHERE qr.student_id = :studentId
AND l.course_id = :courseId;


  `,
    {
      replacements: { studentId, courseId },
      type: QueryTypes.SELECT,
    }
  );

  // Fetch average assignment score
  const [assignmentResult] = await sequelize.query(
    `
    SELECT AVG(score) as avg_assignment_score
    FROM student_assignments sa
    JOIN assignments a ON sa.assignment_template_id = a.id
    JOIN lessons l ON a.lesson_id = l.id
    WHERE student_id = :studentId AND course_id = :courseId
  `,
    {
      replacements: { studentId, courseId },
      type: QueryTypes.SELECT,
    }
  );

  const avgQuiz = quizResult.avg_quiz_score || 0;
  const avgAssignment = assignmentResult.avg_assignment_score || 0;

  // Upsert into student_course_results
  await sequelize.query(
    `
    INSERT INTO student_course_results (student_id, course_id, average_quiz_score, average_assignment_score)
    VALUES (:studentId, :courseId, :avgQuiz, :avgAssignment)
    ON CONFLICT (student_id, course_id)
    DO UPDATE SET
      average_quiz_score = :avgQuiz,
      average_assignment_score = :avgAssignment,
      updated_at = NOW()
  `,
    {
      replacements: { studentId, courseId, avgQuiz, avgAssignment },
      type: QueryTypes.INSERT,
    }
  );

  return { avgQuiz, avgAssignment };
};
