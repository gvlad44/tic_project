const db = require("../config/db");
const { v4: uuid } = require("uuid");
const keys = require("../config/keys.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  registerUser: async (req, res) => {
    try {
      const data = req.body;
      const userId = uuid().toString();
      const userDb = db.collection("users");
      const userSnapshot = await userDb.where("email", "==", data.email).get();

      if (!userSnapshot.empty) {
        res.status(400).send({
          msg: "Email already registered",
        });
      } else {
        const hashPassword = await bcrypt.hash(data.password, 16);
        data.password = hashPassword;
        const dbResponse = await db.collection("users").doc(userId).set(data);
        res.status(201).send();
      }
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong",
      });
    }
  },

  logInUser: async (req, res) => {
    try {
      const data = req.body;
      const userDb = db.collection("users");
      const userSnapshot = await userDb.where("email", "==", data.email).get();

      if (userSnapshot.empty) {
        res.status(400).send({
          msg: "Check your credentials and try again",
        });
      } else {
        userSnapshot.forEach(async (doc) => {
          const result = await bcrypt.compare(
            data.password,
            doc.data().password
          );
          if (result) {
            let jwtToken = jwt.sign(
              {
                email: data.email,
              },
              keys.jwt_secret,
              { expiresIn: "2h" }
            );
            res.status(200).send({
              data: jwtToken,
            });
          } else {
            res.status(400).send({
              msg: "Check your credentials and try again",
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        msg: "Something went wrong",
      });
    }
  },

  checkAuth: async (req, res, next) => {
    let token = req.headers["authorization"];
    if (typeof token !== "undefined") {
      token = token.replace(/^Bearer\s+/, "");
      jwt.verify(token, keys.jwt_secret, (err, decoded) => {
        if (err) {
          if (err.expiredAt) {
            res.status(400).send({
              msg: "Authorization expired! Log in again to continue",
            });
          } else {
            res.status(400).send({
              msg: "Authorization error",
            });
          }
        } else {
          next();
        }
      });
    } else {
      res.status(400).send({
        msg: "Authorization error 11",
      });
    }
  },
};

module.exports = userController;
