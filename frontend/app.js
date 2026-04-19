let token = localStorage.getItem("token");
let editingId = null;

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
        localStorage.setItem("token", token);
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('notes-section').style.display = 'block';
        loadNotes();
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

async function loadNotes() {
    const response = await fetch("http://localhost:3000/getnotes", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();
    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = "";

    data.notes.forEach(note => {
        const li = document.createElement("li");
        li.textContent = `${note.title}: ${note.content}`;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => startEdit(note));
        li.appendChild(editBtn);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteNote(note.id));
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

async function deleteNote(id) {
    const response = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (data.success) {
        loadNotes();
    } else {
        alert(data.message);
    }
}

function startEdit(note) {
    document.getElementById("note-title").value = note.title;
    document.getElementById("note-content").value = note.content;
    editingId = note.id;
    document.getElementById("add-note-btn").textContent = "Save Edit";
}

async function addNote() {
    const title = document.getElementById("note-title").value;
    const content = document.getElementById("note-content").value;

    let response;
    if (editingId) {
        response = await fetch(`http://localhost:3000/notes/${editingId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });
    } else {
        response = await fetch("http://localhost:3000/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });
    }

    const data = await response.json();

    if (data.success) {
        document.getElementById("note-title").value = "";
        document.getElementById("note-content").value = "";
        editingId = null;
        document.getElementById("add-note-btn").textContent = "Add Note";
        loadNotes();
    } else {
        alert(data.message);
    }
}

function logout() {
    token = null;
    localStorage.removeItem("token");
    document.getElementById('notes-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
}

if (token) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('notes-section').style.display = 'block';
    loadNotes();
}

document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("signup-btn").addEventListener("click", signup);
document.getElementById("add-note-btn").addEventListener("click", addNote);