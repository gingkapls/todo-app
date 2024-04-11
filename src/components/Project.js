const Project = class {
  constructor({ projectTitle, taskList }) {
    this.projectTitle = projectTitle ?? "";
    this.taskList = taskList ?? [];
  }

  getNumTasks = () => this.taskList.length;
};

export default Project;
