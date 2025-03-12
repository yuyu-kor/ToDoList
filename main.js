let currentTaskType = 'external';

document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
});

function saveTasks() {
    const tasks = [];
    document.querySelectorAll(`#taskList li`).forEach(li => {
        tasks.push({
            text: li.getAttribute("data-text"),  // 순수한 업무 내용만 저장
            checked: li.querySelector("input[type='checkbox']").checked,
            deadline: li.getAttribute("data-deadline") || ""
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
        li.setAttribute("data-text", task.text);
        li.setAttribute("data-deadline", task.deadline);
        li.innerHTML = `
            <input type='checkbox' onclick='toggleTask(this)' ${task.checked ? "checked" : ""}>
            <span class='task-content'>${task.text} ${task.deadline ? `- ${task.deadline}` : ""}</span>
            <button onclick='removeTask(this)'>-</button>
        `;
        // 체크된 상태라면 취소선 스타일 적용
        if (task.checked) {
            li.querySelector('.task-content').style.textDecoration = "line-through";
            li.querySelector('.task-content').style.opacity = "0.6";
        }
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
    let deadlineInput = document.getElementById("deadlineInput");
    let taskText = taskInput.value.trim();
    let deadline = deadlineInput.value;  // flatpickr로 선택한 날짜

    if (taskText === "") return;

    let li = document.createElement("li");
    // 순수 업무 내용과 데드라인을 별도의 data 속성에 저장
    li.setAttribute("data-text", taskText);
    li.setAttribute("data-deadline", deadline);

    li.innerHTML = `
        <input type='checkbox' onclick='toggleTask(this)'>
        <span class='task-content'>${taskText} ${deadline ? `- ${deadline}` : ""}</span>
        <button onclick='removeTask(this)'>-</button>
    `;

    document.getElementById("taskList").appendChild(li);
    taskInput.value = "";
    deadlineInput.value = "";
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

document.addEventListener("DOMContentLoaded", function() {
    // flatpickr 초기화 (날짜 형식을 연도-월-일로 지정)
    flatpickr("#deadlineInput", {
        dateFormat: "Y-m-d"
    });
    loadTasks();
});

if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

function checkDeadlines() {
    const tasks = JSON.parse(localStorage.getItem(currentTaskType)) || [];
    const now = new Date();
    
    tasks.forEach(task => {
        if (task.deadline) {
            const deadlineDate = new Date(task.deadline);
            const timeDiff = deadlineDate - now;
        
        // 데드라인이 24시간 이내에 다가오는 경우
            if (timeDiff <= 86400000 && timeDiff > 0) { // 86400000ms = 24시간
                new Notification("마감 임박", {
                    body: `${task.text} 마감이 24시간 이내입니다.`,
                });
            }
            // 데드라인이 이미 지난 경우
            else if (timeDiff <= 0) {
                new Notification("마감 완료", {
                    body: `${task.text} 마감되었습니다.`,
                });
            }
        }
    });
}
