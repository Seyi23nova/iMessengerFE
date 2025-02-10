var friendNameContainer = document.getElementById("friend-name")
var textMessage = document.getElementById("message")
var sendButton = document.getElementById("send")



var friendDetails = sessionStorage.getItem('chatMate').split(".")
var friendID = friendDetails[0]

friendNameContainer.innerHTML = friendDetails[1] + " " + friendDetails[2]


//fetch existing messages
var userHeader = new Headers()
userHeader.append('x-access-token', accessToken)
userHeader.append('friend-id', friendID)

var getMessagesResponse
var messages

fetch("http://imessenger.eastus.cloudapp.azure.com:1337/messages", {
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
            console.log("here")

        }
    })


//send a new messsage
var messageHeader = new Headers()
messageHeader.append('x-access-token', accessToken)
messageHeader.append('friend-id', friendID)


var getMessagesResponse
var messages
sendButton.addEventListener("click", 
    () => {
        if(textMessage.innerHTML == "") return

        var content = textMessage.innerHTML
        console.log(content)
        messageHeader.append('content', content)
    }
)