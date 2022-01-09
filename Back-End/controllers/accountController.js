const db = require("../config/db");
const faker = require("faker");
const { v4: uuid } = require("uuid");
const { FieldValue } = require("@google-cloud/firestore");

const accountController = {
  addAccount: async (req, res) => {
    try {
      const clientId = req.params.id;
      const accountId = uuid().toString();
      const data = {
        accountNo: faker.finance.account(),
        accountName: faker.finance.accountName(),
        balance: faker.finance.amount(),
        iban: faker.finance.iban(),
        clientId: clientId,
      };
      const dbResponse = await db
        .collection("accounts")
        .doc(accountId)
        .set(data);

      const clientsDB = db.collection("clients").doc(clientId);
      const updateClient = await clientsDB.update({
        accounts: FieldValue.arrayUnion(accountId),
      });
      res.status(201).send();
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong",
      });
    }
  },

  getClientAccounts: async (req, res) => {
    try {
      const clientId = req.params.id;
      const accountsDB = db.collection("accounts");
      const snapshot = await accountsDB.get();
      const data = [];
      if (!snapshot) {
        res.status(400).send({
          msg: "Something went wrong",
        });
      } else {
        const accountIds = snapshot.docs.map((doc) => doc.id);
        for (const account of accountIds) {
          const accountData = db.collection("accounts").doc(account);
          const snapshotAccount = await accountData.get();
          if (snapshotAccount.data().clientId == clientId) {
            data.push({
              id: account,
              account: snapshotAccount.data(),
            });
          }
        }
        if (data) {
          res.status(200).send({
            data: data,
          });
        } else {
          res.status(404).send({
            msg: "Something went wrong",
          });
        }
      }
    } catch (err) {
      res.status(404).send({
        msg: "Something went wrong",
      });
    }
  },

  updateAccount: async (req, res) => {
    try {
      const accountId = req.params.id;
      const account = req.body;
      const accountsDB = db.collection("accounts").doc(accountId);
      const snapshot = await accountsDB.update(account);
      res.status(200).send();
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong",
      });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const accountId = req.params.id;
      const accountsDB = db.collection("accounts").doc(accountId);
      const clientId = (await accountsDB.get()).data().clientId;
      if (clientId) {
        const clientsDB = db.collection("clients").doc(clientId);
        const clientsSnapshot = await clientsDB.update({
          accounts: FieldValue.arrayRemove(accountId),
        });
      }
      const snapshot = await accountsDB.delete();
      res.status(200).send();
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong",
      });
    }
  },
};

module.exports = accountController;
