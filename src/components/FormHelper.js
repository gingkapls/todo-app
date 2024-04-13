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
    console.log(formData.get("taskId"));
    const newTask = new Task({
      id: formData.get("taskId") ? formData.get("taskId") : null,
      projectId: DBHelper.getCurrentProjectId(),
      title: formData.get("title"),
      desc: formData.get("desc"),
      dueDate:
        new Date(formData.get("dueDate")).getTime() ?? new Date().getTime(),
      completed: false,
    });

    return newTask;
  };

  const editTaskData = (event) => {
    const projectId = event.currentTarget.parentNode.dataset.projectId;
    // PESKY STRINGS OMG I SWEAR
    const taskId = event.currentTarget.parentNode.dataset.taskId;
    const task = DBHelper.getTask({ taskId: taskId });

    setFormData({ task });

    console.log(task);

    showForm();
    // console.log(projectId, taskId);
    // const task = this.getTaskList()[index];
    // form.set("title", task.title);
  };

  const setFormData = ({ task }) => {
    form.title.value = task.title;
    form.desc.value = task.desc;
    form.taskId.value = task.id;
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
