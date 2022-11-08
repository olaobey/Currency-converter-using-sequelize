const express = require("express");
const convertController = require("./../../api/controller/convertController");

const convertRouter = express.Router();

convertRouter.get("/", convertController.exchangeRates);
convertRouter.get("/:id", convertController.currencies);
convertRouter.post("/", usersController.convert);
module.exports = convertRouter;
