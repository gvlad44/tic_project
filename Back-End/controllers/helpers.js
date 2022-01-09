const db = require("../config/db");
const faker = require("faker");
const { v4: uuid } = require("uuid");
const { FieldValue } = require("@google-cloud/firestore");

const otherController = {
  populateDatabase: async (req, res) => {
    try {
      for (var i = 0; i < 5; i++) {
        const accountId1 = uuid().toString();
        const accountId2 = uuid().toString();
        const clientId = uuid().toString();
        const data1 = {
          accountNo: faker.finance.account(),
          accountName: faker.finance.accountName(),
          balance: faker.finance.amount(),
          iban: faker.finance.iban(),
          clientId: clientId,
        };

        const dbResponse1 = await db
          .collection("accounts")
          .doc(accountId1)
          .set(data1);

        const data2 = {
          accountNo: faker.finance.account(),
          accountName: faker.finance.accountName(),
          balance: faker.finance.amount(),
          iban: faker.finance.iban(),
          clientId: clientId,
        };

        const dbResponse2 = await db
          .collection("accounts")
          .doc(accountId2)
          .set(data2);

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
          accounts: [accountId1, accountId2],
        };

        const dbResponse = await db
          .collection("clients")
          .doc(clientId)
          .set(data);
      }

      res.status(201).send();
    } catch (err) {
      res.status(404).send({
        msg: "Something went wrong",
      });
    }
  },
};

module.exports = otherController;
