var loginForm = document.getElementById("loginForm")
var serverResponseContainer = document.getElementById("serverResponse")
var submitButton = document.getElementById("submit")




var accessToken = sessionStorage.getItem('accessToken')
var refreshToken = sessionStorage.getItem('refreshToken')

if (accessToken){
    window.location.href = "../markup/dashboard.html"
}




var serverResponse

loginForm.addEventListener("submit", function(e){
    e.preventDefault()
    
    var formData = new FormData(e.target)

    submitButton.disabled = true
    submitButton.style.backgroundColor = "rgb(185, 182, 182)"

    
    fetch("http://localhost:3000/auth/login", {
        method: 'POST',
        body: formData
    })
    .then((response) => {
            serverResponse = response

            return response.json()
        })
        .then(jsonResponse => {

            var responseData = jsonResponse

            if (serverResponse.status === 200){

                sessionStorage.setItem('accessToken', responseData.accessToken)
                sessionStorage.setItem('refreshToken', responseData.refreshToken)

                // redirect to user dashboard page
                window.location.href = "../markup/dashboard.html"
            
            } else if (serverResponse.status === 401) {
                //invalid email or password notification
                serverResponseContainer.innerHTML = '<span class="notification-failure">Invalid email or password</span>'
                submitButton.disabled = false


            } else {
                //internal server error notification
                serverResponseContainer.innerHTML = '<span class="notification-internalError">Internal server error. Please try again later</span>'
                submitButton.disabled = false

            }

        })

})