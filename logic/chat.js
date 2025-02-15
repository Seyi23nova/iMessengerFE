var friendNameContainer = document.getElementById("friend-name")
var textMessage = document.getElementById("text-message")
var sendButton = document.getElementById("send")
var sendMessageForm = document.getElementById("sendMessageForm")
var serverResponseContainer = document.getElementById("serverResponse")
var messagesContainer = document.getElementById("messages-container")

//access and refresh tokens
var accessToken = sessionStorage.getItem('accessToken')
var refreshToken = sessionStorage.getItem('refreshToken')

if (!accessToken){  //no access token
    window.location.href = "../markup/landing.html"
}


var friendDetails = sessionStorage.getItem('chatMate').split(".")
var friendID = friendDetails[0]

friendNameContainer.innerHTML = friendDetails[1] + " " + (friendDetails[2] || " ")


//fetch existing messages
var userHeader = new Headers()
userHeader.append('x-access-token', accessToken)
userHeader.append('friend-id', friendID)

var getMessagesResponse
var messages

fetch("http://onlinemessenger.eastus.cloudapp.azure.com:1337/messages", {
    method: 'GET',
    headers: userHeader
})
.then((response) => {
        getMessagesResponse = response

        return response.json()
    })
    .then(jsonResponse => {
        messages = jsonResponse
        
        if (getMessagesResponse.status === 200){
            const messagesList = messages.allMessages //array of message objects
            messagesList.forEach(message => {
                const msg = document.createElement('div')
                msg.classList.add('message')

                if (message.receiver == friendID){
                    msg.classList.add('right')
                }else {
                    msg.classList.add('left')
                }
                msg.textContent = message.content
                messagesContainer.append(msg)
            });
        } else {
            sessionStorage.removeItem('accessToken')
            window.location.href = "../markup/login.html"
            console.log("messages not fetched")
            //present error here
        }
    })


//send a new messsage
var messageHeader = new Headers()
messageHeader.append('x-access-token', accessToken)
messageHeader.append('friend-id', friendID)


var sendMessageResponse
var message
sendMessageForm.addEventListener("submit", 
    function(e){

        e.preventDefault()

        var formData = new FormData(e.target)

        fetch("http://onlinemessenger.eastus.cloudapp.azure.com:1337/messages/sendMessage", {
            method: 'POST',
            headers: messageHeader,
            body: formData
        })
        .then((response) => {
                sendMessageResponse = response
        
                return response.json()
            })
            .then(jsonResponse => {
                message = jsonResponse
                
                if (sendMessageResponse.status === 200){
                    serverResponseContainer.innerHTML = '<span class="notification-success">message sent</span>'
                    textMessage.value = ""

                    setTimeout(()=>{
                        serverResponseContainer.innerHTML = ""
                    }, 2000)

                } else {
                    serverResponseContainer.innerHTML = '<span class="notification-failure">message not sent</span>'

                    setTimeout(()=>{
                        serverResponseContainer.innerHTML = ""
                    }, 2000)
                }
            })
    }
)