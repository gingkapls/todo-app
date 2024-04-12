import data from "../data.json";

const DBHelper = (({ data }) => {
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
    getTaskList,
  };

  //
  //
})({ data });

export default DBHelper;
