'use strict'

const checkPassword = (psw, newPsw) => {
  return psw === newPsw
}

const getDataLogin = ({ _id, role }, token) => {
  const obj = {
    message: 'Login is Success',
    _id,
    isAdmin: false,
    token
  }
  if (role === 'admin') {
    return {
      ...obj,
      isAdmin: true
    }
  }
  return obj
}

const notAdminAction = (isAdmin, res) => {
  if (!isAdmin) {
    return res.status(403).send({
      message: 'Forbidden Access'
    })
  }
}

const getFilter = ({ usernameOrEmail }) => {
  if (usernameOrEmail) {
    return {
      $or: [
        { username: { $regex: `.*${usernameOrEmail}.*` } },
        { email: { $regex: `.*${usernameOrEmail}.*` } }
      ]
    }
  }
  return {}
}

const getObjUpdate = ({ username, email, password }) => {
  const u = username ? { username } : {}
  const e = email ? { email } : {}
  const p = password ? { password } : {}
  return { ...u, ...e, ...p }
}

const findByIdAndUpdate = (User, _id, req, res) => {
  User.findByIdAndUpdate({ _id }, getObjUpdate(req.body), { new: true })
    .then((data) => res.status(200).send({
      message: 'success update user',
      data
    }))
    .catch(err => res.send(err))
}

module.exports = {
  checkPassword,
  getDataLogin,
  notAdminAction,
  getFilter,
  getObjUpdate,
  findByIdAndUpdate
}
