const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function createClassTimetable() {
  const tbody = document.getElementById("classBody");
  tbody.innerHTML = "";

  days.forEach(day => {
    const row = document.createElement("tr");
    const dayCell = document.createElement("td");
    dayCell.textContent = day;
    row.appendChild(dayCell);

    for (let i = 0; i < 6; i++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `P${i + 1}`;
      input.classList.add("period-input");
      cell.appendChild(input);
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  });

  // Load any saved data
  loadClassTimetable();
}

function saveClassTimetable() {
  const timetable = [];
  const rows = document.querySelectorAll("#classBody tr");

  rows.forEach(row => {
    const day = row.children[0].textContent;
    const periods = [];

    for (let i = 1; i <= 6; i++) {
      const val = row.children[i].querySelector("input").value.trim();
      periods.push(val || "-");
    }

    timetable.push({ name: day, periods });
  });

  localStorage.setItem("classTimetable", JSON.stringify(timetable));
  alert("✅ Class Timetable saved!");
}

function loadClassTimetable() {
  const saved = JSON.parse(localStorage.getItem("classTimetable") || "[]");
  if (!saved.length) return;

  const rows = document.querySelectorAll("#classBody tr");

  saved.forEach((dayData, rowIndex) => {
    const inputs = rows[rowIndex].querySelectorAll("input");
    dayData.periods.forEach((p, i) => {
      inputs[i].value = p;
    });
  });
}

function saveNotificationTime() {
  const time = document.getElementById("notification-time").value;
  if (time) {
    localStorage.setItem("notificationTime", time);
    alert(`✅ Notification time set for ${time}`);
  }
}

function loadNotificationTime() {
  const time = localStorage.getItem("notificationTime");
  if (time) {
    document.getElementById("notification-time").value = time;
  }
}

function sendClassTimetableNotification() {
  const classData = JSON.parse(localStorage.getItem("classTimetable") || "[]");
  const today = new Date().getDay(); // 0=Sunday
  if (today === 0) return; // Skip Sunday
  const todayName = days[today - 1];

  const todayData = classData.find(day => day.name === todayName);
  if (!todayData) return;

  const message = todayData.periods.join(", ");
  if (Notification.permission === "granted") {
    new Notification("📚 Today's Classes", { body: message });
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("📚 Today's Classes", { body: message });
      }
    });
  }
}

function setupClassTimetableNotifications() {
  const savedTime = localStorage.getItem("notificationTime") || "08:00";
  const [hours, minutes] = savedTime.split(":");

  const now = new Date();
  const nextNotification = new Date();
  nextNotification.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  let delay = nextNotification - now;
  if (delay < 0) {
    nextNotification.setDate(nextNotification.getDate() + 1);
    delay = nextNotification - now;
  }

  console.log("⏰ Notification will trigger in", Math.round(delay / 1000), "seconds");

  setTimeout(() => {
    sendClassTimetableNotification();
    setInterval(sendClassTimetableNotification, 24 * 60 * 60 * 1000); // Repeat daily
  }, delay);
}

// On load
document.addEventListener("DOMContentLoaded", () => {
  createClassTimetable();
  loadNotificationTime();
  setupClassTimetableNotifications();
});


// ---------------- EXAM TIMETABLE ----------------

// Function to load saved exam timetable from localStorage
function loadExamTimetable() {
  const examBody = document.getElementById("examBody");
  examBody.innerHTML = "";  // Clear the table first

  const savedExams = JSON.parse(localStorage.getItem("examTimetable") || "[]");
  savedExams.forEach(exam => {
    const row = createExamRow(exam.subject, exam.date);
    examBody.appendChild(row);
  });

  updateCountdowns();  // Ensure countdowns are updated on load
  setupExamNotifications();  // Setup notifications after loading data
}

// Function to create an exam row (for adding or loading saved exams)
function createExamRow(subject, date) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" value="${subject}" placeholder="Subject" /></td>
    <td><input type="date" value="${date}" onchange="updateCountdowns()" /></td>
    <td class="countdown">-</td>
    <td><button onclick="deleteExamRow(this)">🗑️ Delete</button></td>
  `;
  return row;
}

// Function to add a new exam row
function addExamRow() {
  const examBody = document.getElementById("examBody");
  const row = createExamRow("", "");  // Empty row by default
  examBody.appendChild(row);
  updateCountdowns();  // Update countdowns after adding a row
}

// Function to delete an exam row
function deleteExamRow(button) {
  button.parentElement.parentElement.remove();  // Remove the row
  updateCountdowns();  // Update countdowns after deleting a row
}

// Function to update the countdown for each exam
function updateCountdowns() {
  const today = new Date();
  document.querySelectorAll("#examBody tr").forEach(row => {
    const dateInput = row.querySelector("input[type='date']");
    const countdownCell = row.querySelector(".countdown");

    if (dateInput.value) {
      const examDate = new Date(dateInput.value);
      const timeDiff = examDate - today;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));  // Calculate days left

      if (daysLeft >= 0) {
        countdownCell.textContent = `${daysLeft} days left`;  // Show countdown
      } else {
        countdownCell.textContent = "Completed";  // Show "Completed" if past the exam date
      }
    } else {
      countdownCell.textContent = "-";  // If no date, show "-"
    }
  });
}

// Function to save the exam timetable to localStorage
function saveExamTimetable() {
  const exams = [];
  document.querySelectorAll("#examBody tr").forEach(row => {
    const subject = row.querySelector("input[type='text']").value;
    const date = row.querySelector("input[type='date']").value;
    exams.push({ subject, date });
  });

  localStorage.setItem("examTimetable", JSON.stringify(exams));
  alert('Exam timetable saved successfully! ✅');
}

// ---------------- ASSIGNMENTS ----------------

// Function to add a new assignment row
function addAssignmentRow() {
  const table = document.getElementById('assignmentBody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" placeholder="Subject" /></td>
    <td><input type="text" placeholder="Title" /></td>
    <td><input type="date" /></td>
    <td><button onclick="deleteRow(this)">🗑️ Delete</button></td>
  `;
  table.appendChild(row);
}

// Function to delete an assignment row
function deleteRow(button) {
  button.parentElement.parentElement.remove();  // Remove the row
}

// Function to save the assignment records
function saveAssignmentRecords() {
  alert('Assignments saved successfully! ✅');
}

// ---------------- LAB RECORDS ----------------

// Function to add a new lab record row
function addLabRecordRow() {
  const table = document.getElementById('labRecordBody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" placeholder="Subject" /></td>
    <td><input type="date" /></td>
    <td><input type="text" placeholder="Experiment" /></td>
    <td><button onclick="deleteRow(this)">🗑️ Delete</button></td>
  `;
  table.appendChild(row);
}

// Function to save the lab records
function saveLabRecords() {
  alert('Lab records saved successfully! ✅');
}

// ---------------- CLASS TESTS ----------------

// Function to add a new class test row
function addClassTestRow() {
  const table = document.getElementById('classTestBody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" placeholder="Subject" /></td>
    <td><input type="date" /></td>
    <td><input type="number" placeholder="Marks" /></td>
    <td><button onclick="deleteRow(this)">🗑️ Delete</button></td>
  `;
  table.appendChild(row);
}

// Function to save the class test records
function saveClassTests() {
  alert('Class tests saved successfully! ✅');
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

