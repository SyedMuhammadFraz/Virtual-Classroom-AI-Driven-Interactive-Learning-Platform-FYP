import { Sequelize } from "sequelize";
import dotenv from "dotenv";


dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Accept unverified certs for Neon
    },
  },
  logging: false, // Turn off logging
});

export const connectDatabase = async () => {
  // Test the connection
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database Failed to Connect");
  }
};

export default sequelize;
