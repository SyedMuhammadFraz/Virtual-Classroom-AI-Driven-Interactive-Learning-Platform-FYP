import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js'; // Adjust the path to your db.js

const StudentAssignment = sequelize.define('student_assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assignment_template_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  difficulty_level: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  score: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  },
  submitted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'student_assignments',
  timestamps: false, // since you're manually handling created_at / updated_at
});

export default StudentAssignment;
