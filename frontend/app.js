let token = null;

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

async function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        token = data.token;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('notes-section').style.display = 'block';
    } else {
        alert(data.message);
    }
}

async function signup() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        alert("Account created! You can now log in.");
    } else {
        alert(data.message);
    }
}

document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("signup-btn").addEventListener("click", signup);