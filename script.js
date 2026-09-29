let tasks = [];

const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const dueDate = document.getElementById("due-date");
const errorMsg = document.getElementById("error-msg");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll("#filter-buttons button");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

let currentFilter = "all";
let searchText = "";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
}

function addTask(name, priority, date) {
  if (name.trim() === "") {
    errorMsg.textContent = "Task cannot be empty";
    return;
  }
  errorMsg.textContent = "";
  tasks.push({ id: Date.now(), name, priority, date, completed: false });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks.forEach(task => {
    if (task.id === id) task.completed = !task.completed;
  });
  saveTasks();
  renderTasks();
}

function editTask(id, newName) {
  tasks.forEach(task => {
    if (task.id === id) task.name = newName;
  });
  saveTasks();
  renderTasks();
}

function searchTasks(list) {
  return list.filter(task =>
    task.name.toLowerCase().includes(searchText.toLowerCase())
  );
}

function filterTasks() {
  let result = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });
  return searchTasks(result);
}

function renderTasks() {
  taskList.innerHTML = "";
  const visible = filterTasks();

  visible.forEach(task => {
    const li = document.createElement("li");
    li.dataset.priority = task.priority;
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span>${task.name} (${task.priority}) ${task.date ? "- " + task.date : ""}</span>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    `;

    li.querySelector("input").addEventListener("change", () => toggleTask(task.id));
    li.querySelector(".delete").addEventListener("click", () => deleteTask(task.id));
    li.querySelector(".edit").addEventListener("click", () => {
      const newName = prompt("Edit task:", task.name);
      if (newName !== null) editTask(task.id, newName);
    });

    taskList.appendChild(li);
  });

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  taskCount.textContent = `Total: ${total} | Active: ${total - completed} | Completed: ${completed}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value, prioritySelect.value, dueDate.value);
  taskInput.value = "";
  dueDate.value = "";
});

searchInput.addEventListener("input", (e) => {
  searchText = e.target.value;
  renderTasks();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

loadTasks();
renderTasks();