import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});
import connectDB from "./db/dbConnect.js";

connectDB();