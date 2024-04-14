import TaskFilter from "./TaskFilter";
import DBHelper from "./DBHelper";
import FormHelper from "./FormHelper";
import { format, addDays } from "date-fns";

const DOMRender = class {
  constructor() {
    this.todayContainer = document.querySelector(".today-container");
    this.restContainer = document.querySelector(".rest-container");
    this.noteContainer = document.querySelector(".notes");
    this.projectListContainer = document.querySelector(".project-list");
    this.dialogAddTask = document.querySelector(".dialog-add-task");
    this.currentProjectTitleInput = document.querySelector(
      ".current-project-title"
    );
    this.isAtHome = true;
    this.btnHome = document.querySelector("#btn-home");

    this.renderHome();
    this.displayProjectList();
    this.addProjectEventListener();
    this.addTaskEventListener();
    this.submitTaskEventListener();
    this.addbtnHomeEventListener();
    this.addProjectTitleEventListener();
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
      DBHelper.createProject({
        title: `Project ${DBHelper.getProjectList().length}`,
      });
      this.displayProjectList();
    });
  };

  addProjectTitleEventListener = () => {
    this.currentProjectTitleInput.addEventListener("change", (event) => {
      const title = event.currentTarget.value;
      DBHelper.setProjectTitle({
        projectId: DBHelper.getCurrentProjectId(),
        projectTitle: title,
      });
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
    DBHelper.setCurrentProjectId({ id: DBHelper.getDefaultProject().id });
    this.hideTitleInput();
    this.hideRestContainer();
    this.todayContainer.replaceChildren(this.generateTodoList({ dueDate: 0 }));
  };
  hideTitleInput = () =>
    (this.currentProjectTitleInput.style.visibility = "collapse");

  showTitleInput = () =>
    (this.currentProjectTitleInput.style.visibility = "unset");

  hideRestContainer = () => (this.restContainer.style.visibility = "collapse");

  showRestContainer = () => (this.restContainer.style.visibility = "unset");

  submitTaskEventListener = () => {
    const btnsubmit = this.dialogAddTask.querySelector("#btn-submit-task");
    const btnClose = this.dialogAddTask.querySelector("#btn-close");
    btnClose.addEventListener("click", () => {
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
    item.classList.add("todo-item");

    const check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    if (task.completed) {
      check.setAttribute("checked", "checked");
    }

    check.addEventListener("click", () => {
      task.toggle();
      DBHelper.commit();
    });
    item.appendChild(check);

    const button = document.createElement("button");
    button.textContent = `${task.title}`;
    button.addEventListener("click", FormHelper.editTaskData);
    item.appendChild(button);

    const delButton = document.createElement("button");
    delButton.textContent = "X";
    delButton.classList.add("btn-delete", "btn-delete-task");
    delButton.addEventListener("click", () => {
      DBHelper.deleteTask({ taskId: task.id });

      if (this.isAtHome) {
        this.renderHome();
      } else {
        this.displayProject({ id: DBHelper.getCurrentProjectId() });
      }
    });

    item.appendChild(delButton);

    return item;
  };

  generateTodoList = ({ dueDate: dueDate = 0 }) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const dateContainer = document.createElement("div");
    const [month, date, day] = (
      dueDate === 0
        ? format(new Date(), "MMM dd EEEE")
        : format(new Date(dueDate), "MMM dd EEEE")
    ).split(" ");

    const monthEl = document.createElement("h4");
    monthEl.textContent = month;

    const dateEl = document.createElement("h5");
    dateEl.textContent = date;

    const flexContainer = document.createElement("div");
    flexContainer.classList.add("date-flex-parent");

    dateContainer.classList.add("due-date");
    dateContainer.replaceChildren(monthEl, dateEl);

    const dayContainer = document.createElement("h5");
    dayContainer.classList.add("due-day");
    dayContainer.textContent = day;

    flexContainer.replaceChildren(dateContainer, dayContainer);

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

    card.appendChild(flexContainer);
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
    this.showTitleInput();
    this.currentProjectTitleInput.value = DBHelper.getCurrentProject().title;
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

      const delButton = document.createElement("button");
      delButton.textContent = "X";
      delButton.classList.add("btn-delete", "btn-delete-project");
      delButton.addEventListener("click", () => {
        if (
          DBHelper.getTaskList().filter((task) => task.projectId === id)
            .length !== 0 &&
          !confirm(
            `Do you want to delete the project ${title} and all its tasks?`
          )
        ) {
          return;
        }

        DBHelper.deleteProject({ projectId: id });
        this.renderHome();
        this.displayProjectList();
      });

      li.appendChild(delButton);

      fragment.appendChild(li);
    });

    this.projectListContainer.replaceChildren(fragment);
  };
};

export default DOMRender;
