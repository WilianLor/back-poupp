# **_Poupp API Enpoints documentation_**

# **User**

## **Signup**

User signup on Poupp.

- **URL**

  `/signup`

- **Method:**

  `POST`

- **Data Params**

  **Required:**

  `name: number`<br />
  `email: string`<br />
  `password: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ token : string, user: { name: string, admin: boolean, hasInitialData: boolean, createdAt: date } }`

## **Inital Configuration**

User initial configuration on Poupp.

- **URL**

  `/initialconfig`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params**

  **Required:**

  `categories: [{ categoryId: string, maxValue: number }]`<br />
  `incomeValue: number`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Initial config has been saved." }`

## **Signin**

User signin on Poupp.

- **URL**

  `/signin`

- **Method:**

  `POST`

- **Data Params**

  **Required:**

  `email: string`<br />
  `password: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ token : string, user: { name: string, admin: boolean, hasInitialData: boolean, createdAt: date } }`

## **Get Data**

User getting his data and verifying if your password has changed.

- **URL**

  `/getdata`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ token : string, user: { name: string, admin: boolean, hasInitialData: boolean, createdAt: date } }`

## **Send Reset Password Token**

Sending the reset password token.

- **URL**

  `/forgotpassword`

- **Method:**

  `PUT`

- **Data Params**

  **Required:**

  `email: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Reset token sent successfully." }`

## **Validate Reset Password Token**

Validating if the reset password token is valid.

- **URL**

  `/validatetoken`

- **Method:**

  `GET`

- **Query Params**

  **Required:**

  `email: string`<br />
  `token: string`<br />

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Token is valid." }`

## **Reset Password**

Changing the password.

- **URL**

  `/resetpassword`

- **Method:**

  `PUT`

- **Data Params**

  **Required:**

  `email: string`<br />
  `password: string`<br />
  `token: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Password reset successfully." }`

# **Transaction Category**

## **Create - Admin**

Admin create a new transaction category.

- **URL**

  `/transactionscategories/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params**

  **Required:**

  `name: string`<br />
  `necessary: number`<br />
  `type: string`<br />
  `income: boolean`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Category created." }`

## **Get All**

Get all transactions categories.

- **URL**

  `/transactionscategories`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ _id: string, name: string, necessary: number, income: boolean, type: string, __v: number }]`

## **Delete - Admin**

Delete a transaction category.

- **URL**

  `/transactionscategories/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `transactionCategoryId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Transaction category removed with success." }`

# **Goal Category**

## **Create - Admin**

Admin create a new goal category.

- **URL**

  `/goalscategories/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params**

  **Required:**

  `name: string`<br />
  `type: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Goal category was created with success." }`

## **Get All**

Get all goals categories.

- **URL**

  `/goalscategories`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ _id: string, name: string, type: string }]`

## **Delete - Admin**

Delete a goal category.

- **URL**

  `/goalscategories/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `goalCategoryId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Goal category removed with success." }`

# **Extra Income Category**

## **Create - Admin**

Admin create a new extra income category.

- **URL**

  `/extraincomecategories/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params**

  **Required:**

  `name: string`<br />
  `type: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Extra income category was created with success." }`

## **Get All**

Get all extra income categories.

- **URL**

  `/extraincomecategories`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ _id: string, name: string, type: string }]`

## **Delete - Admin**

Delete a extra income category.

- **URL**

  `/extraincomecategories/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `extraIncomeCategoryId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Extra income category removed with success." }`

# **Banks**

## **Create - Admin**

Admin create a new bank.

- **URL**

  `/banks/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params**

  **Required:**

  `name: string`<br />
  `picture: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Bank was created with success." }`

## **Get All**

Get all banks.

- **URL**

  `/banks`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ _id: string, name: string, picture: string }]`

## **Delete - Admin**

Delete a bank.

- **URL**

  `/banks/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `bankId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Bank removed with success." }`

# **Posts**

## **Create - Admin**

Admin create a new post.

- **URL**

  `/posts/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params**

  **Required:**

  `title: string`<br />
  `image: string`<br />
  `content: string`<br />
  `topic: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Post created with success." }`

## **Get All**

Get all posts.

