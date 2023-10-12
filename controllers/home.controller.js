const userModel = require("../models/user.model")

exports.getHome = (req, res, next) => {
    console.log(req.friendRequests)
    res.render("index", {
        pageTitle: 'Home',
        isUser: req.session.userId,
        friendRequests: req.friendRequests
    })
}