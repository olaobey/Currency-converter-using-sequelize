const express = require("express");
const usersController = require("./../../api/controller/usersController");

const userRouter = express.Router();

userRouter.get("/", usersController.create);
userRouter.get("/:id", usersController.login);
userRouter.post("/", usersController.getAll);
userRouter.put("/:id", usersController.getById);
module.exports = userRouter; 

