import JSONData from "../data.json";
import Task from "./Task";

const DBHelper = (({ JSONData }) => {
  // Convert JSON to POJOs
  const projectList = JSONData.projects.map((project) => project);
  const taskList = JSONData.taskList.map((task) => new Task(task));

  const getProjectList = () => projectList;

  const getCurrentProjectId = () => currentProjectId;

  const setCurrentProjectId = ({ id }) => {
    currentProjectId = id;
    currentProject = getCurrentProject();
  };

  const getCurrentProject = () =>
    projectList.find((project) => project.id === currentProjectId);

  const createProject = ({ title }) => {
    projectList.push({
      id: projectList.length,
      title: `${title} ${projectList.length}`,
      taskList: [],
    });
  };

  const getTask = ({ taskId }) => taskList.find((task) => task.id === taskId);

  const addTask = ({ task }) => {
    let index = taskList.findIndex((taskItem) => taskItem.id == task.id);
    index = index === -1 ? taskList.length : index;
    taskList[index] = task;

    sortTasks();
    return index;
  };

  const sortTasks = () => taskList.sort((a, b) => a.dueDate - b.dueDate);

  const setProjectTitle = ({ projectId, projectTitle }) => {
    const index = projectList.findIndex((project) => project.id === projectId);

    projectList[index].title = projectTitle;
  };

  const getTaskList = () =>
    taskList.filter((task) => task.projectId === currentProjectId);

  const getAllTasks = () => taskList;

  let currentProjectId = projectList[0].id;
  let currentProject = getCurrentProject();

  return {
    getProjectList,
    getTask,
    setCurrentProjectId,
    setProjectTitle,
    getCurrentProjectId,
    getCurrentProject,
    createProject,
    addTask,
    getTaskList,
    getAllTasks,
  };

  //
  //
})({ JSONData });

export default DBHelper;
