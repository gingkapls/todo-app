import TaskFilter from "./TaskFilter";
import DBHelper from "./DBHelper";
import FormHelper from "./FormHelper";
import Task from "./Task";
import { format, constructFrom, addDays } from "date-fns";

const DOMRender = class {
  constructor() {
    this.todayContainer = document.querySelector(".today-container");
    this.restContainer = document.querySelector(".rest-container");
    this.noteContainer = document.querySelector(".notes");
    this.projectListContainer = document.querySelector(".project-list");
    this.dialogAddTask = document.querySelector(".dialog-add-task");
    this.isAtHome = true;
    this.btnHome = document.querySelector("#btn-home");

    // this.dialogAddTask.show();
    // console.log(DBHelper.getAllTasks());

    this.displayProject({ id: "0" });
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
      DBHelper.createProject({ title: "Test" });
      this.displayProjectList();
    });
  };

  addTaskEventListener = () => {
    const btn = document.querySelector("#btn-add-task");
    btn.addEventListener("click", () => {
      FormHelper.showForm();
    });
  };

  addbtnHomeEventListener = () => {
    this.btnHome.addEventListener("click", this.renderHome);
  };

  renderHome = () => {
    this.isAtHome = true;
    this.hideRestContainer();
    this.todayContainer.replaceChildren(this.generateTodoList({ dueDate: 0 }));
  };

  hideRestContainer = () => (this.restContainer.style.visibility = "collapse");

  showRestContainer = () => (this.restContainer.style.visibility = "unset");

  submitTaskEventListener = () => {
    const btnsubmit = this.dialogAddTask.querySelector("#btn-submit-task");
    const btnClose = this.dialogAddTask.querySelector("#btn-close");
    btnClose.addEventListener("click", () => {
      // this.dialogAddTask.close();
      FormHelper.closeForm();
    });

    btnsubmit.addEventListener("click", (event) => {
      event.preventDefault();

      if (!FormHelper.validateAddTaskData()) {
        alert("Required fields are empty!");
        return;
      }

      const newTask = FormHelper.getAddTaskData();
      DBHelper.addTask({
        task: newTask,
      });

      FormHelper.reset();

      // console.log(DBHelper.getCurrentProject());
      // console.log(DBHelper.getCurrentProjectId());
      // console.log(DBHelper.getTaskList());
      // console.log(DBHelper.getAllTasks());

      // this.formAddTask.reset();
      // FormHelper.reset();
      FormHelper.closeForm();

      if (this.isAtHome) {
        this.renderHome();
      } else {
        this.displayProject({ id: DBHelper.getCurrentProjectId() });
      }
    });
  };

  generateTodoCard = ({ task }) => {
    const item = document.createElement("li");
    item.dataset.projectId = DBHelper.getCurrentProjectId();
    item.dataset.taskId = task.id;

    const check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    item.appendChild(check);
    item.classList.add("btn");

    const button = document.createElement("button");
    button.textContent = `${task.title}`;
    button.addEventListener("click", FormHelper.editTaskData);
    item.appendChild(button);

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
      tasks = this.getAllTasks();
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

  displayProject = ({ id }) => {
    this.updateProject({ id });
    this.#displayTodayTasks();
    this.#displayRestTasks();
  };

  displayProjectList = () => {
    const fragment = new DocumentFragment();

    this.getProjectList().forEach(({ id, title }) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = title;
      button.dataset.id = id;

      button.addEventListener("click", (event) => {
        // + -> convert string to number because it breaks otherwise
        // this.displayProject({ id: +event.currentTarget.dataset.id });

        this.isAtHome = false;
        this.showRestContainer();
        // This is better for security?
        this.displayProject({ id });
      });

      li.appendChild(button);
      fragment.appendChild(li);
    });

    this.projectListContainer.replaceChildren(fragment);
  };
};

export default DOMRender;
