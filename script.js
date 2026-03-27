let isLoginMode = true;

function toggleMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('form-title');
    const subtext = document.getElementById('form-subtext');
    const btn = document.getElementById('main-btn');
    const toggleLink = document.getElementById('toggle-msg');

    if (isLoginMode) {
        title.innerHTML = "Welcome<span>Back</span>";
        subtext.innerText = "Enter your credentials to access the hub";
        btn.innerText = "Login";
        toggleLink.innerHTML = "Don't have an account? <span onclick='toggleMode()'>Create Account</span>";
    } else {
        title.innerHTML = "Create<span>Account</span>";
        subtext.innerText = "Join the engineering community";
        btn.innerText = "Sign Up";
        toggleLink.innerHTML = "Already have an account? <span onclick='toggleMode()'>Login</span>";
    }
}

function handleAuth() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const error = document.getElementById('error-msg');

    if (!user || !pass) {
        error.innerText = "Please fill in all fields";
        return;
    }

    if (isLoginMode) {
        const storedPass = localStorage.getItem(`user_${user}`);
        if (storedPass && storedPass === pass) {
            window.location.href = "./hub/index.html";
        } else {
            error.innerText = "Invalid username or password";
        }
    } else {
        if (localStorage.getItem(`user_${user}`)) {
            error.innerText = "Username already exists";
        } else {
            localStorage.setItem(`user_${user}`, pass);
            alert("Account created successfully! Please login.");
            toggleMode();
        }
    }
}