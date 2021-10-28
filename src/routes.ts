import { Router } from "express";

import userController from "./controllers/userController";
import transactionCategoriesController from "./controllers/transactionCategoryController";
import billController from "./controllers/billController";
import postController from "./controllers/postController";
import commentController from "./controllers/commentController";
import bankController from "./controllers/bankController";
import accountController from "./controllers/accountController";
import goalCategoryController from "./controllers/goalCategoryController";
import extraIncomeCategoryController from "./controllers/extraIncomeCategoryController";
import extraIncomeGoalController from "./controllers/extraIncomeGoalController";
import expenseController from "./controllers/expenseController";
import goalController from "./controllers/goalController";
import cardController from "./controllers/cardController";
import transactionController from "./controllers/transactionController";

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
routes.delete(
  "/transactionscategories/delete",
  admin,
  transactionCategoriesController.delete
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

routes.post("/goalscategories/create", admin, goalCategoryController.create);
routes.get("/goalscategories", auth, goalCategoryController.getAll);
routes.delete("/goalscategories/delete", admin, goalCategoryController.delete);

routes.post(
  "/extraincomecategories/create",
  admin,
  extraIncomeCategoryController.create
);
routes.delete(
  "/extraincomecategories/delete",
  admin,
  extraIncomeCategoryController.delete
);
routes.get(
  "/extraincomecategories",
  auth,
  extraIncomeCategoryController.getAll
);

routes.post("/extraincomegoals/create", auth, extraIncomeGoalController.create);
routes.delete(
  "/extraincomegoals/delete",
  auth,
  extraIncomeGoalController.delete
);
routes.get("/extraincomegoals", auth, extraIncomeGoalController.getAll);

routes.post("/expenses/create", auth, expenseController.create);
routes.delete("/expenses/delete", auth, expenseController.delete);
routes.get("/expenses", auth, expenseController.getAll);

routes.post("/goals/create", auth, goalController.create);
routes.delete("/goals/delete", auth, goalController.delete);
routes.get("/goals", auth, goalController.getAll);

routes.post("/cards/create", auth, cardController.create);
routes.get("/cards", auth, cardController.getAll);
routes.get("/cards/transactions", auth, cardController.getTransactions);

routes.post("/transactions/create", auth, transactionController.create);
routes.get(
  "/transactions/lasts",
  auth,
  transactionController.getLastsTransactions
);
routes.get(
  "/transactions/month",
  auth,
  transactionController.getMonthTransactions
);

export default routes;
