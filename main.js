"use strict";

// Selectors

let taskInput = document.querySelector(".taskInput");
let addTask = document.querySelector(".addTask");
let dltAll = document.querySelector(".dlt-all");
let tasks = document.querySelector(".tasks");

dltAll.onclick = () => {
  tasks.innerHTML = "";
  arrayOfTasks = [];
  localStorage.removeItem("tasks");
};

let arrayOfTasks = [];

if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
  addTaskToPageFromArray(arrayOfTasks);
}

getDataFromLocalStorage();

function getDataFromLocalStorage() {
  let data = localStorage.getItem("tasks");
  if (data) {
    let tasksInteral = JSON.parse(data);
    addTaskToPageFromArray(tasksInteral);
  }
}

addTask.onclick = function () {
  if (taskInput.value) {
    let taskItem = {
      title: taskInput.value,
      id: Date.now(), // unique id
      complete: false,
    };
    taskInput.placeholder = "Your tasks...";
    taskInput.value = "";
    taskInput.focus();
    addTaskToArray(taskItem);
  } else {
    taskInput.placeholder = "Please write at least one task...";
    let handler = setTimeout(() => {
      taskInput.classList.add("emptyEffect");
      clearInterval(handler);
      let interal = setTimeout(() => {
        taskInput.classList.remove("emptyEffect");
        clearInterval(interal);
      }, 1000);
    }, 0);
  }
};

function addTaskToArray(task) {
  arrayOfTasks.push(task);
  addTaskToPageFromArray(arrayOfTasks);
  addTaskToLocalStorageFrom(arrayOfTasks);
}

function addTaskToPageFromArray(array) {
  tasks.innerHTML = "";
  array.forEach((task) => {
    let taskItem = document.createElement("div");
    taskItem.setAttribute("data-id", task.id);
    taskItem.className = "taskItem";

    let checkIconDiv = document.createElement("div");
    checkIconDiv.className = "checkIconDiv";
    let checkIcon = document.createElement("i");
    checkIcon.className = "fa-regular fa-square checkIcon";
    checkIconDiv.appendChild(checkIcon);

    if (task.complete) {
      taskItem.classList.add("completed");
      checkIcon.className = "fa-regular fa-square-check";
    }

    let taskTitle = document.createElement("span");
    taskTitle.className = "taskTitle";
    taskTitle.appendChild(document.createTextNode(task.title));

    let deleteIconDiv = document.createElement("div");
    deleteIconDiv.className = "dltIconDiv";
    let deleteIcon = document.createElement("i");
    deleteIcon.id = task.id;
    deleteIcon.className = "fa-regular fa-trash-can dltIcon";
    deleteIconDiv.appendChild(deleteIcon);

    taskItem.prepend(checkIconDiv);
    taskItem.appendChild(taskTitle);
    taskItem.appendChild(deleteIconDiv);
    tasks.appendChild(taskItem);

    manageDlt(tasks.children, taskItem);

    manageSelecterIcon(taskItem, checkIcon);
  });
}

function addTaskToLocalStorageFrom(array) {
  window.localStorage.setItem("tasks", JSON.stringify(array));
}

function manageDlt(tasksLenght, taskItem) {
  if (tasksLenght) {
    taskItem.addEventListener("click", (e) => {
      if (e.target.id == taskItem.getAttribute("data-id")) {
        taskItem.remove();
        arrayOfTasks = arrayOfTasks.filter((task) => task.id != e.target.id);
        addTaskToLocalStorageFrom(arrayOfTasks);
        addTaskToPageFromArray(arrayOfTasks);
      }
    });
  }
}

function manageSelecterIcon(taskItem, checkIcon) {
  taskItem.addEventListener("click", (e) => {
    let targetItem = e.currentTarget;
    if (targetItem.getAttribute("id") == taskItem.getAttribute("id")) {
      targetItem.classList.toggle("completed");
      if (targetItem.classList.contains("completed")) {
        checkIcon.className = "fa-regular fa-square-check";
      } else {
        checkIcon.className = "fa-regular fa-square";
      }
      arrayOfTasks.map((task) => {
        if (task.id == targetItem.getAttribute("data-id")) {
          if (task.complete == false) {
            task.complete = true;
            addTaskToLocalStorageFrom(arrayOfTasks);
          } else {
            task.complete = false;
            addTaskToLocalStorageFrom(arrayOfTasks);
          }
        }
      });
    }
  });
}
