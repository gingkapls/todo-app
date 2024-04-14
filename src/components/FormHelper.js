import Task from "./Task";
import DBHelper from "./DBHelper";
import { format } from "date-fns";

const dialog = document.querySelector(".dialog-add-task");
const form = document.querySelector(".form-add-task");
const btnSubmit = dialog.querySelector("#btn-submit-task");
const btnClose = dialog.querySelector("#btn-close");

const FormHelper = (({ form, dialog, btnSubmit, btnClose }) => {
  const showForm = () => dialog.showModal();
  const closeForm = () => dialog.close();
  const getFormData = () => new FormData(form);

  dialog.addEventListener("close", () => reset());

  const getAddTaskData = () => {
    const formData = getFormData();
    console.log("taskId", formData.get("taskId"));

    const newTask = new Task({
      id: formData.get("taskId") ? formData.get("taskId") : null,
      projectId: DBHelper.getCurrentProjectId(),
      title: formData.get("title"),
      desc: formData.get("desc"),
      priority: Number(formData.get("priority")),
      dueDate:
        new Date(formData.get("dueDate")).getTime() ?? new Date().getTime(),
      completed: false,
    });

    return newTask;
  };

  const editTaskData = (event) => {
    const taskId = event.currentTarget.parentNode.dataset.taskId;
    console.log("task", taskId);
    const task = DBHelper.getTask({ taskId: taskId });
    console.log("task", task);

    setFormData({ task });

    showForm();
    // console.log(projectId, taskId);
    // const task = this.getTaskList()[index];
    // form.set("title", task.title);
  };

  const setFormData = ({ task }) => {
    form.title.value = task.title;
    form.desc.value = task.desc;
    form.taskId.value = task.id;
    // console.log("formdata", form.taskId.value);
    form.priority.value = task.priority;
    form.dueDate.value = format(new Date(task.dueDate), "yyyy-MM-dd");
  };

  const validateAddTaskData = () => {
    const formData = getFormData();
    if (!formData.get("title")) return false;
    if (!formData.get("dueDate")) return false;

    return true;
  };

  const reset = () => form.reset();

  return {
    getAddTaskData,
    showForm,
    closeForm,
    editTaskData,
    validateAddTaskData,
    reset,
  };
})({ form, dialog, btnSubmit, btnClose });

export default FormHelper;
