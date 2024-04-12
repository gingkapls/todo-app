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

    this.dialogAddTask.show();

    this.displayProject({ id: 0 });
    this.displayProjectList();
    this.addProjectEventListener();
    this.addTaskEventListener();
  }

  getProject = () => DBHelper.getCurrentProject();
  updateProject = ({ id }) => DBHelper.setCurrentProjectId({ id });

  getProjectList = () => DBHelper.getProjectList();
  getTaskList = () => DBHelper.getTaskList();
  getTodayTaskList = () =>
    TaskFilter.sameDay({
      taskList: this.getTaskList(),
      dueDate: new Date().getTime(),
    });

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
      DBHelper.addTask({
        task: new Task({
          title: "hello",
          desc: "bye",
          dueDate: new Date().getTime(),
          completed: false,
        }),
      });

      this.displayProject({ id: DBHelper.getCurrentProjectId() });
    });
  };

  generateTodoCard = ({ task }) => {
    const item = document.createElement("li");
    item.classList.add("btn");
    item.textContent = `${task.title}`;

    return item;
  };

  generateTodoList = ({ dueDate }) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const date = document.createElement("h4");
    date.textContent = format(new Date(dueDate), "dd MMMM");
    date.classList.add("due-date");

    const taskList = document.createElement("ul");
    taskList.classList.add("task-list");

    TaskFilter.sameDay({
      taskList: this.getTaskList(),
      dueDate: dueDate,
    }).forEach((task) => {
      const item = this.generateTodoCard({ task });
      taskList.appendChild(item);
    });

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
        this.displayProject({ id });
      });

      li.appendChild(button);
      fragment.appendChild(li);
    });

    this.projectListContainer.replaceChildren(fragment);
  };
};

export default DOMRender;
