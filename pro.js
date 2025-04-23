// Pomodoro Timer Functionality
let pomodoroTimer;
let isPomodoro = true;
let pomodoroTime = 25 * 60; // 25 minutes
let breakTime = 5 * 60; // 5 minutes

const timerDisplay = document.getElementById("pomodoroTimer");
const startButton = document.getElementById("startPomodoro");
const resetButton = document.getElementById("resetPomodoro");

function updatePomodoroTimer(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startPomodoroTimer() {
    if (pomodoroTimer) {
        clearInterval(pomodoroTimer);
    }

    let currentTime = isPomodoro ? pomodoroTime : breakTime;

    pomodoroTimer = setInterval(() => {
        currentTime--;
        updatePomodoroTimer(currentTime);

        if (currentTime <= 0) {
            clearInterval(pomodoroTimer);
            if (isPomodoro) {
                isPomodoro = false;
                startPomodoroTimer(); // Switch to break time
                sendNotification("Pomodoro complete! Time for a break.");
            } else {
                isPomodoro = true;
                startPomodoroTimer(); // Switch back to work time
                sendNotification("Break over! Back to work!");
            }
        }
    }, 1000);
}

function resetPomodoroTimer() {
    clearInterval(pomodoroTimer);
    isPomodoro = true;
    updatePomodoroTimer(pomodoroTime);
}

startButton.addEventListener("click", startPomodoroTimer);
resetButton.addEventListener("click", resetPomodoroTimer);

// Request Notification Permission
function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function sendNotification(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    }
}

requestNotificationPermission();

// Task List Functionality
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskValue = taskInput.value.trim();
    if (taskValue) {
        const listItem = document.createElement("li");
        listItem.textContent = taskValue;
        taskList.appendChild(listItem);
        taskInput.value = ""; // Clear input field
    }
});

// GPA Calculator Functionality
const gpaForm = document.getElementById("gpaForm");
const coursesContainer = document.getElementById("courses");
const gpaResult = document.getElementById("gpaResult");
const addCourseButton = document.getElementById("addCourseButton");

addCourseButton.addEventListener("click", addNewCourseInput);

gpaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const courseGrades = document.querySelectorAll(".course-grade");
    const courseCredits = document.querySelectorAll(".course-credit");

    let totalCredits = 0;
    let weightedGrades = 0;

    // Loop through all courses and calculate the GPA
    courseGrades.forEach((grade, index) => {
        const credit = courseCredits[index];
        if (!isNaN(grade.value) && !isNaN(credit.value)) {
            totalCredits += parseFloat(credit.value);
            weightedGrades += parseFloat(grade.value) * parseFloat(credit.value);
        }
    });

    if (totalCredits > 0) {
        const gpa = weightedGrades / totalCredits;
        gpaResult.textContent = `Your GPA: ${gpa.toFixed(2)}`;
    } else {
        gpaResult.textContent = "Please enter valid grades and credit hours for all courses.";
    }
});

function addNewCourseInput() {
    // Check if the user has added more than 12 courses
    const courseInputs = document.querySelectorAll(".course-grade");
    if (courseInputs.length >= 12) {
        alert("You can only add a maximum of 12 courses.");
        return;
    }

    // Create new input fields for grade and credit
    const newCourseDiv = document.createElement("div");
    newCourseDiv.classList.add("input-group");

    const courseNumber = courseInputs.length + 1;

    const gradeLabel = document.createElement("label");
    gradeLabel.setAttribute("for", `course${courseNumber}`);
    gradeLabel.textContent = `Course ${courseNumber}`;
    
    const gradeInput = document.createElement("input");
    gradeInput.setAttribute("type", "number");
    gradeInput.setAttribute("class", "course-grade");
    gradeInput.setAttribute("placeholder", "Grade");
    gradeInput.setAttribute("min", "0");
    gradeInput.setAttribute("max", "100");

    const creditInput = document.createElement("input");
    creditInput.setAttribute("type", "number");
    creditInput.setAttribute("class", "course-credit");
    creditInput.setAttribute("placeholder", "Credit Hours");
    creditInput.setAttribute("min", "1");

    newCourseDiv.appendChild(gradeLabel);
    newCourseDiv.appendChild(gradeInput);
    newCourseDiv.appendChild(creditInput);

    coursesContainer.appendChild(newCourseDiv);
}


// Assignment Due Dates Functionality
const assignmentForm = document.getElementById("assignmentForm");
const assignmentNameInput = document.getElementById("assignment-name");
const assignmentDateInput = document.getElementById("assignment-date");
const assignmentList = document.getElementById("assignmentList");

assignmentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const assignmentName = assignmentNameInput.value.trim();
    const assignmentDate = assignmentDateInput.value;

    if (assignmentName && assignmentDate) {
        const listItem = document.createElement("li");
        listItem.textContent = `${assignmentName} - Due by ${assignmentDate}`;
        assignmentList.appendChild(listItem);

        assignmentNameInput.value = "";
        assignmentDateInput.value = "";
    }
});

// Project Due Dates Functionality
const projectForm = document.getElementById("projectForm");
const projectNameInput = document.getElementById("project-name");
const projectDateInput = document.getElementById("project-date");
const projectList = document.getElementById("projectList");

projectForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const projectName = projectNameInput.value.trim();
    const projectDate = projectDateInput.value;

    if (projectName && projectDate) {
        const listItem = document.createElement("li");
        listItem.textContent = `${projectName} - Due by ${projectDate}`;
        projectList.appendChild(listItem);

        projectNameInput.value = "";
        projectDateInput.value = "";
    }
});

// Exam Preparation Checklist Functionality
const examChecklistForm = document.getElementById("examChecklistForm");
const examTopicInput = document.getElementById("examTopicInput");
const examChecklist = document.getElementById("examChecklist");
const remainingCount = document.getElementById("remainingCount");

examChecklistForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const topic = examTopicInput.value.trim();
    if (topic) {
        const listItem = document.createElement("li");
        listItem.textContent = topic;
        examChecklist.appendChild(listItem);

        examTopicInput.value = "";
        updateRemainingCount();
    }
});

function updateRemainingCount() {
    const items = examChecklist.getElementsByTagName("li");
    remainingCount.textContent = `Remaining Topics: ${items.length}`;
}


  document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
        alert("Access denied. Please log in first.");
        window.location.href = "login.html";
    }
});

// Optional: Add logout button functionality if used
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    alert("You have been logged out.");
    window.location.href = "login.html";
}
