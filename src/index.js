import data from "./data.json";
import Task from "./components/Task";
import Project from "./components/Project";
import "./style.css";

const projectList = data.map((project) => new Project(project));

console.log(projectList);
