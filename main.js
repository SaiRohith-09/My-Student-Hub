const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

document.addEventListener("DOMContentLoaded", function () {
const username = localStorage.getItem("signupUsername");
const rollNumber = localStorage.getItem("signupRollNumber");

const usernameSpan = document.getElementById("display-username");
const rollSpan = document.getElementById("display-rollnumber");

if (usernameSpan && username) {
usernameSpan.textContent = username;
}

if (rollSpan && rollNumber) {
rollSpan.textContent = rollNumber;
}
});

const btn = document.querySelector(".back-to-top");

window.onscroll = () => {
if (document.documentElement.scrollTop > 300) {
btn.style.display = "block";
} else {
btn.style.display = "none";
}
};

function scrollToTop() {
window.scrollTo({
top: 0,
behavior: "smooth"
});
}

document.getElementById("logoutBtn").addEventListener("click", function () {
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(function (c) {
document.cookie = c
.replace(/^ +/, "")
.replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
alert("You have been logged out.");
window.location.href = "index.html";
});