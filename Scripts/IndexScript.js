import * as utils from "./utilities.js";

//contenedor de de tareas no hechas UI
const tasksContainer = document.getElementById('tasks');

//contenedor de de tareas hechas UI
const completedTasksContainer = document.getElementById('completed-tasks');

document.addEventListener("DOMContentLoaded", async function(){
    await getTasks();

    //Agrega una tarea en la base de datos y la presenta en la UI
    const addTaskForm = document.querySelector("#add-new-task form");
    addTaskForm.addEventListener("submit", async function(e){
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        const responseJSON = await fetch("../PHP/addTask.php",{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const response = await responseJSON.json();

        //Borrar lo que pusite
        const selector = "input.task-tittle-input, textarea";
        addTaskForm.querySelectorAll(selector).forEach((element) => {
            element.value = "";
        })

        //Para presentar la tarear en la UI
        let taskElement = createTaskElement(response ,data['task-tittle-input'], data['task-description-input'], new Date(Date.now()).toLocaleDateString(), "pending");
        tasksContainer.appendChild(taskElement);
    });
});

//Devuelve una la lista de tareas de la base de datos
async function getTaskList(){
    const JSONElementsObtained = await fetch("./PHP/fetch_tasks.php");
    const tasks = await JSONElementsObtained.json();
    return tasks;
}

//Vuelve a cargar las tareas segun el usuario
async function getTasks(){
    //restartTasks();
    restartCompletedTasks();
    const tasks = await getTaskList();
    
    tasks.forEach(task => {
        if(task.status == "pending"){
            const taskElement = createTaskElement(task.id, task.title, task.description, new Date(task.created_at).toLocaleDateString(), task.status);
            tasksContainer.appendChild(taskElement);
        }
        else if(task.status == "completed"){
            const taskElement = createCompletedTaskElement(task.id, task.title, task.status);
            completedTasksContainer.appendChild(taskElement);
        }
        else alert("Ha ocurrido un error con algunas de las tareas");
    });
}

//Crea una tarea
function createTaskElement(id ,title, description, creationDate, status){
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.setAttribute("data-task-id", id);
    //Si no tiene descripcion
    if(description.trim() == ""){
        taskElement.classList.add("no-description");
    }

    const checkboxInput = document.createElement("input");
    checkboxInput.setAttribute("type", "checkbox");
    checkboxInput.className = "checkbox-input";
    if(status != undefined){
        if(status == "completed") checkboxInput.checked = true;
        else if(status == "pending") checkboxInput.checked = false;
    }

    const taskTitle = document.createElement("span");
    taskTitle.className = "task-tittle";
    taskTitle.textContent = title;

    const taskDescription = document.createElement("span");
    taskDescription.className = "task-description";
    taskDescription.textContent = description;

    const taskCreationDate = document.createElement("span");
    taskCreationDate.className = "task-creating-date";
    taskCreationDate.textContent = creationDate; 

    const editTaskBtn = document.createElement("button");
    editTaskBtn.className = "edit-task-btn";
    const editTaskBtnIcon = document.createElement("i");
    editTaskBtnIcon.classList.add("fa-regular");
    editTaskBtnIcon.classList.add("fa-pen-to-square");
    editTaskBtn.appendChild(editTaskBtnIcon);

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.className = "delete-task-btn";
    const deleteTaskBtnIcon = document.createElement("i");
    deleteTaskBtnIcon.classList.add("fa-regular");
    deleteTaskBtnIcon.classList.add("fa-trash-can");
    deleteTaskBtn.appendChild(deleteTaskBtnIcon);

    /*Editing area*/
    const editingTitle = document.createElement("input");
    editingTitle.setAttribute("type", "text");
    editingTitle.setAttribute("maxlength", "50");
    editingTitle.className = "editing-title-input d-none";

    const editingDescription = document.createElement("textarea");
    editingDescription.className = "editing-description-textarea d-none";
    editingDescription.setAttribute("maxlength", "300")

    const saveCancelContiner = document.createElement("div");
    saveCancelContiner.className = "save-cancel-editing d-none";
    
    const saveBtn = document.createElement("button");
    saveBtn.className = "save";
    const checkIcon = document.createElement("i");
    checkIcon.className = "fa-solid fa-check";
    saveBtn.append(checkIcon);
    
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel";
    const cancelIcon = document.createElement("i");
    cancelIcon.className = "fa-solid fa-xmark";
    cancelBtn.append(cancelIcon);
    
    saveCancelContiner.append(saveBtn, cancelBtn);
    
    taskElement.append(checkboxInput, taskTitle, taskDescription, taskCreationDate, editTaskBtn, deleteTaskBtn, editingTitle, editingDescription, saveCancelContiner);
    
    //Añadir funciones
    //Check box
    addChangeTaskStatusEvent(checkboxInput);
    //-----Modificar
    addModifieTaskEvent(editTaskBtn);
    //Cancelar cambios
    addCancelEditingEvent(cancelBtn);
    //Guardar cambios
    addSaveEditingEvent(saveBtn);
    //Elminar
    addDelateEvent(deleteTaskBtn);
    
    return taskElement;
}

//Crea una tarea completa
function createCompletedTaskElement(id ,title, status){
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.setAttribute("data-task-id", id)

    const checkboxInput = document.createElement("input");
    checkboxInput.setAttribute("type", "checkbox");
    checkboxInput.setAttribute("checked", true);
    checkboxInput.className = "checkbox-input";

    const taskTitle = document.createElement("span");
    taskTitle.className = "task-tittle";
    taskTitle.textContent = title;

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.className = "delete-task-btn";
    const deleteTaskBtnIcon = document.createElement("i");
    deleteTaskBtnIcon.classList.add("fa-regular");
    deleteTaskBtnIcon.classList.add("fa-trash-can");
    deleteTaskBtn.appendChild(deleteTaskBtnIcon);

    taskElement.append(checkboxInput, taskTitle, deleteTaskBtn);

    //Añadir funciones
    //Check box
    if(status != undefined){
        if(status == "completed") checkboxInput.checked = true;
        else if(status == "pending") checkboxInput.checked = false;
    }
    addChangeTaskStatusEvent(checkboxInput);
    addDelateEvent(deleteTaskBtn);

    return taskElement;
}

//Vacia las tareas en el UI
function restartTasks(){
    while(tasksContainer.firstElementChild.nextElementSibling){
        tasksContainer.firstElementChild.nextElementSibling.remove()
    }
}
//Vacia las tareas hechas en el UI
function restartCompletedTasks(){
    while(completedTasksContainer.firstElementChild.nextElementSibling){
        completedTasksContainer.firstElementChild.nextElementSibling.remove()
    }
}

//Añade la funcion de eliminar
async function addDelateEvent(element){
    const taskID = element.parentNode.dataset["taskId"];
    element.addEventListener("click", async function(){
        await deleteTask(taskID);
        element.parentNode.remove();
    });
}
async function deleteTask(taskID){
    await fetch("../PHP/deleteTask.php",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(taskID)
    });
}

//Cambiar status de tarea
async function addChangeTaskStatusEvent(element){
    const taskID = element.parentNode.dataset["taskId"];
    const status = element.checked;
    const title = element.parentNode.querySelector(".task-tittle").textContent;

    const tasks = await getTaskList();
    
    const task = await tasks.find(item => item.id == taskID);
    element.addEventListener("click", async function(){
        await changeTaskStatus(taskID, !status);
        if(!status){
            const taskElement = createCompletedTaskElement(taskID, title, "completed");
            completedTasksContainer.appendChild(taskElement);
        }
        else if(status){
            const taskElement = createTaskElement(task.id, task.title, task.description, new Date(task.created_at).toLocaleDateString(), "pending");
            tasksContainer.appendChild(taskElement);
        }
        element.parentNode.remove();
    });
    
}
async function changeTaskStatus(taskID, status){
    await fetch("../PHP/changeTaskStatus.php",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({taskID: taskID, status: status})
    });
}

