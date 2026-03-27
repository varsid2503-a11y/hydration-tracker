let isLoginMode = true;

window.onload = function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = "./hub/index.html";
    }
};

function toggleMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('form-title');
    const btn = document.getElementById('main-btn');
    const toggleLink = document.getElementById('toggle-msg');
    const dobContainer = document.getElementById('dob-container');

    if (isLoginMode) {
        title.innerHTML = "Welcome<span>Back</span>";
        btn.innerText = "Login";
        dobContainer.style.display = "none";
        toggleLink.innerHTML = "Don't have an account? <span onclick='toggleMode()'>Create Account</span>";
    } else {
        title.innerHTML = "Create<span>Account</span>";
        btn.innerText = "Sign Up";
        dobContainer.style.display = "block";
        toggleLink.innerHTML = "Already have an account? <span onclick='toggleMode()'>Login</span>";
    }
}

function handleAuth() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;
    const remember = document.getElementById('remember').checked;
    const error = document.getElementById('error-msg');

    if (!user || !pass || (!isLoginMode && !dob)) {
        error.innerText = "Please fill in all fields";
        return;
    }

    if (isLoginMode) {
        const storedData = JSON.parse(localStorage.getItem(`user_${user}`));
        if (storedData && storedData.pass === pass) {
            if (remember) localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', user);
            localStorage.setItem('currentDOB', storedData.dob); 
            window.location.href = "./hub/index.html";
        } else {
            error.innerText = "Invalid username or password";
        }
    } else {
        if (localStorage.getItem(`user_${user}`)) {
            error.innerText = "Username already exists";
        } else {
            const userData = { pass: pass, dob: dob };
            localStorage.setItem(`user_${user}`, JSON.stringify(userData));
            alert("Account created! Please login.");
            toggleMode();
        }
    }
}