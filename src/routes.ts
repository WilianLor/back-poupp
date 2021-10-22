import { Router } from "express";

import userController from "./controllers/userController";
import transactionCategoriesController from "./controllers/transactionCategoryController";
import billController from "./controllers/billController";
import postController from "./controllers/postController";
import commentController from "./controllers/commentController";
import bankController from "./controllers/bankController";
import accountController from "./controllers/accountController";

import auth from "./middlewares/auth";
import admin from "./middlewares/admin";

const routes = Router();

routes.post("/signup", userController.signUp);
routes.post("/signin", userController.signIn);

routes.post("/initialconfig", auth, userController.initialConfig);
routes.get("/getdata", auth, userController.getData);

routes.put("/forgotpassword", userController.sendResetPasswordToken);
routes.get("/validatetoken", userController.validateResetPasswordToken);
routes.put("/resetpassword", userController.resetPassword);

routes.post(
  "/transactionscategories/create",
  admin,
  transactionCategoriesController.create
);
routes.get(
  "/transactionscategories",
  auth,
  transactionCategoriesController.getAll
);

routes.post("/bills/create", auth, billController.create);
routes.get("/bills", auth, billController.getAll);

routes.post("/posts/create", admin, postController.create);
routes.delete("/posts/delete", admin, postController.delete);
routes.get("/posts", auth, postController.getAll);
routes.get("/post", auth, postController.getOne);

routes.post("/comments/create", auth, commentController.create);
routes.delete("/comments/delete", admin, commentController.delete);

routes.post("/banks/create", admin, bankController.create);
routes.delete("/banks/delete", admin, bankController.delete);
routes.get("/banks", auth, bankController.getAll);

routes.post("/accounts/create", auth, accountController.create);
routes.get("/accounts", auth, accountController.getAll);
routes.delete("/accounts/delete", auth, accountController.delete);

export default routes;
