const express = require("express")
const path = require("path");
const bodyParser = require('body-parser')
const session = require('express-session')
const SessionStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const socketIO = require("socket.io")
const authRouter = require('./routes/auth.route')
const profileRouter = require('./routes/profile.route')
const friendRouter = require("./routes/friend.route");
const homeRouter = require('./routes/home.route')

const getFriendRequests = require("./models/user.model").getFriendRequests
const MongoStore = require('connect-mongo');

const app = express()
const server = require("http").createServer(app)
const io = socketIO(server)

io.onlineUsers = {

}

require("./sockets/friend.socket")(io)
require("./sockets/init.socket")(io)


app.set('view engine', 'ejs')
app.set('views', 'views') //default 
app.use(bodyParser.urlencoded({ extended: true }))


app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.use(flash())

const STORE = new SessionStore({
    url: 'mongodb://127.0.0.1:27017/chat-app',
    collection: "sessions",

})

app.use(session({
    name: 'example.sid',
    secret: 'Replace with your secret key',
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 7,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/chat-app"
    })
}));

app.use((req, res, next) => {
    if (req.session.userId) {
        return getFriendRequests(req.session.userId)
            .then(requests => {
                req.friendRequests = requests
                next();
            })
        // .catch(err => { res.next(err); console.log(err); })
    } else {
        next()
    }
})


app.use('/', authRouter)
app.use('/profile', profileRouter)
app.use('/friend', friendRouter)
app.use('/home', homeRouter)



app.get("/error", (req, res, next) => {
    res.status(500)
    res.render('error.ejs', {
        isUser: req.session.userId,
        pageTitle: " Not Allowd",
        friendRequests: req.friendRequests,
    })
})

app.use((req, res, next) => {
    res.status(404)
    res.render('not-found', {
        isUser: req.session.userId,
        pageTitle: "page not found",
        friendRequests: req.friendRequests,
    })
})



const port = process.env.port || 3000
server.listen(port, async () => {
    console.log("server listen on port" + " " + port);
});