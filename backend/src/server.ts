import Fastify from "fastify";

const app = Fastify();

// Hello
app.get("/hello", async (request, reply) => {
    return {message: "Whats up World"};
});

// Ping-Pong
app.get("/ping", async (request, reply) => {
    return {message: "Pong"};
});

app.get("/info", async (request, reply) => {
    const message = new Date().toISOString();
    return {
        name: "Secure Notes API",
        version: "0.0.1",
        timestamp: message
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