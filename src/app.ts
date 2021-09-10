import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import connection from "./database/connection";

connection();

dotenv.config({
  path: ".env",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(routes);

export default app;
