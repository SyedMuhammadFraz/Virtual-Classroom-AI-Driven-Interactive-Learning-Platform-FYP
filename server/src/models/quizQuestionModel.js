import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js'; // Import your Sequelize instance

// Define the QuizQuestion model
const QuizQuestion = sequelize.define('QuizQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // student_id is required
  },
  quiz_template_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // quiz_template_id is required
    references: {
      model: 'quiz_templates', // The name of the referenced table
      key: 'id',               // The column in the referenced table that the foreign key points to
    },
  },
  questions: {
    type: DataTypes.JSONB,  // Use JSONB for the questions field
    allowNull: false, // Make sure it is not null
  },
  difficulty_level: {
    type: DataTypes.INTEGER,
    allowNull: true,  // Optional field
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true, 
    defaultValue: DataTypes.NOW, // Set default to current time
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true, 
    defaultValue: DataTypes.NOW, // Set default to current time
  },
}, {
  tableName: 'quiz_questions', // The table name
  timestamps: false, // Disable automatic timestamps if manually managing
});

QuizQuestion.associate = (models) => {
  // Define the relationship between QuizQuestion and QuizTemplate
  QuizQuestion.belongsTo(models.quizzes, {
    foreignKey: 'quiz_template_id',
    targetKey: 'id',
    as: 'quizzes', // Optional alias
  });
};

export default QuizQuestion;
