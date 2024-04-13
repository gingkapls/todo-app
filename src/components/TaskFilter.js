import { isSameDay } from "date-fns";

const TaskFilter = (() => {
  const olderThan = ({ taskList, dueDate }) =>
    taskList.filter((task) => task.dueDate < dueDate);

  const sameDay = ({ taskList, dueDate }) =>
    taskList.filter((task) => isSameDay(new Date(task.dueDate), dueDate));

  const today = ({ taskList }) =>
    sameDay({ taskList, dueDate: new Date().getTime() });

  const archived = ({ taskList }) =>
    taskList.filter(
      (task) => task.completed || task.dueDate < new Date().getTime()
    );

  return {
    olderThan,
    sameDay,
    today,
    archived,
  };
})();

export default TaskFilter;
