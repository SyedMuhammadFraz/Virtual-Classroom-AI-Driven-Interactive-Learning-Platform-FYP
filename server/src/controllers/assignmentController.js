import { updateStudentAssignmentScore } from "../services/assignmentDB.service.js";
import { evaluateAssignmentWithLlama } from "../services/groqAssignmentEvaluator.js";
import { generateAssignmentServiceForStudent, getAssignmentByTemplateId, saveStudentAssignmentSubmission } from "../services/Assignment.service.js";

async function generateAssignmentForStudent(req, res) {
  const { student_id, assignment_template_id } = req.body;

  // Basic input validation (you can use a library like Joi or express-validator for more advanced checks)
  if (!student_id || !assignment_template_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  

  try {
    // Call the service to generate the assignment
    const assignment = await generateAssignmentServiceForStudent(
      student_id,
      assignment_template_id,
    );

    // Respond with the generated assignment
    res.status(200).json(assignment);
  } catch (err) {
    // Log the error for debugging (for development only, avoid exposing sensitive info in production)
    console.error("[generateAssignmentForStudent] Error:", err);

    // Send a generic error response
    res
      .status(500)
      .json({ error: "An error occurred while generating the assignment" });
  }
}

async function evaluateAssignmentController(req, res) {
  try {
    const { sourceCode, questionPrompt, expectedOutput, student_id, assignment_template_id } = req.body;

    if (!sourceCode || !questionPrompt) {
      return res.status(400).json({
        success: false,
        error: "sourceCode and questionPrompt are required fields.",
      });
    }

    const result = await evaluateAssignmentWithLlama(
      student_id,
      assignment_template_id,
      sourceCode,
      questionPrompt,
      expectedOutput
    );

    if (!result.success) {
      return res
        .status(500)
        .json({ message: "Evaluation failed", error: result.error });
    }

    // Update the student's assignment with the score
    await updateStudentAssignmentScore({
      student_id,
      assignment_template_id,
      score: result.score,
    });

    return res.status(200).json({
      message: "Assignment evaluated and score updated",
      score: result.score,
      feedback: result.feedback,
      wouldPassTests: result.wouldPassTests,
    });
  } catch (error) {
    console.error("Assignment evaluation failed:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error during assignment evaluation.",
    });
  }
}

const getAssignmentController = async (req, res) => {
  const { assignment_template_id } = req.body;

  // Validate required parameters
  if (!assignment_template_id) {
    return res.status(400).json({
      error: "assignment_template_id is required",
    });
  }

  try {
    const assignment = await getAssignmentByTemplateId(req.user.id, assignment_template_id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({ assignment });
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ error: "Unexpected error fetching assignment" });
  }
};

async function submitAssignmentController(req, res) {
  try {
    const { student_id, assignment_template_id, source_code } = req.body;

    if (!assignment_template_id || !source_code) {
      return res.status(400).json({
        error: "assignment_template_id and source_code are required fields.",
      });
    }

    const updatedAssignment = await saveStudentAssignmentSubmission({
      student_id,
      assignment_template_id,
      source_code,
    });

    return res.status(200).json({
      message: "Assignment submitted successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error("[submitAssignmentController] Error:", error.message);
    return res.status(500).json({
      error: "An error occurred while submitting the assignment.",
    });
  }
}

export { evaluateAssignmentController, generateAssignmentForStudent, getAssignmentController, submitAssignmentController };
