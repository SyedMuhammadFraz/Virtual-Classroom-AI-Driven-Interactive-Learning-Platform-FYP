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

export async function updateStudentAssignmentScore({ student_id, assignment_template_id, score }) {
  try {
    const [updatedCount, updatedRows] = await StudentAssignment.update(
      { 
        score,
        updated_at: new Date()
      },
      {
        where: { student_id, assignment_template_id },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      throw new Error('No matching student assignment found to update.');
    }

    return updatedRows[0];
  } catch (err) {
    console.error('[StudentAssignmentScoreUpdate] Error:', err.message);
    throw err;
  }
}



