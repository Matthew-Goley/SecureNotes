import Fastify from "fastify";
import authRoutes from "./routes/auth";
import noteRoutes from "./routes/notes";
import debugRoutes from "./routes/debug";

const app = Fastify();

app.register(authRoutes);
app.register(noteRoutes);
app.register(debugRoutes);

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