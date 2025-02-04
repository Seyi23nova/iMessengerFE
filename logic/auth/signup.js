var signUpForm = document.getElementById("signupForm")
var serverResponseContainer = document.getElementById("serverResponse")
var submitButton = document.getElementById("submit")




var accessToken = sessionStorage.getItem('accessToken')
var refreshToken = sessionStorage.getItem('refreshToken')

if (accessToken){
    window.location.href = "../markup/dashboard.html"
}




signUpForm.addEventListener("submit", function(e){
    e.preventDefault()
    
    var formData = new FormData(e.target)

    submitButton.disabled = true
    submitButton.style.backgroundColor = "rgb(185, 182, 182)"

    fetch("http://localhost:3000/auth/signup", {
        method: 'POST',
        body: formData
    })
    .then(response => {
        var status = response.status

        if (status === 200){
            //notification of successful registration
            serverResponseContainer.innerHTML = '<span class="notification-success">Registration successful. Redirecting to login page</span>'


            //redirect to login page after 3s
            setTimeout(function(){
                window.location.href = "../markup/login.html"
            }, 3000)


        } else if (status === 400) {
            //user already exists notification
            serverResponseContainer.innerHTML = '<span class="notification-failure">User with this email already exists</span>'

            //refresh page after 3s
            setTimeout(function(){
                window.location.reload()
            }, 3000)


        } else {
            //internal server error notification
            serverResponseContainer.innerHTML = '<span class="notification-internalError">Internal server error. Please try again later</span>'

        }

    })
})