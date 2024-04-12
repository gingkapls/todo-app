import { isSameDay } from "date-fns";

const TaskFilter = (() => {
  const olderThan = ({ taskList, dueDate }) =>
    taskList.filter((task) => task.dueDate < dueDate);

  const sameDay = ({ taskList, dueDate }) =>
    taskList.filter((task) => isSameDay(new Date(task.dueDate), dueDate));

  return {
    olderThan,
    sameDay,
  };
})();

export default TaskFilter;
