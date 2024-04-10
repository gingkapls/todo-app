import Task from "./components/Task";
import Project from "./components/Project";
import data from "./data.json";

const taskList = data.map((task) => new Task(task));

const p1 = new Project({ title: "Default", taskList: taskList });

console.log(p1.taskList[0]);
