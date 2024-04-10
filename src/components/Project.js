const Project = class {
  constructor({ title, taskList }) {
    Object.assign(this, arguments[0]);
  }

  getNumTasks = () => this.taskList.length;
};

export default Project;
