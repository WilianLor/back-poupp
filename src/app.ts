import express from "express";
import cors from "cors";
import routes from "./routes";
import "./services/env"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(routes);

export default app;
