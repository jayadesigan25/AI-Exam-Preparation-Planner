// Select HTML elements
const studentName = document.getElementById("studentName");
const examDate = document.getElementById("examDate");
const studyHours = document.getElementById("studyHours");
const subjectsInput = document.getElementById("subjects");
const planType = document.getElementById("planType");

const generateBtn = document.getElementById("generateBtn");
const timetable = document.getElementById("timetable");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const completedCount = document.getElementById("completedCount");
const totalCount = document.getElementById("totalCount");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

let tasks = [];

// Generate Study Plan
generateBtn.addEventListener("click", function () {

    const name = studentName.value.trim();
    const date = examDate.value;
    const hours = Number(studyHours.value);

    const subjects = subjectsInput.value
        .split(",")
        .map(subject => subject.trim())
        .filter(Boolean);

    if (!name || !date || subjects.length === 0) {
        alert("Please enter your name, exam date, and subjects.");
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exam = new Date(date + "T00:00:00");

    const daysRemaining = Math.ceil(
        (exam - today) / (1000 * 60 * 60 * 24)
    );

    if (!Number.isFinite(hours) || hours < 1 || hours > 16) {
        alert("Please enter study hours between 1 and 16.");
        return;
    }

    if (daysRemaining < 1) {
        alert("Please select an exam date in the future.");
        return;
    }

    const selectedPlan = planType.value;

    let availableHours;

    if (selectedPlan === "Relaxed") {
        availableHours = hours * 0.6;
    } else if (selectedPlan === "Intensive") {
        availableHours = hours;
    } else {
        availableHours = hours * 0.8;
    }

    const minutesPerSubject = Math.floor(
        (availableHours * 60) / subjects.length
    );

    let html = `
        <h3>Hello, ${escapeHTML(name)}!</h3>

        <p><strong>Exam Date:</strong> ${escapeHTML(date)}</p>

        <p><strong>Days Remaining:</strong> ${daysRemaining}</p>

        <p><strong>Selected Plan:</strong> ${selectedPlan}</p>

        <p><strong>Daily Study Time:</strong>
        ${availableHours.toFixed(1)} hours</p>

        <h3>Your Daily Timetable</h3>

        <ul>
    `;

    subjects.forEach(function (subject, index) {

        html += `
            <li>
                <strong>Session ${index + 1}:</strong>
                ${escapeHTML(subject)}
                — ${minutesPerSubject} minutes
            </li>
        `;

    });

    html += `
        </ul>

        <p>☕ Remember to take short breaks between sessions.</p>

        <p>📝 Practise questions and revise difficult topics.</p>

        <p>🎯 Review your progress at the end of each day.</p>
    `;

    timetable.innerHTML = html;

});


// Escape user input before inserting it into HTML
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

}


// Add a Study Task
addTaskBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a study task.");
        return;
    }

    tasks.push({
        text: task,
        completed: false
    });

    taskInput.value = "";

    displayTasks();

});


// Display Tasks
function displayTasks() {

    taskList.replaceChildren();

    tasks.forEach(function (task, index) {

        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const label = document.createElement("span");
        label.textContent = task.text;

        if (task.completed) {
            label.classList.add("completed");
        }

        checkbox.addEventListener("change", function () {

            tasks[index].completed = checkbox.checked;

            displayTasks();

        });

        li.append(checkbox, label);

        taskList.appendChild(li);

    });

    updateProgress();

}


// Update Progress
function updateProgress() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    completedCount.textContent = completed;
    totalCount.textContent = total;

    progressBar.style.width = percentage + "%";

    progressText.textContent = percentage + "% Completed";

}