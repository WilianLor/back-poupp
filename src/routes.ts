import { Router } from "express";

import userController from "./controllers/userController";
import transactionCategoriesController from "./controllers/transactionCategoryController";
import billController from "./controllers/billController";
import postController from "./controllers/postController";

import auth from "./middlewares/auth";
import admin from "./middlewares/admin";
import commentController from "./controllers/commentController";

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

export default routes;
