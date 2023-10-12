const router = require('express').Router()
const authGuared = require('./guards/auth.guard')

const homeController = require('../controllers/home.controller')

router.get('/', authGuared.isAuth, homeController.getHome);

module.exports = router