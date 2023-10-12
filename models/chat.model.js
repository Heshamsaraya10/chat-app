const mongosse = require('mongoose')
const { route } = require('../routes/auth.route')

const DB_URL = "mongodb://127.0.0.1:27017/chat-app"

const chatSchema = mongosse.Schema({
    user: [String]
})

const Chat = mongosse.model('chat', chatSchema)

exports.Chat = Chat