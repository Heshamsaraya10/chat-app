const router = require('express').Router()

const authGuared = require('./guards/auth.guard')
const profileController = require("../controllers/profile.controller")

router.get('/', authGuared.isAuth, profileController.getProfile);
router.get('/:id', authGuared.isAuth, profileController.getProfile);

module.exports = router;