import Fastify from "fastify";

const app = Fastify();

// Test route
app.get("/hello", async (request, reply) => {
    return {message: "Whats up World"};
});

// Ping-Pong
app.get("/ping", async (request, reply) => {
    return {message: "Pong"};
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