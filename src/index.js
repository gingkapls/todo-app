import Task from "./components/Task";

const t1 = new Task({
  title: "Task 1",
  desc: "this is a task",
  priority: "Important",
  notes: "none",
  dueDate: "22/10/2024",
  checkList: "",
});

t1.title = "new title";

console.log(t1);
