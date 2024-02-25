class Task {
    constructor(id, content, completed) {
      this.id = id;
      this.content = content;
      this.completed = completed;
    }
  }
  
  // UI class
  class UI {
    static displayTasks() {
      const tasks = Store.getTasks();
  
      tasks.forEach((task) => UI.addTaskToList(task));
    }
  
    static addTaskToList(task) {
      const taskList = document.getElementById('taskList');
      const taskItem = document.createElement('li');
      taskItem.classList.add('taskItem');
      taskItem.innerHTML = `
        <div class="inputItems">
        <input type="checkbox" onchange="UI.toggleTaskCompletion(${task.id})" ${task.completed ? 'checked' : ''}>
        <input id="${task.id}" class="todo ${task.completed? "completed": ''}" type="text" disabled value="${task.content}" />
        </div>
        <div class="actionButtons">
        <button class="material-icons edit" onclick="UI.editTask(${task.id})">edit</button>
        <button class="material-icons remove" onclick="UI.removeTask(${task.id})">remove</button>
        </div>
      `;
      taskList.appendChild(taskItem);
    }
  
    static toggleTaskCompletion(id) {
      let todo = document.getElementById(`${id}`)
      const tasks = Store.getTasks();
      const taskIndex = tasks.findIndex(task => task.id === id);
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      Store.saveTasks(tasks);
      if (tasks[taskIndex].completed) {
        todo.classList.add('completed')
      }else {
        todo.classList.remove('completed')
      }
    }

    static editTask(id) {
      const inputEl = document.getElementById(`${id}`)
      inputEl.removeAttribute('disabled')
      inputEl.focus()

      const tasks = Store.getTasks();
      const selectedTask = tasks.findIndex(task => task.id === id);

      inputEl.addEventListener("blur", () => {
        inputEl.setAttribute("disabled", "")
        tasks[selectedTask].content = inputEl.value
        Store.saveTasks(tasks);
      })
    }
  
    static removeTask(id) {
      const tasks = Store.getTasks().filter(task => task.id !== id);
      Store.saveTasks(tasks);
      UI.clearTasks();
      UI.displayTasks();
    }
  
    static clearTasks() {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
    }
  }
  
  // Store class
  class Store {
    static getTasks() {
      let tasks;
      if (localStorage.getItem('tasks') === null) {
        tasks = [];
      } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
      }
      return tasks;
    }
  
    static saveTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }
  
  // Event: Display tasks
  document.addEventListener('DOMContentLoaded', UI.displayTasks);
  
  // Event: Add a task
  function addTask() {
    const taskInput = document.getElementById('taskInput');
    const content = taskInput.value.trim();
    if (content !== '') {
      const tasks = Store.getTasks();
      const id = new Date().getTime();
      const task = new Task(id, content, false);
      tasks.push(task);
      Store.saveTasks(tasks);
      UI.clearTasks();
      UI.displayTasks();
      taskInput.value = '';
    }
  }