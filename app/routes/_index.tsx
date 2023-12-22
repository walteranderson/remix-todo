import { ActionFunctionArgs, LinksFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { FunctionComponent } from "react";
import { Button } from "~/components/button/button";
import { IconButton } from "~/components/button/icon-button";
import { TextInput } from "~/components/text-input/text-input";
import { Todo, db } from "~/db.server";
import styles from "~/styles/index.css";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const intent = body.get("intent");

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
  const todos = await db.todo.findMany();
  return json(todos);
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
  const fetcher = useFetcher();
  const todos = useLoaderData<typeof loader>();
  return (
    <div className="todo-list">
      <h1>Remix Todo</h1>
      {todos.length
        ? todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        : "No todos"}

      <fetcher.Form method="post">
        <TextInput name="title" placeholder="Title" />
        <Button type="submit" name="intent" value="create">
          Test
        </Button>
      </fetcher.Form>
    </div>
  );
}

const TodoItem: FunctionComponent<{ todo: Todo }> = ({ todo }) => {
  const fetcher = useFetcher();

  return (
    <div className="todo-item">
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={todo.id} />
        <IconButton
          icon={
            todo.completed
              ? "ic:baseline-check-box"
              : "ic:baseline-check-box-outline-blank"
          }
          type="submit"
          name="intent"
          value="toggle-complete"
        />
        <p style={{ textDecoration: todo.completed ? "line-through" : "" }}>
          {todo.title}
        </p>
        <IconButton
          icon="ic:baseline-delete"
          type="submit"
          name="intent"
          value="delete"
        />
      </fetcher.Form>
    </div>
  );
};
