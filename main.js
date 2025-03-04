document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
});

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-content").innerText,
            checked: li.querySelector("input[type='checkbox']").checked
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `
            <input type='checkbox' onclick='toggleTask(this)' ${task.checked ? "checked" : ""}>
            <span class='task-content'>${task.text}</span>
            <button class='delete-btn' onclick='removeTask(this)'>-</button>
        `;
        document.getElementById("taskList").appendChild(li);
    });
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    let li = document.createElement("li");
    li.innerHTML = `
        <input type='checkbox' onclick='toggleTask(this)'>
        <span class='task-content'>${taskText}</span>
        <button class='delete-btn' onclick='removeTask(this)'>-</button>
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
