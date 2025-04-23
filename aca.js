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

function loadExamTimetable() {
  const examBody = document.getElementById("examBody");
  examBody.innerHTML = "";

  const savedExams = JSON.parse(localStorage.getItem("examTimetable") || "[]");
  savedExams.forEach(exam => {
    const row = createExamRow(exam.subject, exam.date);
    examBody.appendChild(row);
  });

  updateCountdowns();
  setupExamNotifications(); // Call to set up exam notifications after loading data
}

function saveExamTimetable() {
  const rows = document.querySelectorAll("#examBody tr");
  const exams = [];

  rows.forEach(row => {
    const subject = row.querySelector("input[type='text']").value;
    const date = row.querySelector("input[type='date']").value;
    if (subject && date) {
      exams.push({ subject, date });
    }
  });

  localStorage.setItem("examTimetable", JSON.stringify(exams));
  alert("✅ Exam timetable saved!");
}

function addExamRow() {
  const examBody = document.getElementById("examBody");
  const row = createExamRow("", "");
  examBody.appendChild(row);
}

function createExamRow(subject, date) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" value="${subject}" placeholder="Subject" /></td>
    <td><input type="date" value="${date}" onchange="updateCountdowns()" /></td>
    <td class="countdown">-</td>
    <td><button onclick="deleteExamRow(this)">Delete</button></td>
  `;
  return row;
}

function deleteExamRow(btn) {
  btn.closest("tr").remove();
  saveExamTimetable();
  updateCountdowns();
}

function updateCountdowns() {
  const today = new Date();
  document.querySelectorAll("#examBody tr").forEach(row => {
    const dateInput = row.querySelector("input[type='date']");
    const countdownCell = row.querySelector(".countdown");

    if (dateInput.value) {
      const examDate = new Date(dateInput.value);
      const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
      countdownCell.textContent = daysLeft >= 0 ? `${daysLeft} days left` : "Completed";
    } else {
      countdownCell.textContent = "-";
    }
  });
}

// ---------------- EXAM NOTIFICATIONS ----------------

function setupExamNotifications() {
  const savedExams = JSON.parse(localStorage.getItem("examTimetable") || "[]");
  const today = new Date();
  
  savedExams.forEach(exam => {
    const examDate = new Date(exam.date);
    if (examDate >= today) {  // Only set notification for future exams
      scheduleExamNotification(exam.subject, examDate);
    }
  });
}

function scheduleExamNotification(subject, examDate) {
  const today = new Date();
  const diffTime = examDate - today;
  
  if (diffTime <= 0) return; // Skip if the exam date is in the past
  
  // Set the notification for a day before the exam
  const notificationTime = examDate.setDate(examDate.getDate() - 1); // 1 day before
  
  const timeDiff = notificationTime - today;
  
  setTimeout(() => {
    sendExamNotification(subject, examDate);
  }, timeDiff);
  
  // Set an additional notification for the exam day itself
  const examDayDiff = examDate - today;
  setTimeout(() => {
    sendExamNotification(subject, examDate);
  }, examDayDiff);
}

function sendExamNotification(subject, examDate) {
  const message = `📝 Your exam for ${subject} is tomorrow!`;
  const today = new Date();
  
  if (examDate.toDateString() === today.toDateString()) {
    message = `⏳ Your exam for ${subject} is today! Good luck!`;
  }
  
  if (Notification.permission === "granted") {
    new Notification("📅 Exam Reminder", { body: message });
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("📅 Exam Reminder", { body: message });
      }
    });
  }
}

window.onload = () => {
  loadClassTimetable();
  loadExamTimetable();
  loadNotificationTime();
  setupClassTimetableNotifications();
  updateCountdowns();
  setupExamNotifications();
  
  // Ask for Notification permission on page load
  requestNotificationPermission();
};

// Request notification permission
function requestNotificationPermission() {
  if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        alert("You will receive notifications for classes and exams.");
      } else {
        alert("You won't receive notifications unless you grant permission.");
      }
    });
  }
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


