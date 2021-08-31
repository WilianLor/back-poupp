import { Router } from "express";
import userController from "./controllers/userController";

const routes = Router();

routes.post("/signup", userController.signUp);
routes.post("/signin", userController.signIn);

export default routes;
