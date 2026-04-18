import Fastify from "fastify";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { request } from "node:http";

const app = Fastify();

const JWT_SECRET = "your-secret-key-idk-tbh";

// SQLite table
const db = new Database("../database/users.db"); // creates the file if it doesnt already exist

// Authenticate func
const authenticate = async (request: any, reply: any) => {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
        return reply.status(401).send({ success: false, message: "No token provided" });

    }

    const token = authHeader.split(" ")[1]; // pulls token out of "Bearer <token>"

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
        request.user = decoded; // attach user info to request
    } catch {
        return reply.status(401).send({ success: false, message: "Invalid or expired token" });
    }
};

// Run at startup to create the table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
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
        message: "User Created"
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

    // Token
    const token = jwt.sign(
        { id: user.id, username: user.username},
        JWT_SECRET,
        { expiresIn: "7d"}
    );

    return {
        success: true,
        message: "Login Successful",
        token: token
    };
});

// Protected route
app.get("/protected", { preHandler: authenticate }, async (request: any) => {
    return { message: `Hello ${request.user.username}` };
});

// Notes (protected)
app.post("/notes", { preHandler: authenticate }, async (request: any) => {
    const { title, content } = request.body as {
        title: string;
        content: string;
    }

    db.prepare("INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)").run(request.user.id, title, content);

    return {
        success: true,
        message: "Note Inserted"
    };
})

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