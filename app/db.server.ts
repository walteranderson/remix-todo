import { PrismaClient, Todo } from "@prisma/client";

const db = new PrismaClient();

export { type Todo };

export const todos = {
  list: async () => {
    const todos = await db.todo.findMany();
    return todos;
  },

  create: async (title: string) => {
    const todo = await db.todo.create({
      data: {
        title,
        completed: false,
      },
    });
    return todo;
  },

  toggle: async (id: number) => {
    const todo = await db.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new Error("Todo not found");
    }

    const updated = await db.todo.update({
      data: {
        completed: !todo.completed,
      },
      where: { id },
    });
    return updated;
  },

  delete: async (id: number) => {
    await db.todo.delete({ where: { id } });
  },
};
