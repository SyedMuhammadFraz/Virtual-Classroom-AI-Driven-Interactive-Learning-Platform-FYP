import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';  // Import the sequelize instance
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fullname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING(255),
    allowNull: true,  // Refresh token can be optional initially
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'users',  // Correct table name in PostgreSQL
  timestamps: false,   // Disables automatic `createdAt` and `updatedAt` fields by Sequelize
});


// Instance method to check if password is correct
User.prototype.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

// Instance method to generate Access Token
User.prototype.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      fullName: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Instance method to generate Refresh Token
User.prototype.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Export the User model
export default User;
