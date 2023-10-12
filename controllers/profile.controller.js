const { default: mongoose } = require('mongoose')
const userModel = require('../models/user.model')
const { promises } = require('dns')
const { resolve } = require('path')
const { rejects } = require('assert')


exports.getProfile = (req, res, next) => {
    console.log(req.friendRequests)
    let id = req.params.id
    console.log(req.session.userId)
    if (!id) return res.redirect("/profile/" + req.session.userId)
    userModel
        .getUserData(id)
        .then(data => {
            res.render("profile", {
                pagTitle: data.username,
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                myId: req.session.userId,
                myName: req.session.name,
                myImage: req.session.image,
                friendId: data._id,
                username: data.username,
                userImage: data.image,
                isOwner: id === req.session.userId,
                isFriends: data.friends.find(friend => friend.id === req.session.userId),

                isRequestSent: data.friendRequests.find(
                    friend => friend.id === req.session.userId),

                isRequestRecieved: data.sentRequests.find(
                    friend => friend.id === req.session.userId),
            })
        }).catch(err => {
            // console.log('ddd')
            res.redirect("/error")
        })
}



exports.postProfile = (req, res, next) => {
    let id = req.params.id
    userModel
        .getUserData(id)
        .then(data => {
            res.render("profile", {
                pagTitle: data.username,
                isUser: true,
                username: data.username,
                userImage: data.image
            })

        })
}






