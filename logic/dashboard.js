var communitySection = document.getElementById("community")
var usernameSection = document.getElementById("user-name")
var logoutButton = document.getElementById("logout")
var logoutError = document.getElementById("logout-error")
var sessionExpired = document.getElementById("session-expired")
var sentList = document.getElementById("sent-list")
var receivedList = document.getElementById("received-list")
var friendsList = document.getElementById("friends-list")
var notificationsSection = document.getElementById("notifications")


//set chat-mate in sessionStorage
sessionStorage.setItem('chatMate', null)



//access and refresh tokens
var accessToken = sessionStorage.getItem('accessToken')
var refreshToken = sessionStorage.getItem('refreshToken')

if (!accessToken){  //no access token
    window.location.href = "../markup/landing.html"
}



//logout a user
var logoutHeader = new Headers()
logoutHeader.append('x-refresh-token', refreshToken)

function logout(){
    //invalidate refresh token in api
    fetch("http://localhost:3000/auth/logout", {
        method: 'POST',
        headers: logoutHeader
    })
    .then((response) => {
        if (response.status === 200) {
            //wipe off tokens on frontend
            sessionStorage.removeItem('accessToken')
            sessionStorage.removeItem('refreshToken')


            window.location.href = "../markup/landing.html"

        } else {
            //error - could not logout
            logoutError.innerHTML = 'there was an error logging out, try again later'
            logoutError.style.color = 'white'
            logoutError.style.backgroundColor = 'red'
            logoutError.style.padding = '7px'
            logoutError.style.fontSize = '13px'
            logoutError.style.display = 'inline-block'
            logoutError.style.marginTop = '30px'
            logoutError.style.marginLeft = '2.5%'
        }
    })
}

logoutButton.addEventListener("click", logout)




//login session management
// function sessionManagement(accessToken){
//     var accessToken_decoded = jwt_decode(accessToken)

//     var loginDuration = accessToken_decoded.exp - accessToken_decoded.iat //in seconds
//     console.log(loginDuration)

//     var elapseTime = (Date.now() * 1000) + loginDuration
//     console.log(elapseTime)

//     if(!sessionStorage.getItem('expiration')){
//         sessionStorage.setItem('expiration', elapseTime)
//     }

// }

// sessionManagement(accessToken)


// var accesstokenHeader = new Headers()
// accesstokenHeader.append('refresh-token', refreshToken)

// var getTokenResponse

// setInterval(function(){
//     if ((Date.now() * 1000) >= sessionStorage.getItem('expiration')){

//         console.log(Date.now() * 1000)
//         //get new access token using the refresh token
//         fetch("http://localhost:3000/auth/accesstoken", {
//             method: 'GET',
//             headers: accesstokenHeader
//         })
//         .then(response => {
//             getTokenResponse = response

//             return response.json()
//         })
//         .then(jsonResponse => {
//             if(getTokenResponse.status === 200){   //new access token retrieved

//                 //wipe off 'expiration' in sessionStorage
//                 sessionStorage.removeItem('expiration')

//                 //replace access token and refresh token in sessionStorage
//                 sessionStorage.removeItem('accessToken')
//                 sessionStorage.removeItem('refreshToken')
//                 sessionStorage.setItem('accessToken', jsonResponse.accessToken)
//                 sessionStorage.setItem('refreshToken', refreshToken)


//                 //refresh page
//                 window.location.reload()


//             } else {    //no new access token retrieved
                
//                 //session expired. Log user out
//                 sessionExpired.innerHTML = 'session expired...logging you out'
//                 sessionExpired.style.color = 'white'
//                 sessionExpired.style.backgroundColor = 'yellow'
//                 sessionExpired.style.padding = '7px'
//                 sessionExpired.style.fontSize = '13px'
//                 sessionExpired.style.display = 'inline-block'
//                 sessionExpired.style.marginTop = '30px'
//                 sessionExpired.style.marginLeft = '2.5%'

//                 setTimeout(logout, 200000)
//             }

//         })

//     }
// }, 100000)




//fetch: user profile details, friends, sent friend requests, received friend requests
var userDetails
var userDetailsResponse

var userDetailsHeader = new Headers()
userDetailsHeader.append('x-access-token', accessToken)

