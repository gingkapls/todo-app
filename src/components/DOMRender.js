const DOMRender = class {
  constructor({ todayContainer, restContainer, noteContainer }) {
    this.todayContainer = todayContainer;
    this.restContainer = restContainer;
    this.noteContainer = noteContainer;
  }

  updateToday = ({ dueDate, tasks }) => {
    this.todayContainer.replaceChildren(
      this.generateTodoListCard({ dueDate, tasks })
    );
  };

  generateTodoListCard = ({ dueDate, tasks }) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const date = document.createElement("h4");
    date.textContent = dueDate;
    date.classList.add("due-date");

    const taskList = document.createElement("ul");
    taskList.classList.add("task-list");

    tasks
      .filter((task) => task.dueDate === dueDate)
      .forEach((task) => {
        const item = document.createElement("li");
        item.textContent = task.title;

        taskList.appendChild(item);
      });

    card.appendChild(date);
    card.appendChild(taskList);

    return card;
  };
};

export default Object.freeze(DOMRender);
