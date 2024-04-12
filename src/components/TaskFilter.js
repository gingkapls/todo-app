import { isSameDay } from "date-fns";

const TaskFilter = (() => {
  const olderThan = ({ taskList, dueDate }) =>
    taskList.filter((task) => task.dueDate < dueDate);

  const sameDay = ({ taskList, dueDate }) =>
    taskList.filter((task) => isSameDay(new Date(task.dueDate), dueDate));

  const archived = ({ taskList }) => taskList.filter((task) => task.archived);

  return {
    olderThan,
    sameDay,
    archived,
  };
})();

export default TaskFilter;
