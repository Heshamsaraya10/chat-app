const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require("./user.model").User
const DB_URL = 'mongodb://localhost:27017/chat-app'


exports.creatNewUser = (username, email, password) => {
    return new Promise((resolve, rejects) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return User.findOne({ email: email })
            })
            .then(user => {
                if (user) {
                    mongoose.disconnect()
                    rejects('email is used')
                }
                else {
                    return bcrypt.hash(password, 10)
                }
            }).then(hashedPassword => {
                let user = new User({
                    username: username,
                    email: email,
                    password: hashedPassword,
                })
                return user.save()
            }).then(() => {
                mongoose.disconnect()
                resolve()
            })
            .catch(err => rejects(err))
    })
}
// (async function () {
//     console.log(await bcrypt.hash("654321", 10))
// })()

exports.login = (email, password) => {
    return new Promise((resolve, rejects) => {
        // console.log(0)
        mongoose
            .connect('mongodb://127.0.0.1:27017/chat-app')
            .then(() => {
                // console.log('00')
                return User
                    .findOne({ email: email })
            })
            .then(user => {
                // console.log(1)
                if (!user) {
                    mongoose.disconnect()
                    rejects('there is no user matches this email')
                } else {
                    // console.log('2')
                    // console.log(user)
                    // console.log(password, user.password)
                    bcrypt.compare(password, user.password).then(same => {
                        if (!same) {
                            mongoose.disconnect()
                            rejects('passowrd is incorect')
                        } else {
                            // console.log(3)
                            mongoose.disconnect()
                            resolve(user)
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
                mongoose.disconnect()
                rejects(err)
            })
    })
}