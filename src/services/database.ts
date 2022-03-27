import mongoose from "mongoose";
import "./env";

mongoose.connect(
  `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_LOCAL_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`,
  (err) => {
    if (err) console.log(`Error: ${err}`);
    else console.log(`Connected to database ${process.env.MONGODB_DATABASE}`);
  }
);
