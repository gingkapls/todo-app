const Task = class {
  constructor({
    projectId,
    id,
    title,
    desc,
    dueDate,
    priority = 0,
    notes = "",
    completed = false,
  }) {
    Object.assign(this, arguments[0]);
  }

  toggle = () => (this.completed = !this.completed);

  switchPriority = () => (this.priority = (this.priority + 1) % 3);
};

export default Task;
