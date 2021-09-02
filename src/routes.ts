import { Router } from "express";

import userController from "./controllers/userController";

const routes = Router();

routes.post("/signup", userController.signUp);
routes.post("/signin", userController.signIn);

routes.put("/forgotpassword", userController.sendResetPasswordToken);
routes.get("/validatetoken/:email/:token", userController.validateResetPasswordToken);
routes.put("/resetpassword", userController.resetPassword);

export default routes;
