// ---------- Pomodoro Timer ----------
let pomodoroTimer;
let timeLeft = 25 * 60; // 25 minutes
let isPomodoroRunning = false;
const timerDisplay = document.getElementById('pomodoroTimer');
const startButton = document.getElementById('startPomodoro');
const resetButton = document.getElementById('resetPomodoro');

function updatePomodoroDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startPomodoro() {
    if (!isPomodoroRunning) {
        isPomodoroRunning = true;
        pomodoroTimer = setInterval(() => {
            timeLeft--;
            updatePomodoroDisplay();

            if (timeLeft <= 0) {
                clearInterval(pomodoroTimer);
                isPomodoroRunning = false;
                
                // Switch between study and break
                if (timerDisplay.textContent === "00:00") {
                    if (timeLeft === 0) {
                        // After 25 min work -> 5 min break
                        alert("⏰ Time for a 5-minute break!");
                        timeLeft = 5 * 60; 
                        startPomodoro();
                    } else {
                        // After 5 min break -> 25 min study
                        alert("🧠 Break over! Time to focus again for 25 minutes!");
                        timeLeft = 25 * 60;
                        startPomodoro();
                    }
                }
            }
        }, 1000);
    }
}

function resetPomodoro() {
    clearInterval(pomodoroTimer);
    isPomodoroRunning = false;
    timeLeft = 25 * 60;
    updatePomodoroDisplay();
}

startButton.addEventListener('click', startPomodoro);
resetButton.addEventListener('click', resetPomodoro);
updatePomodoroDisplay();


// ---------- GPA Calculator ----------
const addCourseButton = document.getElementById('addCourseButton');
const gpaForm = document.getElementById('gpaForm');
const coursesContainer = document.getElementById('courses');
const gpaResult = document.getElementById('gpaResult');

let courseCount = 1;

addCourseButton.addEventListener('click', () => {
    if (courseCount >= 12) {
        alert("⚠️ You can add a maximum of 12 courses only.");
        return;
    }

    courseCount++;

    const courseDiv = document.createElement('div');
    courseDiv.className = 'input-group';
    courseDiv.innerHTML = `
        <label for="course${courseCount}">Course ${courseCount}</label>
        <input type="number" class="course-grade" placeholder="Grade" min="0" max="100">
        <input type="number" class="course-credit" placeholder="Credit Hours" min="1">
    `;

    coursesContainer.appendChild(courseDiv);
});

gpaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const grades = document.querySelectorAll('.course-grade');
    const credits = document.querySelectorAll('.course-credit');

    let totalWeightedGrades = 0;
    let totalCredits = 0;

    grades.forEach((gradeInput, index) => {
        const grade = parseFloat(gradeInput.value);
        const credit = parseFloat(credits[index].value);

        if (!isNaN(grade) && !isNaN(credit)) {
            totalWeightedGrades += grade * credit;
            totalCredits += credit;
        }
    });

    if (totalCredits === 0) {
        gpaResult.textContent = "⚠️ Please enter valid grades and credit hours.";
        return;
    }

    const gpa = totalWeightedGrades / totalCredits;
    gpaResult.textContent = `🎓 Your GPA is: ${gpa.toFixed(2)}`;
});


// ---------- Daily Study Goals ----------
const dailyGoalForm = document.getElementById('dailyGoalForm');
const goalInput = document.getElementById('goal');

dailyGoalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const goal = goalInput.value.trim();

    if (goal) {
        localStorage.setItem('dailyGoal', goal);
        alert('🎯 Goal saved successfully!');
        goalInput.value = '';
    }
});

function saveReflection() {
    const reflectionText = document.getElementById('reflection').value.trim();

    if (reflectionText) {
        localStorage.setItem('dailyReflection', reflectionText);
        alert('📝 Reflection saved!');
        document.getElementById('reflection').value = '';
    }
}


// ---------- Personalized Study Planner ----------
const studyPlannerForm = document.getElementById('studyPlannerForm');
const studyPlannerList = document.getElementById('studyPlannerList');

studyPlannerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const subject = document.getElementById('subject').value.trim();
    const studyTime = document.getElementById('studyTime').value;

    if (subject && studyTime > 0) {
        const listItem = document.createElement('li');
        listItem.textContent = `${subject} - ${studyTime} hour(s)`;
        studyPlannerList.appendChild(listItem);

        // Clear the form
        document.getElementById('subject').value = '';
        document.getElementById('studyTime').value = '';
    } else {
        alert('⚠️ Please enter both subject and study time.');
    }
});


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

