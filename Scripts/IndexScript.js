const tasksContainer = document.getElementById('tasks');
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

        //Para presentar la tarear en la UI
        taskElement = createTaskElement(response.id ,data['task-tittle-input'], data['task-description-input'], new Date(Date.now()).toLocaleDateString());
        tasksContainer.appendChild(taskElement);
    });

    //Elimina una tarea de la base de datos y de la UI
    const deleteButtons = document.querySelectorAll(".task .delete-task-btn");
    deleteButtons.forEach(button => {
        addDelateEvent(button);
    })
});

//Devuelve una la lista de tareas de la base de datos
async function getTaskList(){
    const JSONElementsObtained = await fetch("./PHP/fetch_tasks.php");
    const tasks = await JSONElementsObtained.json();
    return tasks;
}

//Vuelve a cargar las tareas segun el usuario
async function getTasks(){
    restartTasks();
    const tasks = await getTaskList();
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.id, task.title, task.description, new Date(task.created_at).toLocaleDateString(), task.status);
        tasksContainer.appendChild(taskElement);
    });
}

//Crea una tarea
function createTaskElement(id ,title, description, creationDate, status){
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.setAttribute("data-task-id", id)

    const checkboxInput = document.createElement("input");
    checkboxInput.setAttribute("type", "checkbox");
    checkboxInput.className = "checkbox-input";

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

    taskElement.append(checkboxInput, taskTitle, taskDescription, taskCreationDate, editTaskBtn, deleteTaskBtn);

    //Añadir funciones
    //Check box
    if(status != undefined){
        if(status == "completed") checkboxInput.checked = true;
    }
    addChangeTaskStatusEvent(checkboxInput);
    return taskElement;
}

//Vacia las tareas en el UI
function restartTasks(){
    while(tasksContainer.firstElementChild.nextElementSibling){
        tasksContainer.firstElementChild.nextElementSibling.remove()
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

//Cambiar estatusde tarea
async function addChangeTaskStatusEvent(element){
    element.addEventListener("click", async function(){
        const taskID = element.parentNode.dataset["taskId"];
        const status = element.checked;
        await changeTaskStatus(taskID, status);
    });
}
async function changeTaskStatus(taskID, status){
    console.log(status);
    const response = await fetch("../PHP/changeTaskStatus.php",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({taskID: taskID, status: status})
    });
    console.log(await response.json());
}