- **URL**

  `/posts`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{_id: string, title: string, image: string, content: string, author: { _id: string, name: string, email: string, passwordVersion: number, admin: boolean, accounts: [], createdAt: date, updatedAt: date, __v: number }, topic: string, comments: [{ _id: string, author: string, content: string, post: string, createdAt: date, updatedAt: date, __v: number }], createdAt: date, updatedAt: date }]`

## **Get One**

Get a post.

- **URL**

  `/post`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `postId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ _id: string, title: string, image: string, content: string, author: { _id: string, name: string, email: string, passwordVersion: number, admin: boolean, accounts: [], createdAt: date, updatedAt: date, __v: number }, topic: string, comments: [{ _id: string, author: string, content: string, post: string, createdAt: date, updatedAt: date, __v: number }], createdAt: date, updatedAt: date }`

## **Delete - Admin**

Delete a post.

- **URL**

  `/posts/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `postId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Post removed with success." }`

# **Comments**

## **Create**

Create a comment.

- **URL**

  `/comments/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params:**

  **Required:**

  `postId: string`<br />
  `content: string`<br />

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ author: { _id: string, name: string, email: string, passwordVersion: number, admin: boolean, accounts: [], createdAt: date, updatedAt: date, __v: number }, content: string, post: string: createdAt: date, updatedAt: date }`

## **Delete - Admin**

Delete a comment.

- **URL**

  `/comments/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `commentId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Comment removed with success." }`

# **Bills**

## **Create**

Create a bill.

- **URL**

  `/bills/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params:**

  `paidValue: number`<br />

  **Required:**

  `remainingValue: number`<br />
  `interest: number`<br />
  `interestType: string`<br />
  `title: string`<br />
  `dueDay: number`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Bill created." }`

## **Get All**

Get all user bills.

- **URL**

  `/bills`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ title: string, remainingValue: number, interest: number, paidValue: number, dueDay: number, interestType: string, user: { _id: string, name: string, email: string, passwordVersion: number, admin: boolean, accounts: [], createdAt: date, updatedAt: date, __v: number }, createdAt: date, updatedAt: date }]`

## **Pay**

Pay a bill.

- **URL**

  `/bills/pay`

- **Method:**

  `PUT`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `billId: string`

- **Data Params:**

  **Required:**

  `value: string`<br />
  `accountId: string`<br />
  `isCard: boolean`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Bill paid successfully." }`

## **Delete**

Delete a bill.

- **URL**

  `/bills/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `billId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Bill deleted with success." }`

# **Goal**

## **Create**

Create a goal.

- **URL**

  `/goals/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params:**

  **Required:**

  `totalValue: number`<br />
  `expirationDate: date`<br />
  `goalCategoryId: string`<br />
  `title: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Goal created with success." }`

## **Get All**

Get all user goals.

- **URL**

  `/goals`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ title: string, totalValue: number, category: string, expirationDate: date, user: { _id: string, name: string, email: string, passwordVersion: number, admin: boolean, accounts: [], createdAt: date, updatedAt: date, __v: number } }]`

## **Complete**

Complete a goal.

- **URL**

  `/goals/complete`

- **Method:**

  `PUT`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `goalId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "This goal is now completed." }`

## **Delete**

Delete a goal.

- **URL**

  `/goals/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `goalId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Goal deleted with success." }`

# **Extra Income Goals**

## **Create**

Create a extra income goal.

- **URL**

  `/extraincomegoals/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params:**

  `reachedValue: number`

  **Required:**

  `totalValue: number`<br />
  `extraIncomeCategory: string`<br />
  `title: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Extra income goal created with success." }`

## **Get All**

Get all user extra income goals.

- **URL**

  `/extraincomegoals`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ title: string, totalValue: number, reachedValue: number, category: string, user: { _id: string, name: string, email: string, passwordVersion: number, admin: boolean, accounts: [], createdAt: date, updatedAt: date, __v: number }, createdAt: date, updatedAt: date }]`

## **Income**

Extra income.

- **URL**

  `/extraincomegoals/income`

- **Method:**

  `PUT`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `extraIncomeGoalId: string`

- **Data Params:**

  **Required:**

  `value: number`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Funds added with succes." }`

## **Delete**

Delete a extra income goal.

- **URL**

  `/extraincomegoals/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `extraIncomeGoalId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Extra income goal removed with success." }`

# **Accounts**

## **Create**

Create a account.

- **URL**

  `/accounts/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params:**

  `value: number`

  **Required:**

  `name: number`<br />
  `bank: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Account created with success." }`

## **Get All**

Get all user accounts.

- **URL**

  `/accounts`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ _id: string, name: string, bank?: string, value: number, card?: string, type: string, transactions: [{ _id: string, title: string, value: number, description: string, category: string, account: string, user: string, isCard: boolean, type: string, createdAt: date, updatedAt: date, __v: number }] }]`

## **Delete**

Delete a account.

- **URL**

  `/accounts/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `accountId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Account removed with success." }`

# **Expenses**

## **Create**

Create a expense.

