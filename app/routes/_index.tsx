import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { FunctionComponent } from "react";
import { Todo, db } from "~/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const intent = body.get("intent");
  console.log(intent);

  switch (intent) {
    case "create": {
      const title = body.get("title") as string;
      await db.todo.create({ data: { title, completed: false } });
      break;
    }
    case "toggle-complete": {
      const id = body.get("id") as string;
      const todo = await db.todo.findUnique({ where: { id: Number(id) } });
      if (!todo) {
        throw new Response("Not Found", { status: 404 });
      }

      await db.todo.update({
        data: {
          completed: !todo.completed,
        },
        where: { id: Number(id) },
      });
      break;
    }
    case "delete": {
      const id = body.get("id") as string;
      await db.todo.delete({ where: { id: Number(id) } });
      break;
    }
  }

  return json({ ok: true });
}

export async function loader() {
  console.log("loader");
  const todos = await db.todo.findMany();
  return json(todos);
}

export default function Index() {
  const fetcher = useFetcher();
  const todos = useLoaderData<typeof loader>();
  return (
    <>
      {todos.length
        ? todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        : "No todos"}

      <fetcher.Form method="post">
        <input type="text" name="title" placeholder="Title" />
        <button type="submit" name="intent" value="create">
          Submit
        </button>
      </fetcher.Form>
    </>
  );
}

const TodoItem: FunctionComponent<{ todo: Todo }> = ({ todo }) => {
  const fetcher = useFetcher();

  return (
    <div>
      <p style={{ textDecoration: todo.completed ? "line-through" : "" }}>
        {todo.title}
      </p>
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={todo.id} />
        <button type="submit" name="intent" value="toggle-complete">
          {todo.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button type="submit" name="intent" value="delete">
          Delete
        </button>
      </fetcher.Form>
    </div>
  );
};
