'use strict'

const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const {
  getAll,
  getOne,
  register,
  login,
  updateSelf,
  updateOne,
  softDelete
} = require('../controllers/User')

router.get('/', authMiddleware, getAll)
router.get('/:id', authMiddleware, getOne)
router.post('/register', register)
router.post('/login', login)
router.put('/', authMiddleware, updateSelf)
router.put('/:id', authMiddleware, updateOne)
router.delete('/:id', authMiddleware, softDelete)

module.exports = router
