document.addEventListener("DOMContentLoaded", function() {
    loadTasks("externalTaskList");
    loadTasks("internalTaskList");
    loadTasks("otherTaskList");
});

function saveTasks(listId) {
    const tasks = [];
    document.querySelectorAll(`#${listId} li`).forEach(li => {
        tasks.push({
            text: li.querySelector(".task-content").innerText,
            checked: li.querySelector("input[type='checkbox']").checked
        });
    });
    localStorage.setItem(listId, JSON.stringify(tasks));
}

function loadTasks(listId) {
    const savedTasks = JSON.parse(localStorage.getItem(listId)) || [];
    savedTasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `
            <input type='checkbox' onclick='toggleTask(this, "${listId}")' ${task.checked ? "checked" : ""}>
            <span class='task-content'>${task.text}</span>
            <button class='delete-btn' onclick='removeTask(this, "${listId}")'>-</button>
        `;
        document.getElementById(listId).appendChild(li);
    });
}

function addTask(inputId, listId) {
    let taskInput = document.getElementById(inputId);
    let taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    let li = document.createElement("li");
    li.innerHTML = `
        <input type='checkbox' onclick='toggleTask(this, "${listId}")'>
        <span class='task-content'>${taskText}</span>
        <button class='delete-btn' onclick='removeTask(this, "${listId}")'>-</button>
    `;
    
    document.getElementById(listId).appendChild(li);
    taskInput.value = "";
    saveTasks(listId);
}

function toggleTask(checkbox, listId) {
    let taskContent = checkbox.nextElementSibling;
    if (checkbox.checked) {
        taskContent.style.textDecoration = "line-through";
        taskContent.style.opacity = "0.6";
    } else {
        taskContent.style.textDecoration = "none";
        taskContent.style.opacity = "1";
    }
    saveTasks(listId);
}

function removeTask(button, listId) {
    button.parentElement.remove();
    saveTasks(listId);
}
