import { FastifyInstance } from "fastify";
import db from "../db";
import { authenticate } from "../middleware/authenticate";

export default async function debugRoutes(app: FastifyInstance) {
    // UserList GET (For debugging)
    app.get("/userlist", async () => {
        const userlist = db.prepare("SELECT * FROM users").all();
        return {
            users: userlist
        };
    });

    // Protected route
    app.get("/protected", { preHandler: authenticate }, async (request: any) => {
        return { message: `Hello ${request.user.username}` };
    });
}