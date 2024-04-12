import Task from "./components/Task";
import Project from "./components/Project";
import DOMRender from "./components/DOMRender";
import TaskFilter from "./components/TaskFilter";
import DBHelper from "./components/DBHelper";
import { formatDistance, format, compareAsc, isSameDay } from "date-fns";
import "./style.css";

const render = new DOMRender();

// render.changeCurrentProject({ project: projectList[0] });
render.displayProject({ id: 0 });
render.displayProjectList();

console.log(DBHelper.getTaskList());

console.log(DBHelper.getTaskList());

// console.log(DBHelper.getProjectList());
// console.log(DBHelper.getTaskList());
// console.log(DBHelper.getCurrentProject());
