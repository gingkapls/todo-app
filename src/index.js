import Task from "./components/Task";
import Project from "./components/Project";
import DOMRender from "./components/DOMRender";
import TaskFilter from "./components/TaskFilter";
import DBHelper from "./components/DBHelper";
import { formatDistance, format, compareAsc, isSameDay } from "date-fns";
import "./style.css";

// const projectList = data.map((project) => new Project(project));
const today = document.querySelector(".today-container");
const rest = document.querySelector(".rest-container");
const notes = document.querySelector(".notes");
const projectContainer = document.querySelector(".project-list");

const render = new DOMRender({
  todayContainer: today,
  restContainer: rest,
  noteContainer: notes,
  projectListContainer: projectContainer,
});

// render.changeCurrentProject({ project: projectList[0] });
render.displayProject({ id: 0 });
render.displayProjectList();

console.log(DBHelper.getProjectList());
// console.log(DBHelper.getTaskList());
// console.log(DBHelper.getCurrentProject());
