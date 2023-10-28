import dotenv from "dotenv";
import app from "./server";
import { NODE_ENV, PORT } from "./secret";
import connectDB from "./config/db";

// environment variables
dotenv.config();

// listen
app.listen(PORT, () => {
  if (NODE_ENV === "development") {
    console.log(``);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(``);
  }
});
