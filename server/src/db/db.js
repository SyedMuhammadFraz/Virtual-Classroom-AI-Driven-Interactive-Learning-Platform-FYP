
import { Sequelize } from 'sequelize';
import { DB_NAME } from "../constants.js";  // Your database name


// Set up Sequelize connection
const sequelize = new Sequelize(DB_NAME, 'postgres', '2022', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false, // Disable logging SQL queries
});

export const connectDatabase = async () => {
  
    // Test the connection
    try{

      await sequelize.authenticate();
      console.log("Database Connected Successfully")
    }
    catch(error){

      console.log("Database Failed to Connect");
    }
}

export default sequelize;
