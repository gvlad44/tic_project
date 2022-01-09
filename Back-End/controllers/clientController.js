const db = require("../config/db");
const faker = require("faker");
const { v4: uuid } = require("uuid");

const clientController = {
  addClient: async (req, res) => {
    try {
      const data = {
        name:
          faker.name.firstName() +
          " " +
          faker.name.middleName().toUpperCase() +
          " " +
          faker.name.lastName(),
        job: faker.name.jobTitle(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        accounts: [],
      };
      const dbResponse = await db
        .collection("clients")
        .doc(uuid().toString())
        .set(data);
      res.status(201).send();
    } catch (err) {
      res.status(404).send({
        msg: "Something went wrong",
      });
    }
  },

  getAllClients: async (req, res) => {
    try {
      const clientsDB = db.collection("clients");
      const snapshot = await clientsDB.get();
      const data = [];
      if (!snapshot) {
        res.status(400).send({
          msg: "Something went wrong",
        });
      } else {
        const clientIds = snapshot.docs.map((doc) => doc.id);
        for (const client of clientIds) {
          const clientData = db.collection("clients").doc(client);
          const snapshotClient = await clientData.get();
          data.push({
            id: client,
            client: snapshotClient.data(),
          });
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

  getClient: async (req, res) => {
    try {
      const client = req.params.id;
      const clientsDB = db.collection("clients").doc(client);
      const snapshot = await clientsDB.get();
      if (snapshot.exists) {
        res.status(200).send({
          data: snapshot.data(),
        });
      } else {
        res.status(404).send({
          msg: "Something went wrong",
        });
      }
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong",
      });
    }
  },

  updateClient: async (req, res) => {
    try {
      const clientId = req.params.id;
      const client = req.body;
      const clientsDB = db.collection("clients").doc(clientId);
      const snapshot = await clientsDB.update(client);
      res.status(200).send();
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong",
      });
    }
  },

  deleteClient: async (req, res) => {
    try {
      const clientId = req.params.id;
      const clientsDB = db.collection("clients").doc(clientId);
      const client = await clientsDB.get();
      const accounts = client.data().accounts;
      if (accounts) {
        for (const accountId of accounts) {
          const accountsDB = db.collection("accounts").doc(accountId);
          const accountsSnapshot = await accountsDB.delete();
        }
      }
      const snapshot = await clientsDB.delete();
      res.status(200).send();
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong",
      });
    }
  },
};

module.exports = clientController;
