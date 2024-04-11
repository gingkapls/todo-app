import TaskFilter from "./TaskFilter";
import { format, constructFrom, addDays } from "date-fns";

const DOMRender = class {
  constructor({ todayContainer, restContainer, noteContainer }) {
    this.todayContainer = todayContainer;
    this.restContainer = restContainer;
    this.noteContainer = noteContainer;
  }

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
};

export default DOMRender;
