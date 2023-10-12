const mongosse = require('mongoose')

const DB_URL = "mongodb://127.0.0.1:27017/chat-app"


const messageSchema = mongosse.Schema({
    chat: String,
    content: String,
    sender: String,
    timestamp: Number
})

const Message = mongosse.model("message", messageSchema)