fetch("http://localhost:3000/userDetails", {
        method: 'GET',
        headers: userDetailsHeader
    })
    .then((response) => {
            userDetailsResponse = response

            return response.json()
        })
        .then(jsonResponse => {
            userDetails = jsonResponse
            
            if (userDetailsResponse.status === 200){
                const {
                    name,
                    photo,
                    notifications,
                    friends,
                    sentFriendRequests,
                    receivedFriendRequests
                } = userDetails.details
    

                usernameSection.innerHTML = `${name}`


                notificationsSection.innerHTML = ''

                if (notifications.length === 0) {
                    notificationsSection.innerHTML = '<p class="no-reqs">No notifications yet</p>'
                }

                for (var notification of notifications){
                    notificationsSection.innerHTML += `<div class="notification">
                        <span class="notification-timestamp">${ notification.timestamp }</span>
                        <span class="notification-message">${ notification.message }</span>
                    </div>` 
                }


                friendsList.innerHTML = ''

                if (friends.length === 0) {
                    friendsList.innerHTML = '<p class="no-reqs">No friends yet</p>'
                }

                for (var friend of friends){
                    friendsList.innerHTML += `<div class="friend">
                            <div class="img-container">
                                <img src="../assets/images/test.jpg" class="img" alt="">
                            </div>
                            <span class="name">${ friend.name }</span>
                            <button class="unfriend-button" id=${ friend._id }>unfriend</button>
                            <a href="../markup/chat.html">
                                <button class="chat-button" id=${ friend._id + "." + friend.name.replace(" ", ".") }>chat</button>
                            </a>
                    </div>` 
                }

                var chatButtons = document.querySelectorAll(".chat-button")

                chatButtons.forEach((button) => {
                    button.addEventListener("click", () => {    
                        var buttonID = button.id    //string

                        sessionStorage.setItem('chatMate', buttonID)

                    })
                })



                var unfriendButtons = document.querySelectorAll(".unfriend-button")

                unfriendButtons.forEach((button) => {
                    button.addEventListener("click", () => {
    
                        var buttonID = button.id    //string

                        //send unfriend-id and access token in post request header
                        var unfriendHeader = new Headers()
                        unfriendHeader.append('x-access-token', accessToken)
                        unfriendHeader.append('unfriend-id', buttonID)

                        var unfriendResponse
            
                        fetch("http://localhost:3000/unfriend", {
                            method: 'POST',
                            headers: unfriendHeader
                        })
                        .then(response => {
                            unfriendResponse = response
                
                            return response.json()
                        })
                        .then(jsonResponse => {
                            if (unfriendResponse.status === 200){
                                //show success notification
                                button.innerHTML = 'removed✔'
                                button.style.color = 'green'
                                button.disabled = true
                                
                            } else {
    
                                //show failure notification
                                var failureTextSpan = document.createElement("span")
                                failureTextSpan.innerHTML = "could not complete action"
                                failureTextSpan.style.color = 'red'
                                failureTextSpan.style.fontSize = '13px'
                                failureTextSpan.style.display = 'inline-block'
    
                                button.parentNode.appendChild(failureTextSpan)
                            }
                        })
                    })
                })





                sentList.innerHTML = ''

                if (sentFriendRequests.length === 0) {
                    sentList.innerHTML = '<p class="no-reqs">No sent friend requests</p>'
                }

                for (var request of sentFriendRequests){
                    sentList.innerHTML += `<div class="friend">
                            <div class="img-container">
                               <img src="../assets/images/test.jpg" class="img" alt="">
                            </div>
                            <div class="details">
                                <span class="friend-name">${ request.name }</span>
                                <span class="friend-location">${ request.location }</span>
                                <span class="friend-interests">${ request.interests }</span>
                            </div>
                            <button class="revoke-button" id=${ request._id }>revoke</button>
                    </div>` 
                }

                var revokeButtons = document.querySelectorAll(".revoke-button")

                revokeButtons.forEach((button) => {
                    button.addEventListener("click", () => {
    
                        var buttonID = button.id    //string

                        //send revoke-friend-id and access token in post request header
                        var revokeFriendHeader = new Headers()
                        revokeFriendHeader.append('x-access-token', accessToken)
                        revokeFriendHeader.append('revoke-friend-id', buttonID)

                        var revokeFriendResponse
            
                        fetch("http://localhost:3000/revokeFriend", {
                            method: 'POST',
                            headers: revokeFriendHeader
                        })
                        .then(response => {
                            revokeFriendResponse = response
                
                            return response.json()
                        })
                        .then(jsonResponse => {
                            if (revokeFriendResponse.status === 200){
                                //show success notification
                                button.innerHTML = 'revoked✔'
                                button.style.color = 'green'
                                button.disabled = true
                                
                            } else {
    
                                //show failure notification
                                var failureTextSpan = document.createElement("span")
                                failureTextSpan.innerHTML = "could not complete action"
                                failureTextSpan.style.color = 'red'
                                failureTextSpan.style.fontSize = '13px'
                                failureTextSpan.style.display = 'inline-block'
    
                                button.parentNode.appendChild(failureTextSpan)
                            }
                        })
                    })
                })



                receivedList.innerHTML = ''

                if (receivedFriendRequests.length === 0) {
                    receivedList.innerHTML = '<p class="no-reqs">No friend requests received yet</p>'
                }

                for (var request of receivedFriendRequests) {
                    receivedList.innerHTML += `<div class="friend">
                            <div class="img-container">
                                <img src="../assets/images/test.jpg" class="img" alt="">
                            </div>
                            <div class="details">
                                <span class="friend-name">${ request.name }</span>
                                <span class="friend-location">${ request.location }</span>
                                <span class="friend-interests">${ request.interests }</span>
                            </div>
                            <button class="accept-button" id=${ request._id }>accept</button>
                            <button class="reject-button" id=${ request._id }>reject</button>
                    </div>`
                }



                var acceptButtons = document.querySelectorAll(".accept-button")

                acceptButtons.forEach((button) => {
                    button.addEventListener("click", () => {
    
                        var buttonID = button.id    //string


                        var acceptFriendHeader = new Headers()
                        acceptFriendHeader.append('x-access-token', accessToken)
                        acceptFriendHeader.append('accept-friend-id', buttonID)

                        var acceptFriendResponse
                        
                        fetch("http://localhost:3000/acceptFriend", {
                                method: 'POST',
                                headers: acceptFriendHeader
                            })
                            .then((response) => {
                                    acceptFriendResponse = response
                        
                                    return response.json()
                                })
                                .then(jsonResponse => {
                                    
                                    if (acceptFriendResponse.status === 200){
                                        //show success notification
                                        button.innerHTML = 'accepted✔'
                                        button.style.color = 'green'
                                        button.disabled = true
                                
                                    } else {
    
                                        //show failure notification
                                        var failureTextSpan = document.createElement("span")
                                        failureTextSpan.innerHTML = "could not complete action"
                                        failureTextSpan.style.color = 'red'
                                        failureTextSpan.style.fontSize = '13px'
                                        failureTextSpan.style.display = 'inline-block'
    
                                        button.parentNode.appendChild(failureTextSpan)
                                    }
                               })
                            })
                        })


                        
                var rejectButtons = document.querySelectorAll(".reject-button")

                rejectButtons.forEach((button) => {
                    button.addEventListener("click", () => {
                
                        var buttonID = button.id    //string


                        var rejectFriendHeader = new Headers()
                        rejectFriendHeader.append('x-access-token', accessToken)
                        rejectFriendHeader.append('reject-friend-id', buttonID)

                        var rejectFriendResponse
                        
                        fetch("http://localhost:3000/rejectFriend", {
                                method: 'POST',
                                headers: rejectFriendHeader
                            })
                            .then((response) => {
                                    rejectFriendResponse = response
                        
                                    return response.json()
                                })
                                .then(jsonResponse => {
                                    
                                    if (rejectFriendResponse.status === 200){
                                        //show success notification
                                        button.innerHTML = 'rejected'
                                        button.style.color = 'red'
                                        button.disabled = true
                                
                                    } else {
    
                                        //show failure notification
                                        var failureTextSpan = document.createElement("span")
                                        failureTextSpan.innerHTML = "could not complete action"
                                        failureTextSpan.style.color = 'red'
                                        failureTextSpan.style.fontSize = '13px'
                                        failureTextSpan.style.display = 'inline-block'
    
                                        button.parentNode.appendChild(failureTextSpan)
                                    }
                               })
                            })
                        
                })
            }
        })