//-----------Modificar tarea---------------
function getNoEditingElements(element){
    let taskElements = [];
    for(let i = 0; i <= 5; i++){
        taskElements.push(element.children[i]);
    }
    return taskElements;
}
function getEditingElements(element){
    let editingElements = [];
    for(let i = 6; i <= 8; i++){
        editingElements.push(element.children[i]);
    }
    return editingElements;
}
function addModifieTaskEvent(element){    
    element.addEventListener("click", () => {
        let parent = element.parentNode;
        
        let taskElements = getNoEditingElements(parent);
        let editingElements = getEditingElements(parent);
        
        taskElements.forEach(item => {
            utils.dNone(item);
        });
        editingElements.forEach(item => {
            utils.removeDNone(item);
        });

        let title = parent.querySelector(".task-tittle");
        let descripcion = parent.querySelector(".task-description");

        let titleInput = parent.querySelector(".editing-title-input");
        let descripcionInput = parent.querySelector(".editing-description-textarea");

        titleInput.value = title.textContent;
        descripcionInput.value = descripcion.textContent;
    });
}
//cancelar cambios
function closeEditing(element) {
    let parent = element.parentNode.parentNode;
    let taskElements = getNoEditingElements(parent);
    let editingElements = getEditingElements(parent);
    
    taskElements.forEach(item => {
        utils.removeDNone(item);
    });
    editingElements.forEach(item => {
        utils.dNone(item);
    });
}
function addCancelEditingEvent(element) {
    element.addEventListener("click", () => {
        closeEditing(element);
    });
}
//guardar cambios
async function addSaveEditingEvent(element) {
    element.addEventListener("click", async () => {
        let parent = element.parentNode.parentNode;
        const titleEditingVal = parent.querySelector(".editing-title-input").value;
        const descripcionEditingVal = parent.querySelector(".editing-description-textarea").value.trim();

        let taskTile = parent.querySelector(".task-tittle");
        let taskDescription = parent.querySelector(".task-description");

        taskTile.textContent = titleEditingVal;
        taskDescription.textContent = descripcionEditingVal;
        closeEditing(element);

        if(descripcionEditingVal.trim() == "") parent.classList.add("no-description");
        else parent.classList.remove("no-description");

        let taskID = parent.getAttribute("data-task-id");
        const data = {
            id: parseInt(taskID),
            title: titleEditingVal,
            description: descripcionEditingVal
        }
        await modifieTaskDB(data);
    })
}

async function modifieTaskDB(data) {
    const response = await fetch("../PHP/modifieTask.php",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    console.log(response);
}