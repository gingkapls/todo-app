import JSONData from "../data.json";
import { nanoid } from "nanoid";
import Task from "./Task";

const DBHelper = (({ JSONData }) => {
  const populateStorage = () => {
    const projectList = JSONData.projects.map((project) => project);
    const taskList = JSONData.taskList.map((task) => task);

    localStorage.setItem("projectList", JSON.stringify(projectList));
    localStorage.setItem("taskList", JSON.stringify(taskList));
  };

  if (!localStorage.getItem("projectList")) {
    populateStorage();
  }
  // localStorage.clear();
  const projectList = JSON.parse(localStorage.getItem("projectList"));
  const taskList = JSON.parse(localStorage.getItem("taskList")).map(
    (task) => new Task(task)
  );

  const commit = () => {
    localStorage.setItem("projectList", JSON.stringify(projectList));
    localStorage.setItem("taskList", JSON.stringify(taskList));
  };

  const getProjectList = () => projectList;

  const getCurrentProject = () =>
    projectList.find((project) => project.id === currentProjectId);

  const setCurrentProjectId = ({ id }) => {
    currentProjectId = id;
    currentProject = getCurrentProject();
  };

  const getCurrentProjectId = () => currentProjectId;

  const getCurrentProjectTitle = () => getCurrentProject().title;

  const createProject = ({ title }) => {
    projectList.push({
      id: nanoid(),
      title: title,
      taskList: [],
    });

    commit();
  };

  const getTask = ({ taskId }) => taskList.find((task) => task.id === taskId);

  const addTask = ({ task }) => {
    let index = taskList.findIndex((taskItem) => taskItem.id == task.id);
    index = index === -1 ? taskList.length : index;
    taskList[index] = task;
    sortTasks();
    commit();
    return index;
  };

  const deleteProject = ({ projectId }) => {
    const index = projectList.findIndex((project) => project.id === projectId);

    if (index > 0) {
      projectList.splice(index, 1);
      const orphanTasks = taskList.filter(
        (task) => task.projectId === projectId
      );
      orphanTasks.forEach((task) => deleteTask({ taskId: task.id }));
    }
    commit();
  };

  const deleteTask = ({ taskId }) => {
    const index = taskList.findIndex((task) => task.id === taskId);

    if (index !== -1) {
      taskList.splice(index, 1);
    }

    commit();
  };

  const sortTasks = () => taskList.sort((a, b) => a.dueDate - b.dueDate);

  const setProjectTitle = ({ projectId, projectTitle }) => {
    const index = projectList.findIndex((project) => project.id === projectId);
    projectList[index].title = projectTitle;
    commit();
  };

  const getDefaultProject = () => getProjectList()[0];

  const getTaskList = () =>
    taskList.filter((task) => task.projectId === currentProjectId);

  const getAllTasks = () => taskList;

  let currentProjectId = projectList[0].id;
  let currentProject = projectList[0];

  return {
    getProjectList,
    getTask,
    commit,
    setCurrentProjectId,
    setProjectTitle,
    getCurrentProjectTitle,
    getCurrentProjectId,
    getCurrentProject,
    createProject,
    addTask,
    getTaskList,
    deleteProject,
    deleteTask,
    getAllTasks,
    getDefaultProject,
  };

  //
  //
})({ JSONData });

export default DBHelper;
