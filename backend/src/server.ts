import Fastify from "fastify";
import bcrypt from "bcrypt";

const app = Fastify();

const users: { username: string, password: string}[] = [];

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
    const userlist = users;
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
    const existingUser = users.find(
        user => user.username === username
    );

    if (existingUser) {
        return {
            success: false,
            message: "Username Already in Use"
        };
    }
    
    // Create User and encrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    return {
        success: true,
        message: "User Created",
        totalUsers: users.length
    };
});

// Login POST
app.post("/login", async (request, reply) => {
    const { username, password } = request.body as {
        username: string,
        password: string
    };

    const user = users.find(
        user => user.username === username
    );

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