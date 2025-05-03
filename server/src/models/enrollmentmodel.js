import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js'; // Import your Sequelize instance

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // Assuming the users table name is 'users'
      key: 'id',
    },
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'courses', // Assuming the courses table name is 'courses'
      key: 'id',
    },
  },
  enrolled_at: {
    type: DataTypes.DATE, // Use DataTypes.DATE for a timestamp
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
 }, {
    tableName: 'enrollments',  // Correct table name in PostgreSQL
    timestamps: false,   // Disables automatic `createdAt` and `updatedAt` fields by Sequelize
  });


export default Enrollment;
