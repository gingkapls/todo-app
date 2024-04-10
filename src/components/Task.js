const Task = class {
  constructor({ title, desc, dueDate, priority, notes = "", checkList }) {
    /* this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checkList = checkList; */

    Object.assign(this, arguments[0]);
  }
};

export default Task;