- **URL**

  `/expenses/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params:**

  **Required:**

  `transactionCategoryId: string`<br />
  `maxValue: number`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Expense created with success." }`

## **Get All**

Get all user expenses.

- **URL**

  `/expenses`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ value: number, expense: { _id: string, user: string, category: string, maxValue: number } }]`

## **Delete**

Delete a expense.

- **URL**

  `/expenses/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `expenseId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Expense deleted with success." }`

# **Cards**

## **Create**

Create a card.

- **URL**

  `/cards/create`

- **Method:**

  `POST`

- **Header Params:**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params:**

  **Required:**

  `limit: number`<br />
  `accountId: string`<br />
  `closeDay: number`<br />
  `username: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Card created with success." }`

## **Get All**

Get all user cards.

- **URL**

  `/cards`

- **Method:**

  `GET`

- **Header Params:**

  **Required:**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ _id: string, username: string, value: number, limit: number, closeDay: number, account: { _id: string, user: string, transactions: [{}], name: string, bank: string, value: number, card: string, type: string, __v: number }, transactions: [{}], user: string, __v: number, bank: string }`

## **Get Transactions**

Get all card transactions.

- **URL**

  `/cards/transactions`

- **Method:**

  `GET`

- **Header Params:**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  `page: number`<br />
  `limit: number`

  **Required:**

  `cardId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ totalOfPages: number, transactions: [{ _id: string, value: number, title: string, description: string, category?: string, account: string, user: string, transferAccount?: string, isCard: boolean, type: string }] }`

# **Transactions**

## **Create**

Create a transaction.

- **URL**

  `/transactions/create`

- **Method:**

  `POST`

- **Header Params:**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params:**

  `isCard: boolean`<br />
  `transferAccountId: string`

  **Required:**

  `type: string`<br />
  `title: string`<br />
  `description: string`<br />
  `categoryId: string`<br />
  `accountId: string`<br />
  `value: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Transaction created with success." }`

## **Get Lasts**

Get user lasts transactions.

- **URL**

  `/transactions/lasts`

- **Method:**

  `GET`

- **Header Params:**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  `limit: number`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ _id: string, title: string, description: string, category?: string, account: string, user: string, transferAccount?: string, isCard: boolean, type: string }]`

## **Get By Month**

Get user transactions by month.

- **URL**

  `/transactions/month`

- **Method:**

  `GET`

- **Header Params:**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  `limit: number`<br />
  `page: number`

  **Required:**

  `month: number`<br />
  `year: number`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ transactions: [{ _id: string, value: number, title: string, description: string, category?: { _id: string, name: string, necessary: number, income: boolean, type: string, __v: number }, account: string, user: string, transferAccount?: string, isCard: boolean, type: string }], totalOfPages: number }`

# **Fixed Transactions**

## **Create**

Create a fixed transaction.

- **URL**

  `/fixedtransactions/create`

- **Method:**

  `POST`

- **Header Params:**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params:**

  **Required:**

  `value: number`<br />
  `categoryId: string`<br />
  `accountId: string`<br />
  `title: string`<br />
  `description: string`<br />
  `dueDay: number`<br />
  `totalOfInstallments: number`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Fixed transaction created with success." }`

## **Get All**

Get all user fixed transactions.

- **URL**

  `/fixedtransactions`

- **Method:**

  `POST`

- **Header Params:**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  `page: number`<br />
  `limit: number`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ fixedTransactions: [{ _id: string, value: number, category: string, account: string, title: string, dueDay: number, description: string, remainingInstallments: number, user: string, createdAt: date, updatedAt: date }]}, totalOfPages: number`

## **Delete**

Delete a fixed transaction.

- **URL**

  `/fixedtransactions/delete`

- **Method:**

  `DELETE`

- **Header Params:**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `fixedTransactionId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Fixed transaction deleted with success." }`

# **Youtuber**

## **Create - Admin**

Admin create a youtuber.

- **URL**

  `/youtuber/create`

- **Method:**

  `POST`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Data Params**

  **Required:**

  `title: string`<br />
  `channelId: string`<br />
  `picture: string`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    `{ message: "Youtuber created with success." }`

## **Get All**

Get all youtubers.

- **URL**

  `/youtubers`

- **Method:**

  `GET`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `[{ _id: string, title: string, picture: string, channelId: string }]`

## **Delete - Admin**

Delete a youtuber.

- **URL**

  `/youtubers/delete`

- **Method:**

  `DELETE`

- **Header Params**

  `Authorization: "Bearer <TOKEN>"`

- **Query Params:**

  **Required:**

  `youtubeId: string`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{ message: "Youtuber deleted with success." }`
