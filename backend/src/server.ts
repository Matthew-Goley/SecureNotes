import Fastify from "fastify";

const app = Fastify();

// Time GET
app.get("/info", async () => {
    const message = new Date().toISOString();
    return {
        name: "Secure Notes API",
        version: "0.0.1",
        timestamp: message
    };
});

// Echo POST
app.post("/echo", async (request, reply) => {
    return request.body;
});

// Greet POST
app.post("/greet", async (request, reply) => {
    const { name } = request.body as { name: string};

    return {
        message: `Hello: ${name}`
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