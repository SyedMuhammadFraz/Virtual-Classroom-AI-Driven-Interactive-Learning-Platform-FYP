import { evaluateAssignmentWithLlama } from "../services/groqAssignmentEvaluator.js";
import { generateAssignmentServiceForStudent } from "../services/insertAssignment.service.js";

async function generateAssignmentForStudent(req, res) {
  const { student_id, assignment_template_id, difficulty_level } = req.body;

  // Basic input validation (you can use a library like Joi or express-validator for more advanced checks)
  if (!student_id || !assignment_template_id || !difficulty_level) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Call the service to generate the assignment
    const assignment = await generateAssignmentServiceForStudent(
      student_id,
      assignment_template_id,
      difficulty_level
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
    const { sourceCode, questionPrompt, expectedOutput } = req.body;

    if (!sourceCode || !questionPrompt) {
      return res.status(400).json({
        success: false,
        error: "sourceCode and questionPrompt are required fields.",
      });
    }

    const result = await evaluateAssignmentWithLlama(
      sourceCode,
      questionPrompt,
      expectedOutput
    );

    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("Assignment evaluation failed:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error during assignment evaluation.",
    });
  }
}

export { evaluateAssignmentController, generateAssignmentForStudent };
