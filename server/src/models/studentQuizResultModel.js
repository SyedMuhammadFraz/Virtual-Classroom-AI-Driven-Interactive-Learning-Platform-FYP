import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js'; // Import your Sequelize instance

const StudentQuizResult = sequelize.define('StudentQuizResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quiz_template_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Optional
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Required
  },
  total_score: {
    type: DataTypes.INTEGER,
    allowNull: true, // Optional
  },
  score_percentage: {
    type: DataTypes.NUMERIC,
    allowNull: true, // Optional
  },
  questions_answered: {
    type: DataTypes.JSONB,
    allowNull: true, // Optional, but typically required for storing answers
  },
  time_taken: {
    type: DataTypes.STRING, // Use string to receive the time in "HH:MM:SS" format
    allowNull: true,
  },
  completion_status: {
    type: DataTypes.STRING(50),
    allowNull: true, // Optional
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW, // Default to current time
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW, // Default to current time
  },
}, {
  tableName: 'student_quiz_results',
  timestamps: false, // Disable automatic timestamps
});

export default StudentQuizResult;
