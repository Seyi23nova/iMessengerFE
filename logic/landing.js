var communitySection = document.getElementById("community")
var loginButton = document.getElementById("login")
var signupButton = document.getElementById("signup")
var dashboardButton = document.getElementById("dashboard")
var logoutButton = document.getElementById("logout")
var logoutError = document.getElementById("logout-error")



var accessToken = sessionStorage.getItem('accessToken')
var refreshToken = sessionStorage.getItem('refreshToken')

if (accessToken){
    loginButton.remove()
    signupButton.remove()
} else {
    dashboardButton.remove()
    logoutButton.remove()
}




//fetch all registered users from api
var userData
var serverResponse

fetch("http://localhost:3000/users", {
        method: 'GET',
    })
    .then((response) => {
           serverResponse = response

           return response.json()
        })
        .then(jsonResponse => {
            userData = jsonResponse

            if (serverResponse.status === 200){
                communitySection.innerHTML = ' '

                for(var profile of userData.allUsers){

                    communitySection.innerHTML += `<div class="profile">
                        <div class="image-wrap">
                            <img src="../assets/images/test.jpg" alt="" class="img">
                        </div>
                        <div class="details">
                            <span class="span">${ profile.name }</span>
                            <span class="span">${ profile.location }</span>
                            <span class="span">${ profile.interests }</span>
                        </div>
                    <\div>`
                } 
            }
        })




var logoutHeader = new Headers()
logoutHeader.append('x-refresh-token', refreshToken)

logoutButton.addEventListener("click", function(){

    //invalidate refresh token in api
    fetch("http://localhost:3000/auth/logout", {
        method: 'POST',
        headers: logoutHeader
    })
    .then((response) => {
        if (response.status === 200) {
            //wipe off tokens
            sessionStorage.removeItem('accessToken')
            sessionStorage.removeItem('refreshToken')


            window.location.reload()

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

})