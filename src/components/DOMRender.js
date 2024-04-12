import TaskFilter from "./TaskFilter";
import DBHelper from "./DBHelper";
import { format, constructFrom, addDays } from "date-fns";

const DOMRender = class {
  constructor({
    todayContainer,
    restContainer,
    noteContainer,
    projectListContainer,
  }) {
    Object.assign(this, arguments[0]);
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

  generateTodoListCard = ({ dueDate }) => {
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
      const item = document.createElement("li");
      item.textContent = task.title;

      taskList.appendChild(item);
    });

    card.appendChild(date);
    card.appendChild(taskList);

    return card;
  };

  #displayTodayTasks = () => {
    this.todayContainer.replaceChildren(
      this.generateTodoListCard({
        dueDate: new Date().getTime(),
      })
    );
  };

  #displayRestTasks = () => {
    this.restContainer.replaceChildren(
      this.generateTodoListCard({
        dueDate: addDays(new Date().getTime(), 1),
      }),

      this.generateTodoListCard({
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

  /*
            <li><button>Default</button></li>
        <li><button>Grocery</button></li>

  */
};

export default DOMRender;
