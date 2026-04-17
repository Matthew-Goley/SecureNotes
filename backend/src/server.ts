import Fastify from "fastify";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import { hash } from "node:crypto";
import { ALL } from "node:dns";

const app = Fastify();

// TEST SQLite
const db = new Database("../database/users.db"); // creates the file if it doesnt already exist

// Run at startup to create the table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

// Time GET
app.get("/info", async () => {
    const message = new Date().toISOString();
    return {
        name: "Secure Notes API",
        version: "0.0.1",
        timestamp: message
    };
});

// UserList GET (For debugging)
app.get("/userlist", async () => {
    const userlist = db.prepare("SELECT * FROM users").all();
    return {
        users: userlist
    };
});

// Signup POST
app.post("/signup", async (request, reply) => {
    const { username, password } = request.body as { 
        username: string;
        password: string;
    }

    // Check Empty
    if (!username || !password) {
        return {
            success: false,
            message: "Username and Password Required"
        };
    }

    // Check Duplicate
    const existingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

    if (existingUser) {
        return {
            success: false,
            message: "Username Already in Use"
        };
    }
    
    // Create User and encrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Push to db
    db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashedPassword);

    return {
        success: true,
        message: "User Created",
    };
});

// Login POST
app.post("/login", async (request, reply) => {
    const { username, password } = request.body as {
        username: string,
        password: string
    };

    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as { id: number; username: string; password: string } | undefined;

    if (!user) {
        return {
            success: false,
            message: "User Not Found"
        };
    }
    
    // Compare dehashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return {
            success: false,
            message: "Invalid Password"
        };
    }

    return {
        success: true,
        message: "Login Successful"
    };
});

// Start server
const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log("Server running on http://localhost:3000");
    }   catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();