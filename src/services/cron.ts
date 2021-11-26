import { CronJob } from "cron";

import Bill from "../models/Bill";
import Card from "../models/Card";
import TransactionCategory from "../models/TransactionCategory";
import Transaction from "../models/Transaction";
import Account from "../models/Account";
import FixedTransaction from "../models/FixedTransaction";

const job = new CronJob("0 0 * * *", async () => {
  const today = new Date(Date.now());

  const lastMonthDay = new Date(
    today.getFullYear(),

    today.getMonth() + 1,
    0
  ).getDate();

  const todaysDay = today.getDate();

  try {
    const invoiceCardTransactionCategory = await TransactionCategory.findOne(
      {}
    );

    const allBills = (await Bill.find()).filter((bill) => {
      if (todaysDay === lastMonthDay) {
        return bill.dueDay >= lastMonthDay;
      } else {
        return bill.dueDay === todaysDay;
      }
    });

    allBills.forEach(async (bill) => {
      if (bill.interestType === "simple") {
      } else {
      }
    });

    const allCards = (await Card.find()).filter((card) => {
      if (todaysDay === lastMonthDay) {
        return card.closeDay >= lastMonthDay;
      } else {
        return card.closeDay === todaysDay;
      }
    });

    allCards.forEach(async (card) => {
      const account = await Account.findById(card.account);

      if (card.value !== 0) {
        const transactionData = {
          title: `Fatura do cartão: ${account.name}`,
          description: `Vencimento da fatura do cartão referente a conta ${account.name}`,
          category: invoiceCardTransactionCategory._id,
          account: account._id,
          type: "output",
          user: card.user,
          value: card.value,
        };

        const transaction = await Transaction.create(transactionData);

        await Account.findByIdAndUpdate(account._id, {
          value: account.value - card.value,
          $push: { transactions: transaction._id },
        });

        await Card.findByIdAndUpdate(card._id, {
          value: 0,
        });
      }
    });

    const allFixedTransactions = (await FixedTransaction.find()).filter(
      (fixedTransaction) => {
        if (todaysDay === lastMonthDay) {
          return fixedTransaction.dueDay >= lastMonthDay;
        } else {
          return fixedTransaction.dueDay === todaysDay;
        }
      }
    );

    allFixedTransactions.forEach(async (fixedTransaction) => {
      const account = await Account.findById(fixedTransaction.account);

      const transactionData = {
        title: `Transação fixa: ${fixedTransaction.title}`,
        description: `Transação fixa ${fixedTransaction.title}, restam mais ${
          fixedTransaction.remainingInstallments - 1
        } parcelas.`,
        category: fixedTransaction.category,
        account: account._id,
        type: "output",
        user: fixedTransaction.user,
        value: fixedTransaction.value,
      };

      const transaction = await Transaction.create(transactionData);

      await Account.findByIdAndUpdate(account._id, {
        value: account.value - fixedTransaction.value,
        $push: { transactions: transaction._id },
      });

      if (fixedTransaction.remainingInstallments - 1 === 0) {
        await FixedTransaction.findByIdAndDelete(fixedTransaction._id);
      } else {
        await FixedTransaction.findByIdAndUpdate(fixedTransaction._id, {
          remainingInstallments: fixedTransaction.remainingInstallments - 1,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

job.start();
