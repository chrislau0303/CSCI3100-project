function reset() {
    password = document.getElementById('pw1').value
    password2 = document.getElementById('pw2').value
    passwordOK = true

    console.log(password)
    console.log(password2)
    if (password.length < 8) {
        alert('Password must be at least 8 characters long')
        passwordOK = false
    }
    if (!/\d/.test(password) || /^\d+$/.test(password)) {
        alert('Password must contain both characters and digits')
        passwordOK = false
    }
    if (passwordOK && password2 != password) {
        alert('Password does not match')
        passwordOK = false
    }
    if (!passwordOK) return false
}