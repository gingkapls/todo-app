import Task from "./components/Task";
import Project from "./components/Project";
import DOMRender from "./components/DOMRender";
import TaskFilter from "./components/TaskFilter";
import DBHelper from "./components/DBHelper";
import { formatDistance, format, compareAsc, isSameDay } from "date-fns";
import "./style.css";

const render = new DOMRender();

console.log(DBHelper.getTaskList());
