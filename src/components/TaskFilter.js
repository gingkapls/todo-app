import { isSameDay } from "date-fns";

const TaskFilter = (() => {
  const olderThan = ({ project, dueDate }) =>
    project.taskList.filter((task) => task.dueDate < dueDate);

  const sameDay = ({ project, dueDate }) =>
    project.taskList.filter((task) =>
      isSameDay(new Date(task.dueDate), dueDate)
    );

  return {
    olderThan,
    sameDay,
  };
})();

export default TaskFilter;
