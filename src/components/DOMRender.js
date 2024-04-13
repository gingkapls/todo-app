import TaskFilter from "./TaskFilter";
import DBHelper from "./DBHelper";
import Task from "./Task";
import { format, constructFrom, addDays } from "date-fns";

const DOMRender = class {
  constructor() {
    this.todayContainer = document.querySelector(".today-container");
    this.restContainer = document.querySelector(".rest-container");
    this.noteContainer = document.querySelector(".notes");
    this.projectListContainer = document.querySelector(".project-list");
    this.dialogAddTask = document.querySelector(".dialog-add-task");
    this.formAddTask = document.querySelector(".form-add-task");

    this.btnHome = document.querySelector("#btn-home");

    // this.dialogAddTask.show();
    console.log(DBHelper.getAllTasks());

    this.displayProject({ id: 0 });
    this.displayProjectList();
    this.addProjectEventListener();
    this.addTaskEventListener();
    this.submitTaskEventListener();
    this.addbtnHomeEventListener();
  }

  getProject = () => DBHelper.getCurrentProject();
  updateProject = ({ id }) => DBHelper.setCurrentProjectId({ id });

  getProjectList = () => DBHelper.getProjectList();
  getTaskList = () => DBHelper.getTaskList();
  getAllTasks = () => DBHelper.getAllTasks();
  getTodayTaskList = () => TaskFilter.today({ taskList: this.getTaskList() });

  addProjectEventListener = () => {
    const btn = document.querySelector("#btn-add-project");
    btn.addEventListener("click", () => {
      DBHelper.createProject({ projectTitle: "Test" });
      this.displayProjectList();
    });
  };

  addTaskEventListener = () => {
    const btn = document.querySelector("#btn-add-task");
    btn.addEventListener("click", () => {
      this.dialogAddTask.show();
    });
  };

  addbtnHomeEventListener = () => {
    this.btnHome.addEventListener("click", () => {
      this.hideRestContainer();
      this.todayContainer.replaceChildren(
        this.generateTodoList({ dueDate: 0 })
      );
    });
  };

  hideRestContainer = () => (this.restContainer.style.visibility = "collapse");

  showRestContainer = () => (this.restContainer.style.visibility = "unset");

  submitTaskEventListener = () => {
    const btnsubmit = this.dialogAddTask.querySelector("#btn-submit-task");
    btnsubmit.addEventListener("click", (event) => {
      event.preventDefault();

      if (!this.validateAddTaskData()) {
        alert("Required fields are empty!");
        return;
      }

      const newTask = this.getAddTaskData();

      DBHelper.addTask({ task: newTask });
      this.formAddTask.reset();
      this.dialogAddTask.close();
      this.displayProject({ id: DBHelper.getCurrentProjectId() });
    });
  };

  getAddTaskData = () => {
    const form = new FormData(this.formAddTask);
    const newTask = new Task({
      title: form.get("title"),
      desc: form.get("desc"),
      dueDate: new Date(form.get("dueDate")).getTime() ?? new Date().getTime(),
      completed: false,
    });

    return newTask;
  };

  validateAddTaskData = () => {
    const form = new FormData(this.formAddTask);
    if (!form.get("title")) return false;
    if (!form.get("dueDate")) return false;

    return true;
  };

  generateTodoCard = ({ task }) => {
    const item = document.createElement("li");
    item.classList.add("btn");
    item.textContent = `${task.title}`;

    return item;
  };

  generateTodoList = ({ dueDate: dueDate = 0 }) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const date = document.createElement("h4");
    if (dueDate === 0) {
      date.textContent = format(new Date(), "dd MMMM");
    } else {
      date.textContent = format(new Date(dueDate), "dd MMMM");
    }
    date.classList.add("due-date");

    const taskList = document.createElement("ul");
    taskList.classList.add("task-list");

    let tasks;

    if (dueDate === 0) {
      tasks = TaskFilter.archived({ taskList: this.getAllTasks() });
    } else {
      tasks = TaskFilter.sameDay({
        taskList: this.getTaskList(),
        dueDate: dueDate,
      });
    }

    tasks.forEach((task) => {
      const item = this.generateTodoCard({ task });
      taskList.appendChild(item);
    });

    if (taskList.childElementCount === 0) {
      const item = document.createElement("li");
      item.textContent = "No tasks";
      taskList.appendChild(item);
    }

    card.appendChild(date);
    card.appendChild(taskList);

    return card;
  };

  #displayTodayTasks = () => {
    this.todayContainer.replaceChildren(
      this.generateTodoList({
        dueDate: new Date().getTime(),
      })
    );
  };

  #displayRestTasks = () => {
    this.restContainer.replaceChildren(
      this.generateTodoList({
        dueDate: addDays(new Date().getTime(), 1),
      }),

      this.generateTodoList({
        dueDate: addDays(new Date().getTime(), 2),
      })
    );
  };

  displayProject = ({ id: id = 0 }) => {
    this.updateProject({ id });
    this.#displayTodayTasks();
    this.#displayRestTasks();
  };

  displayProjectList = () => {
    const fragment = new DocumentFragment();

    this.getProjectList().forEach(({ id, projectTitle }) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = projectTitle;
      button.dataset.id = id;

      button.addEventListener("click", (event) => {
        // + -> convert string to number because it breaks otherwise
        // this.displayProject({ id: +event.currentTarget.dataset.id });

        // This is better for security?
        this.showRestContainer();
        this.displayProject({ id });
      });

      li.appendChild(button);
      fragment.appendChild(li);
    });

    this.projectListContainer.replaceChildren(fragment);
  };
};

export default DOMRender;
