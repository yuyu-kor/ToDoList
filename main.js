let currentTaskType = 'external';

document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
});

function saveTasks() {
    const tasks = [];
    document.querySelectorAll(`#taskList li`).forEach(li => {
        tasks.push({
            text: li.querySelector(".task-content").innerText,
            checked: li.querySelector("input[type='checkbox']").checked
        });
    });
    localStorage.setItem(currentTaskType, JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    
    const savedTasks = JSON.parse(localStorage.getItem(currentTaskType)) || [];
    savedTasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `
            <input type='checkbox' onclick='toggleTask(this)' ${task.checked ? "checked" : ""}>
            <span class='task-content'>${task.text}</span>
            <button onclick='removeTask(this)'>-</button>
        `;
        taskList.appendChild(li);
    });
}

function changeTaskType(type) {
    currentTaskType = type;
    document.getElementById("taskTitle").innerText = type === 'external' ? '외부업무' : type === 'internal' ? '내부업무' : '기타업무';
    loadTasks();
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    let li = document.createElement("li");
    li.innerHTML = `
        <input type='checkbox' onclick='toggleTask(this)'>
        <span class='task-content'>${taskText}</span>
        <button onclick='removeTask(this)'>-</button>
    `;
    
    document.getElementById("taskList").appendChild(li);
    taskInput.value = "";
    saveTasks();
}

function toggleTask(checkbox) {
    let taskContent = checkbox.nextElementSibling;
    if (checkbox.checked) {
        taskContent.style.textDecoration = "line-through";
        taskContent.style.opacity = "0.6";
    } else {
        taskContent.style.textDecoration = "none";
        taskContent.style.opacity = "1";
    }
    saveTasks();
}

function removeTask(button) {
    button.parentElement.remove();
    saveTasks();
}
