import sequelize from "../db/db.js";

export async function getStudentDifficultyLevel(student_id) {
  const result = await sequelize.query(
    'SELECT difficulty_level FROM users WHERE id = :student_id',
    {
      replacements: { student_id },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  // result is an array of objects: [{ difficulty_level: ... }]
  return result[0]?.difficulty_level || null;
}
