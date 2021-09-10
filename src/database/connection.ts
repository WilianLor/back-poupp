import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const connection = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log("Error " + err);
    });
};

export default connection;
