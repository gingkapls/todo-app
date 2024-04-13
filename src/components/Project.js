import { nanoid } from "nanoid";

const Project = class {
  constructor({ projectTitle, taskList }) {
    this.id = nanoid();
    this.projectTitle = projectTitle ?? "";
    this.taskList = taskList ?? [];
  }

  getNumTasks = () => this.taskList.length;
};

export default Project;
