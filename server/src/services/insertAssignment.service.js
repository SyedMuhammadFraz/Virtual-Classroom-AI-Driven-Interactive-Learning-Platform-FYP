import { getAssignmentFromGroq } from './assignmentGenerationService.js';
import { insertStudentAssignment } from './assignmentDB.service.js';

async function generateAssignmentServiceForStudent(student_id, assignment_template_id, difficulty_level) {
  try {
    if(!assignment_template_id || !difficulty_level) {
      throw new Error('assignment_template_id and difficulty_level are required.');
    }
    const assignmentData = await getAssignmentFromGroq(difficulty_level);

    const savedAssignment = await insertStudentAssignment({
      student_id,
      assignment_template_id,
      difficulty_level,
      content: assignmentData,
    });

    return savedAssignment;
  } catch (err) {
    console.error('[AssignmentGenService] Error:', err.message);
    throw err;
  }
}

export { generateAssignmentServiceForStudent };

