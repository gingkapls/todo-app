import JSONData from "../data.json";
import Task from "./Task";

const DBHelper = (({ JSONData }) => {
  // Convert JSON to POJOs
  const data = JSONData.map((project) => {
    project.taskList = project.taskList.map((task) => new Task(task));
    return project;
  });

  // console.log(data[0].taskList);

  const getProjectList = () =>
    data.map((project) => ({
      id: project.id,
      projectTitle: project.projectTitle,
    }));

  const setCurrentProjectId = ({ id }) => {
    currentProjectId = id;
    currentProject = getCurrentProject();
  };

  const getCurrentProjectId = () => currentProjectId;

  const getCurrentProjectIndex = () =>
    data.findIndex((project) => project.id === getCurrentProjectId());

  const createProject = ({ projectTitle }) => {
    data.push({
      id: data.length,
      projectTitle: `Project ${data.length}`,
      taskList: [],
    });
  };

  const addTask = ({ task }) => {
    const index = getCurrentProjectIndex();

    data[index].taskList.push(task);
  };

  const setCurrentProjectTitle = ({ projectTitle }) => {
    const index = (data[index].projectTitle = projectTitle);
  };

  const getCurrentProject = () =>
    data.find((project) => project.id === currentProjectId);

  const getTaskList = () => currentProject.taskList;

  let currentProjectId = data[0].id;
  let currentProject = getCurrentProject();

  return {
    getProjectList,
    setCurrentProjectId,
    getCurrentProjectId,
    getCurrentProject,
    createProject,
    addTask,
    getTaskList,
  };

  //
  //
})({ JSONData });

export default DBHelper;
