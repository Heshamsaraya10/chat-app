const router = require('express').Router()
const bodyParser = require('body-parser')
const check = require('express-validator').check
const authGuared = require('./guards/auth.guard')
const authController = require('../controllers/auth.controller')
const { Router } = require('express')


router.get('/signup', authGuared.notAuth, authController.getSignup);

router.post(
    '/signup',
    authGuared.notAuth,
    bodyParser.urlencoded({ extended: true }),
    check('username')
        .not().
        isEmpty()
        .withMessage('username is required'),
    check('email')
        .not()
        .isEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('invaled format'),
    check('password')
        .not()
        .isEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at leat 6 charachters'),
    check('confirmPassword')
        .custom((value, { req }) => {
            if (value === req.body.password) return true
            else throw 'passwords dont equal'
        }),
    authController.postSignup
);

router.get('/login', authGuared.notAuth, authController.getLogin)

router.post(
    '/login',
    authGuared.notAuth,
    bodyParser.urlencoded({ extended: true }),
    check("email")
        .not()
        .isEmpty()
        .withMessage('email is required')
        .isEmail(),
    check('password')
        .not()
        .isEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 }),
    authController.PostLogin
)

router.all("/logout", authController.logout)
module.exports = router