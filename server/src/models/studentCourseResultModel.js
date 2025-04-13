// models/StudentCourseResult.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const StudentCourseResult = sequelize.define('StudentCourseResult', {
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  average_quiz_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  average_assignment_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'student_course_results',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'course_id']
    }
  ]
});

export default StudentCourseResult;