//fetch all registered users for rendering on user dashboard
var userData
var userDataResponse

var usersDashboardHeader = new Headers()
usersDashboardHeader.append('x-access-token', accessToken)

fetch("http://localhost:3000/usersDashboard", {
        method: 'GET',
        headers: usersDashboardHeader
    })
    .then((response) => {
           userDataResponse = response

           return response.json()
        })
        .then((jsonResponse) => {
            userData = jsonResponse

            if (userDataResponse.status === 200){
                communitySection.innerHTML = ' '

                for(var profile of userData.users_dashboard){

                    communitySection.innerHTML += `<div class="profile">
                        <div class="image-wrap">
                            <img src="../assets/images/test.jpg" alt="" class="img">
                        </div>
                        <div class="details">
                            <span class="span">${ profile.name }</span>
                            <span class="span">${ profile.location }</span>
                            <span class="span">${ profile.interests }</span>
                            <button class="add-friend" id=${ profile._id }>Add friend</button>
                        </div>
                    <\div>`
                } 
            }


            var addFriendButtons = document.querySelectorAll(".add-friend")
            
            var addFriendResponse
            
            addFriendButtons.forEach((button) => {
                button.addEventListener("click", () => {

                    var buttonID = button.id    //string
            
                    //send potential-friend-id and access token in post request header
                    var addFriendHeader = new Headers()
                    addFriendHeader.append('x-access-token', accessToken)
                    addFriendHeader.append('potential-friend-id', buttonID)
            
            
                    fetch("http://localhost:3000/addFriend", {
                        method: 'POST',
                        headers: addFriendHeader
                    })
                    .then(response => {
                        addFriendResponse = response
            
                        return response.json()
                    })
                    .then(jsonResponse => {
                        if (addFriendResponse.status === 200){
                            //show success notification
                            button.innerHTML = 'Added✔'
                            button.style.color = 'green'
                            button.disabled = true
                            
                        } else {

                            //show failure notification
                            var failureTextSpan = document.createElement("span")
                            failureTextSpan.innerHTML = "could not send request"
                            failureTextSpan.style.color = 'red'
                            failureTextSpan.style.fontSize = '13px'
                            failureTextSpan.style.display = 'inline-block'

                            button.parentNode.appendChild(failureTextSpan)
                        }
                    }) //acct
                
            }) //acct
        }) //acct
        })