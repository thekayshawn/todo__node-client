export type Todo = {
  id: number | string;
  title: string;
  completed: boolean;
};

export type NewTodo = Omit<Todo, "id">;

let todos: Todo[] = [];

// Elements
const $todos = document.getElementById("todos")!;
const $getTodos = document.getElementById("getTodos")!;
const $createTodo = document.getElementById("createTodo")!;

if (!$todos || !$getTodos || !$createTodo) {
  throw new Error("Missing elements");
}

function markTodo(id: Todo["id"], completed: Todo["completed"]) {
  console.log({ id, completed });

  fetch(`http://localhost:3000/todos?id=${id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((todo) => {
      todos = todos.map((t) => (t.id == todo.id ? todo : t));
      renderTodos();
    });
}

function removeTodo(id: Todo["id"]) {
  fetch(`http://localhost:3000/todos?id=${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((todo) => {
      console.log({ todo });
      todos = todos.filter((t) => t.id != todo.id);
      renderTodos();
    });
}

function renderTodos() {
  $todos.innerHTML = "";

  todos.forEach(({ id, title, completed }) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const removeButton = document.createElement("button");

    checkbox.id = title;
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.onchange = (e) =>
      markTodo(id, (e.target as HTMLInputElement).checked);

    label.htmlFor = title;
    label.innerText = title;

    removeButton.innerText = "Remove";
    removeButton.onclick = () => removeTodo(id);

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(removeButton);

    if (completed) li.style.textDecoration = "line-through";

    $todos.appendChild(li);
  });
}

// Get Todos
$getTodos.addEventListener("click", (e) => {
  e.preventDefault();

  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((data) => {
      todos = data;
      renderTodos();
    });
});

// Create Todo
$createTodo.addEventListener("submit", (e: Event) => {
  e.preventDefault();

  const target = e.target as HTMLFormElement;
  const title = (target.elements.namedItem("title") as HTMLInputElement).value;

  fetch(`http://localhost:3000/todos`, {
    method: "POST",
    body: JSON.stringify({ title }),
  })
    .then((res) => res.json())
    .then((todo) => {
      todos.push(todo);
      renderTodos();
    });
});
