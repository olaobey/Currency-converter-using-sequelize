const express = require("express")
const db = require("./../../model/db")
const User = db.users

const create = async (req, res) => {
  const { firstName, lastName, email, password, image } = req.body;
  try {
    const user = await user.create({ firstName, lastName, email, password, image });
    return res.status(201).json({ user});
  } catch (err) {
    if (err.message === 'User already registered') {
      return res.status(409).json({ message: 'User already registered' });
    }
    console.log(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await user.login({ email, password });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const allUsers = await allUsers.getAll();
    return res.status(200).json(allUsers);
  } catch (err) {
    return res.status(500).json({ message: 'Your attempt is not successful' });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;

  const user = await user.getById(id);
  if (user) return res.status(200).json(user);

  return res.status(404).json({ message: 'User does not exist' });
};

module.exports = {
  create,
  login,
  getAll,
  getById,
};