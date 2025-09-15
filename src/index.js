import dotenv from "dotenv";
import { app } from "./app.js"
import { PORT } from "./constants.js"

dotenv.config({
    path: "./.env"
});


import connectDB from "./db/dbConnect.js";
connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed!!!", err)
})