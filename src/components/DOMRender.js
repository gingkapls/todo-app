import TaskFilter from "./TaskFilter";
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

  generateTodoListCard = ({ dueDate, project }) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const date = document.createElement("h4");
    date.textContent = format(new Date(dueDate), "dd MMMM");
    date.classList.add("due-date");

    const taskList = document.createElement("ul");
    taskList.classList.add("task-list");

    TaskFilter.sameDay({ project: project, dueDate: dueDate }).forEach(
      (task) => {
        const item = document.createElement("li");
        item.textContent = task.title;

        taskList.appendChild(item);
      }
    );

    card.appendChild(date);
    card.appendChild(taskList);

    return card;
  };

  displayTodayTasks = ({ project }) => {
    this.todayContainer.replaceChildren(
      this.generateTodoListCard({
        dueDate: new Date().getTime(),
        project,
      })
    );
  };

  displayRestTasks = ({ project }) => {
    this.restContainer.replaceChildren(
      this.generateTodoListCard({
        dueDate: addDays(new Date().getTime(), 1),
        project,
      }),

      this.generateTodoListCard({
        dueDate: addDays(new Date().getTime(), 2),
        project,
      })
    );
  };

  displayProjectList = ({ projects }) => {
    const fragment = new DocumentFragment();

    this.generateProjectList({ projects }).forEach((projectTitle) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = projectTitle;

      li.appendChild(button);
      fragment.appendChild(li);
    });

    this.projectListContainer.replaceChildren(fragment);
  };

  generateProjectList = ({ projects }) =>
    projects.map((project) => project.projectTitle);

  /*
            <li><button>Default</button></li>
        <li><button>Grocery</button></li>

  */
};

export default DOMRender;
