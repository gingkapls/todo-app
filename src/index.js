import data from "./data.json";
import Task from "./components/Task";
import Project from "./components/Project";
import DOMRender from "./components/DOMRender";
import "./style.css";

const projectList = data.map((project) => new Project(project));

const today = document.querySelector(".today-container");
const rest = document.querySelector(".rest-container");
const notes = document.querySelector(".notes");

const render = new DOMRender({
  todayContainer: today,
  restContainer: rest,
  noteContainer: notes,
});

render.updateToday({ dueDate: "22/10/2024", tasks: projectList[0].taskList });

// console.log(projectList);
