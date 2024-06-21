const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../users/users-model')
const { route } = require('../server')

router.post('register', async (req, res ,next) => {
    try {
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, 8)
        const newUser = { username, password: hash}
        const result = await User.add(newUser)
        res.status(201).json({
            message :`nice to meet you ${result.username}`,
        })
    }
    catch (err){
    next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
      const {username, password} = req.body
      const [user] = await User.findBy({ username })
      if (user && bcrypt.compareSync(password, user.password)){
        req.session.user = user
        res.json({ message: `welcome back ${user.username}`})
      } else{
        next({ status: 401, message:'please try again'})
      }
    } catch (err){
      next(err)
    }
  })

  router.get('logout', async (req, res, next) =>{
    if (req.session.user){
      const {username} = req.session.user
      req.session.destroy(err =>{
        if (err) {
          res.json({ message: `you must stay, ${username}`})
        } else {
          res.set('Set Cookie', 'monkey=; SameStite=Strict; Path=/; Expires=Th, 01 Jan 1970 00:00:00')
          res.json({ message: `Goodbye ${username}` })
        }
      })
    } else {
      res.json({ message: 'I dont k ow you'})
    }
  })