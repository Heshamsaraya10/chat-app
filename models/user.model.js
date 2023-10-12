const { rejects } = require("assert")
const mongoose = require("mongoose")
const { resolve } = require("path")
const { use } = require("../routes/auth.route")
const DB_URL = 'mongodb://localhost:27017/chat-app'
const Chat = require('./chat.model').Chat

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: { type: String, default: "Windows_10_Default_Profile_Picture.svg.png" },
    // isOnline: { type: Boolean, default: false },
    friends: {
        type: [{ name: String, image: String, id: String, chatId: String }],
        default: []
    },
    friendRequests: {
        type: [{ name: String, id: String }],
        default: []
    },
    sentRequests: {
        type: [{ name: String, id: String }],
        default: []
    },
})

const User = mongoose.model("user", userSchema)
exports.User = User

exports.getUserData = id => {
    // console.log(id)
    return new Promise((resolve, rejects) => {

        // console.log('eeee')
        mongoose
            .connect(DB_URL)
            .then(() => {
                return User.findById(id)
            }).then(data => {
                mongoose.disconnect()
                resolve(data)
            }).catch(err => {
                mongoose.disconnect()
                rejects(err)
            })
    })
}

exports.sendFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL)
        await User.updateOne(
            { _id: data.friendId },
            { $push: { friendRequests: { name: data.myName, id: data.myId } } }
        );
        await User.updateOne(
            { _id: data.myId },
            { $push: { sentRequests: { name: data.friendName, id: data.friendId } } }
        );
        mongoose.disconnect()
        return
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error)
    }
};

exports.cancelFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL)
        await User.updateOne(
            { _id: data.friendId },
            { $pull: { friendRequests: { id: data.myId } } }
        );
        await User.updateOne(
            { _id: data.myId },
            { $pull: { sentRequests: { id: data.friendId } } }
        );
        mongoose.disconnect()
        return
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error)
    }
};;

exports.acceptFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL)
        await User.updateOne(
            { _id: data.friendId },
            {
                $pull: { sentRequests: { id: data.myId } }
            }
        );
        await User.updateOne(
            { _id: data.myId },
            {
                $pull: {
                    sentRequests: { id: data.friendId }
                }
            }
        );
        let newChat = new Chat({
            users: [data.myId, data.friendId]
        })
        let chatDoc = await newChat.save()
        await User.updateOne(
            { _id: data.friendId },
            {
                $push: {
                    friends: {
                        name: data.myName,
                        id: data.myId,
                        image: data.myImage,
                        chatId: chatDoc._id
                    }
                }
            }
        );

        await User.updateOne(
            { _id: data.myId },
            {
                $push: {
                    friends: {
                        name: data.friendName,
                        id: data.friendId,
                        image: data.friendImage,
                        chatId: chatDoc._id
                    }
                }
            }
        );
        mongoose.disconnect()
        return
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error)
    }
};;

exports.rejectFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL)
        await User.updateOne(
            { _id: data.friendId },
            { $pull: { friendRequests: { id: data.myId } } }
        );
        await User.updateOne(
            { _id: data.myId },
            { $pull: { sentRequests: { id: data.friendId } } }
        );
        mongoose.disconnect()
        return
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error)
    }
};

exports.deleteFriend = async (data) => {
    try {
        await mongoose.connect(DB_URL)
        await User.updateOne(
            { _id: data.friendId },
            { $pull: { friends: { id: data.myId } } }
        );
        await User.updateOne(
            { _id: data.friendId },
            { $pull: { friendRequests: { id: data.myId } } }
        );
        await User.updateOne(
            { _id: data.myId },
            { $pull: { sentRequests: { id: data.friendId } } })
        mongoose.disconnect()
        return
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error)
    }
};

exports.getFriendRequests = async (id) => {
    try {
        await mongoose.connect(DB_URL)
        let data = await User.findById(id, { friendRequests: true })
        mongoose.disconnect()
        return data.friendRequests
    } catch (error) {
        mongoose.disconnect()
        // throw new Error(error)
    }
}




exports.getFriends = async id => {
    try {
        await mongoose.connect(DB_URL)
        let data = await User.findById(id, { friends: true })
        mongoose.disconnect()
        return data.friends
    } catch (error) {
        mongoose.disconnect()
        // throw new Error(error)
    }
}