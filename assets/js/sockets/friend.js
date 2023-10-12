const addBtn = document.getElementById("addBtn")

// const myId = document.getElementById('myId').value
const myName = document.getElementById('myName').value
const myImage = document.getElementById('myImage').value
const friendId = document.getElementById('friendId').value
const userImage = document.getElementById('userImage').value
const friendName = document.getElementById('friendName').value

addBtn.onclick = e => {
    e.preventDefault()
    socket.emit("sendFriendRequest", {
        myId,
        myName,
        myImage,
        friendId,
        userImage,
        friendName,
    })
}

socket.on("requestSent", () => {
    addBtn.remove()
    document.getElementById('friends-form').innerHTML += ` <input type="submit" value="Cancel Request" class="btn btn-danger"
    formaction="/friend/cancel">`
})