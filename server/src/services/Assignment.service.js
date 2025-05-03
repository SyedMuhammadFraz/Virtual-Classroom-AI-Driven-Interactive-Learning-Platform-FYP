import { getAssignmentFromGroq } from './assignmentGenerationService.js';
import { insertStudentAssignment } from './assignmentDB.service.js';
import sequelize from '../db/db.js';
import StudentAssignment from '../models/studentAssignment.js';
import { getStudentDifficultyLevel } from './User.service.js';

async function generateAssignmentServiceForStudent(student_id, assignment_template_id) {
  try {
    if (!assignment_template_id) {
      throw new Error("assignment_template_id is required.");
    }

    // Fetch difficulty level from user table
    const difficulty_level = await getStudentDifficultyLevel(student_id);
    const assignment_title= await getAssignmentTitleByTemplateId(assignment_template_id);

    if (!difficulty_level) {
      throw new Error("Difficulty level not found for student.");
    }

    // Generate assignment content using Groq AI
    const assignmentData = await getAssignmentFromGroq(difficulty_level, assignment_title);

    // Insert into DB
    const savedAssignment = await insertStudentAssignment({
      student_id,
      assignment_template_id,
      difficulty_level,
      content: assignmentData,
    });

    return savedAssignment;
  } catch (err) {
    console.error("[AssignmentGenService] Error:", err.message);
    throw err;
  }
}

async function getAssignmentByTemplateId(student_id, assignment_template_id) {
  const [result] = await sequelize.query(
    `SELECT * FROM student_assignments WHERE student_id = $1 AND assignment_template_id = $2`,
    {
      bind: [student_id, assignment_template_id],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return result;
}

async function saveStudentAssignmentSubmission({
  student_id,
  assignment_template_id,
  source_code,
}) {
  try {
    // Fetch the existing assignment to read its content
    const assignment = await StudentAssignment.findOne({
      where: { student_id, assignment_template_id },
    });

    if (!assignment) {
      throw new Error("No matching student assignment found to submit.");
    }

    const updatedContent = {
      ...assignment.content,
      starter_code: source_code, // Update the starter_code with submitted source
    };

    // Update the assignment using Sequelize update method
    const [updatedCount, updatedRows] = await StudentAssignment.update(
      {
        content: updatedContent,
        submitted: true,
        updated_at: new Date(),
      },
      {
        where: { student_id, assignment_template_id },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      throw new Error("Failed to update the assignment submission.");
    }

    return updatedRows[0]; // return updated assignment
  } catch (err) {
    console.error("[StudentAssignmentSubmission] Error:", err.message);
    throw err;
  }
}

async function getAssignmentTitleByTemplateId(assignment_template_id) {
  try {
    const result = await sequelize.query(
      'SELECT title FROM assignments WHERE id = :assignment_template_id',
      {
        replacements: { assignment_template_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return result[0]?.title || null;
  } catch (err) {
    console.error("[getAssignmentTitleByTemplateId] Error:", err.message);
    throw err;
  }
}

export { generateAssignmentServiceForStudent, getAssignmentByTemplateId, saveStudentAssignmentSubmission, getAssignmentTitleByTemplateId };
