import data from "./data.json";
import Task from "./components/Task";
import Project from "./components/Project";
import DOMRender from "./components/DOMRender";
import TaskFilter from "./components/TaskFilter";
import "./style.css";
import { formatDistance, format, compareAsc, isSameDay } from "date-fns";

const projectList = data.map((project) => new Project(project));
const filter = TaskFilter;

const today = document.querySelector(".today-container");
const rest = document.querySelector(".rest-container");
const notes = document.querySelector(".notes");

const render = new DOMRender({
  todayContainer: today,
  restContainer: rest,
  noteContainer: notes,
});

render.displayTodayTasks({ project: projectList[0] });
render.displayRestTasks({ project: projectList[0] });

setTimeout(() => {
  render.displayTodayTasks({ project: projectList[1] });
  render.displayRestTasks({ project: projectList[1] });
  console.log("executed");
}, 2000);

console.log(
  TaskFilter.sameDay({ project: projectList[0], dueDate: new Date() })
);

// console.log(
//   isSameDay(new Date(projectList[0].taskList[0].dueDate), new Date())
// );

// console.log(projectList);
