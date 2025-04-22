import StudentAssignment from '../models/studentAssignment.js';

export async function insertStudentAssignment({
  student_id,
  assignment_template_id,
  difficulty_level,
  content,
}) {
  const result = await StudentAssignment.create({
    student_id,
    assignment_template_id,
    difficulty_level,
    content,
    score: 0,
    submitted: false,
    created_at: new Date(),
    updated_at: new Date()
  });

  return result; // Sequelize instance (can use .toJSON() if needed)
}
