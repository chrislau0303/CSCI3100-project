// checks the basic requirement of the input
function register() {
    username = document.getElementById('username').value
    password = document.getElementById('password').value
    password2 = document.getElementById('password2').value
    email = document.getElementById('email').value
    passwordOK = true
    emailOK = true

    // check email if it contains @
    if (email.indexOf("@") == -1) {
        alert("Not a valid email");
        emailOK = false;
    }
    // check password length
    if (password.length < 8) {
        alert('Password must be at least 8 characters long')
        passwordOK = false
    }
    // check password contains both alphabet and digits
    if (!/\d/.test(password) || /^\d+$/.test(password)) {
        alert('Password must contain both characters and digits')
        passwordOK = false
    }
    // check the second password equal the first one
    if (passwordOK && password2 != password) {
        alert('Password does not match')
        passwordOK = false
    }

    if (!passwordOK || !emailOK) return false
}