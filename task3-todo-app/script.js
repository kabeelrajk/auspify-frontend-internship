// ---------- Elements ----------
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const countText = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filter");

// ---------- State ----------
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ---------- Save to Local Storage ----------
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------- Render tasks on screen ----------
function renderTasks() {
  list.innerHTML = "";

  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "pending") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, text, deleteBtn);
    list.appendChild(li);
  });

  const pendingCount = tasks.filter((t) => !t.done).length;
  countText.textContent = `${pendingCount} pending / ${tasks.length} total`;
}

// ---------- Add ----------
function addTask(text) {
  tasks.push({
    id: Date.now(),
    text: text,
    done: false,
  });
  saveTasks();
  renderTasks();
}

// ---------- Toggle complete ----------
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  saveTasks();
  renderTasks();
}

// ---------- Delete ----------
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// ---------- Events ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === "") return;
  addTask(text);
  input.value = "";
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ---------- Initial load ----------
renderTasks();