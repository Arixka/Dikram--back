const { userModel } = require('../api/models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.checkAuth = (req, res, next) => {
  // const token = req.headers.authorization.split(' ')[1]
  console.log('entro al cheackautgh')
  console.log(req.headers)
  jwt.verify(req.headers.authorization, process.env.SECRET, (err, token) => {
    if (err) {
      res.status(403).json({ error: 'Token not valid' })
    } else {
      userModel
        .findOne({ email: token.email })
        .then(user => {
          if (user) {
            res.locals.user = user
            console.log('-------------', user)
            next()
          } else {
            res.status(400).json({ err: 'User not found' })
          }
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({ err: 'Issue in DB' })
        })
    }
  })
}

exports.authSeller =  (req, res, next) => {
    if (res.locals.user.role === 'seller') {
      next() 
    } else {
    res.status(403).send('Access denied')
    }
}

exports.authAdmin = (req, res, next) => {
    if (res.locals.user.role === 'admin') {
      next() 
    } else {
    res.status(403).send('Access denied')
    }
}

