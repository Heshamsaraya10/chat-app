module.exports = io => {
    io.on("connection", socket => {
        socket.on("joinNotificationsRoom", id => {
            socket.join(id)
        })
        socket.on('goOnline', id => {
            io.onlineUsers[id] = true
            console.log({ onlineFriends: io.onlineUsers })
            socket.on('disconnect', () => {
                io.onlineUsers[id] = false
                // console.log(io.onlineUsers)
            })
        })
    })
}