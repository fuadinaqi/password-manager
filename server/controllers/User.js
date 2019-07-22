'use strict'

const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

const {
  checkPassword,
  getDataLogin,
  notAdminAction,
  getFilter,
  findByIdAndUpdate
} = require('./userHelper')

const register = (req, res) => {
  const {
    username,
    email,
    password,
    newPassword,
    role
  } = req.body

  if (!checkPassword(password, newPassword)) {
    return res.status(400).send({
      message: 'password not match'
    })
  }
  User.create({
    username,
    email,
    password,
    role
  })
    .then((userCreated) => res.status(200).send({
      message: 'success created user',
      data: userCreated
    }))
    .catch(err => res.send(err))
}

const login = (req, res) => {
  const { username, email, password } = req.body
  if ((!email && !username) || !password) {
    return res.status(400).send({
      message: 'mandatory username/email and password body'
    })
  }
  User.findOne({ $or: [
    { email },
    { username }
  ]})
    .then((data) => {
      if (data.password !== password) {
        return res.status(401).send({
          message: 'Invalid email or password'
        })
      }
      jwt.sign({ data }, process.env.SECRET, (err, token) => {
        if (err) {
          return res.send(err)
        }
        res.status(200).send(getDataLogin(data, token))
      })
    })
    .catch((err) => res.status(400).send({
      message: 'Invalid email or password',
      err
    }))
}

const getAll = (req, res) => {
  const { isAdmin } = req.headers
  notAdminAction(isAdmin, res)
  
  User.find({ active: true, role: { $not: { $eq: 'admin' } }, ...getFilter(req.query)})
    .then((users) => res.status(200).send({
      message: 'success get all user',
      data: users
    }))
    .catch(err => res.send(err))
}

const getOne = (req, res) => {
  const { isAdmin } = req.headers
  const { id: _id } = req.params
  notAdminAction(isAdmin, res)

  User.findById({ _id })
    .then((data) => res.status(200).send({
      message: 'success get user',
      data
    }))
    .catch(err => res.send(err))
}

const updateOne = (req, res) => {
  const { isAdmin } = req.headers
  const { id: _id } = req.params
  const { username, email, password } = req.body
  notAdminAction(isAdmin, res)

  if (!username && !email && !password) {
    return res.status(400).send({
      message: 'mandatory username or email or password body'
    })
  }

  findByIdAndUpdate(User, _id, req, res)
}

const updateSelf = (req, res) => {
  const { _id } = req.headers
  const { username, email } = req.body

  if (!username && !email) {
    return res.status(400).send({
      message: 'mandatory username or email body'
    })
  }

  findByIdAndUpdate(User, _id, req, res)
}

const softDelete = (req, res) => {
  const { isAdmin } = req.headers
  const { id: _id } = req.params
  notAdminAction(isAdmin, res)

  if (!_id) {
    return res.status(400).send({
      message: 'mandatory id user parameter'
    })
  }
  User.findByIdAndUpdate({ _id }, { active: false }, { new: true })
    .then((data) => res.status(200).send({
      message: 'success delete user',
      data
    }))
    .catch(err => res.send(err))
}

module.exports = {
  register,
  login,
  getAll,
  getOne,
  updateOne,
  updateSelf,
  softDelete
}