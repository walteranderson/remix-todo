import { ActionFunctionArgs, LinksFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { FunctionComponent, useEffect, useRef } from "react";
import { Button } from "~/components/button/button";
import { IconButton } from "~/components/button/icon-button";
import { TextInput } from "~/components/text-input/text-input";
import { Todo, todos } from "~/db.server";
import styles from "~/styles/index.css";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const intent = body.get("intent");

  switch (intent) {
    case "create": {
      const title = body.get("title") as string;
      await todos.create(title);
      break;
    }
    case "toggle-complete": {
      const id = body.get("id") as string;
      try {
        await todos.toggle(Number(id));
      } catch (err) {
        const message = (err as Error).message;
        throw new Response(message, { status: 404 });
      }
      break;
    }
    case "delete": {
      const id = body.get("id") as string;
      await todos.delete(Number(id));
      break;
    }
  }

  return json({ ok: true });
}

export async function loader() {
  return json(await todos.list());
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
  const fetcher = useFetcher();
  const todos = useLoaderData<typeof loader>();
  const submitting = fetcher.state === "submitting";

  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    ref.current?.reset();
  }, [submitting]);

  return (
    <div className="todo-list">
      <h1>Remix Todo</h1>
      {todos.length
        ? todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        : "No todos"}

      <fetcher.Form ref={ref} method="post" className="todo-form">
        <TextInput name="title" placeholder="New Todo" />
        <Button type="submit" name="intent" value="create">
          Add
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
        <p className={todo.completed ? "completed" : ""}>{todo.title}</p>
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
