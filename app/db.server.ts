import { PrismaClient, Todo } from "@prisma/client";

const db = new PrismaClient();

export { db, type Todo };
