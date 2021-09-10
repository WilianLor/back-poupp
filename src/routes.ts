import { Router } from "express";

import userController from "./controllers/userController";
import transactionCategoriesController from "./controllers/transactionCategoryController";
import billController from "./controllers/billController";

import auth from "./middlewares/auth";

const routes = Router();

routes.post("/signup", userController.signUp);
routes.post("/signin", userController.signIn);
routes.post("/initialconfig", auth, userController.initialConfig);

routes.put("/forgotpassword", userController.sendResetPasswordToken);
routes.get("/validatetoken/:email/:token", userController.validateResetPasswordToken);
routes.put("/resetpassword", userController.resetPassword);

routes.post("/transactionscategories/create", transactionCategoriesController.create);
routes.get("/transactionscategories", auth, transactionCategoriesController.getAll);

routes.post("/bills/create", auth, billController.create);
routes.get("/bills", auth, billController.getAll);

export default routes;