var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content")
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
    if(!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset()

    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name = 'task-type']").selectedIndex = 0;
    var isEdit = formEl.hasAttribute("data-task-id");
    // package up data as an object
 

  // send it as an argument to createTaskEl
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  else{
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };
    createTaskEl(taskDataObj);
  }
};
var completeEditTask = function(taskName, taskType, taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.querySelector("h3.task-name").textContent=taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  for (var i= 0; i < tasks.length; i++){
    if (tasks[i].id === parseInt(taskIdCounter)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }
  saveTasks();
  alert("Task Updated!");
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
}
var createTaskEl = function (taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  //create a task id for the list item
  listItemEl.setAttribute("data-task-id", taskIdCounter);
  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  // add entire list item to list
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  tasksToDoEl.appendChild(listItemEl);
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  saveTasks();
  taskIdCounter++;
};
var createTaskActions = function(taskId){
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(statusSelectEl);
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i=0; i < statusChoices.length; i++) {
    var statusOptionEl = document.createElement("option")
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value",statusChoices[i]);
    statusSelectEl.appendChild(statusOptionEl);
  }
  return actionContainerEl;
};
var editTask = function(taskId){
  console.log("editing task #" + taskId);
  var taskSelected = document.querySelector(".task-item[data-task-id = '" + taskId + "']");
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  document.querySelector("input[name='task-name']").value = taskName;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("select[name = 'task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
}
var deleteTask = function(taskId){
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
  var updatedTaskArr = [];
  for (var i = 0; i< tasks.length; i++) {
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }
  tasks = updatedTaskArr;
  saveTasks();
}
var taskButtonHandler = function(event) {
  console.log(event.target);
  var targetEl = event.target;
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  else if(targetEl.matches(".delete-btn")) {
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
}
var taskStatusChangeHandler = function(event) {
  var taskId = event.target.getAttribute("data-task-id");
  var statusValue = event.target.value.toLowerCase();
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
  for (var i = 0; i< tasks.length; i++){
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
  saveTasks();
}
var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
var loadTasks = function() {
  //get task items from local storage
  savedTasks = localStorage.getItem("tasks")
  if(!saveTasks){
    return false
  }
  //convert tasks from string format back into an array
  savedTasks = JSON.parse(savedTasks);
  //iterate through array to create saved task elements
  for (i = 0; i <savedTasks.length; i++){
    createTaskEl(savedTasks[i]);
  }
}
loadTasks();
pageContentEl.addEventListener("click", taskButtonHandler);
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler)