import { nanoid } from "nanoid";

const Task = class {
  constructor({
    id,
    projectId,
    title,
    desc,
    dueDate,
    priority = 0,
    notes = "",
    completed = false,
  }) {
    Object.assign(this, arguments[0]);
    this.id = id ?? nanoid();
  }

  toggle = () => (this.completed = !this.completed);

  switchPriority = () => (this.priority = (this.priority + 1) % 3);
};

export default Task;
