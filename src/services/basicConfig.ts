import TransactionCategory from "../models/TransactionCategory";

const basicConfiguration = async () => {
  try {
    if (!(await TransactionCategory.findOne({ type: "bill" }))) {
      const transactionCategoryData = {
        name: "Dívidas",
        income: false,
        type: "bill",
      };

      await TransactionCategory.create(transactionCategoryData);
    }

    if (!(await TransactionCategory.findOne({ type: "goal" }))) {
      const transactionCategoryData = {
        name: "Metas",
        income: false,
        type: "goal",
      };

      await TransactionCategory.create(transactionCategoryData);
    }

    if (!(await TransactionCategory.findOne({ type: "extraIncome" }))) {
      const transactionCategoryData = {
        name: "Renda extra",
        income: true,
        type: "extraIncome",
      };

      await TransactionCategory.create(transactionCategoryData);
    }

    if (!(await TransactionCategory.findOne({ type: "invoiceCard" }))) {
      const transactionCategoryData = {
        name: "Fatura do cartão",
        income: false,
        type: "invoiceCard",
      };

      await TransactionCategory.create(transactionCategoryData);
    }
  } catch (err) {
    console.log(err);
  }
};

basicConfiguration();
