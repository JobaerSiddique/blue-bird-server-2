import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

const main = async () => {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    console.log("Connected to the database");

    app.listen(config.PORT, () => {
      console.log(`Blue bird server is running on port ${config.PORT}`);
    });
  } catch (error: any) {
    console.error("Error starting the server:", error?.message);
    process.exit(1); 
  }
};

main();
