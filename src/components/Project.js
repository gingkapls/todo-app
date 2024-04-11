const Project = class {
  constructor({ projectTitle, taskList }) {
    Object.assign(this, arguments[0]);
  }

  getNumTasks = () => this.taskList.length;
};

export default Project;
