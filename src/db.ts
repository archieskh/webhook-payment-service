import { homedir } from "os";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";    
import path from "path";


// Load the .env in the project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const sequelizeConnection = new Sequelize (
    //process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/mydb",
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "postgres",
        logging: false
    }
);

export async function connectDB() {
    try {
        await sequelizeConnection.authenticate();
        console.log("Database connection established successfully.");
        console.log(`Connected to database, ${process.env.DB_NAME}`);
        
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

export default sequelizeConnection;