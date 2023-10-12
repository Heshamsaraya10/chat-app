socket.emit('getOnlineFriends', myId)

socket.on('onlineFriends ', friends => {
    console.log({ friends })
    let div = document.getElementById('onlineFriends')
    if (friends.length === 0) {
        // console.log(friends.length)
        div.innerHTML = `
            <p class="alert alert-danger">No online friends </p>
            `
    } else {
        let html = `
                <div class='row'>
        `
        for (let friend of friends) {
            // console.log(friends)
            html += `
                    <div class="col col-12 col-md-6 col-lg-4 ">
                        <img class="user-image" src="/${friend.image}">
                    <div>
                        <h3 href="/profile/${friend.id}">${friend.name}</h3>
                        <a href="/chat/${friend.chatId}" class="btn btn-success"></a>
                    </div>
                    </div>
                    `
        }
        html += "</div>"
        div.innerHTML = html
    }

})
