document.getElementById('downloadBtn').addEventListener('click', function() {
    // Get form inputs
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var about = document.getElementById('about').value;
    var skills = document.getElementById('skills').value;
    var education = document.getElementById('education').value;
    var experience = document.getElementById('experience').value;
    var projects = document.getElementById('projects').value;
    var certifications = document.getElementById('certifications').value;
    var languages = document.getElementById('languages').value;
    var technicalSkills = document.getElementById('technicalSkills').value;
    var softSkills = document.getElementById('softSkills').value;
    var hobbies = document.getElementById('hobbies').value;
    var awards = document.getElementById('awards').value;
    var volunteerExperience = document.getElementById('volunteerExperience').value;
    var links = document.getElementById('links').value;
    var publications = document.getElementById('publications').value;
    var references = document.getElementById('references').value;

    // Check if any field is empty
    if (!name || !email || !phone || !about || !skills || !education || !experience || !projects || !certifications || 
        !languages || !technicalSkills || !softSkills || !hobbies || !awards || !volunteerExperience || !links || !publications || !references) {
        
        alert("Please fill in all fields before downloading your resume.");
        return;
    }

    // Create a new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add content to PDF
    doc.setFont("helvetica");
    doc.setFontSize(20);
    doc.text("Resume of " + name, 14, 20);

    doc.setFontSize(12);
    doc.text("Email: " + email, 14, 30);
    doc.text("Phone: " + phone, 14, 40);
    doc.text("About Me: " + about, 14, 50);
    doc.text("Skills: " + skills, 14, 60);
    doc.text("Education: " + education, 14, 70);
    doc.text("Experience: " + experience, 14, 80);
    doc.text("Projects: " + projects, 14, 90);
    doc.text("Certifications: " + certifications, 14, 100);
    doc.text("Languages: " + languages, 14, 110);
    doc.text("Technical Skills: " + technicalSkills, 14, 120);
    doc.text("Soft Skills: " + softSkills, 14, 130);
    doc.text("Hobbies & Interests: " + hobbies, 14, 140);
    doc.text("Awards & Achievements: " + awards, 14, 150);
    doc.text("Volunteer Experience: " + volunteerExperience, 14, 160);
    doc.text("Links: " + links, 14, 170);
    doc.text("Publications or Blogs: " + publications, 14, 180);
    doc.text("References: " + references, 14, 190);

    // Save the document
    doc.save('resume.pdf');
});

function analyzeFinance() {
    const income = parseFloat(document.getElementById("income").value);
    const expenses = parseFloat(document.getElementById("expenses").value);
    const resultBox = document.getElementById("financeResult");

    if (isNaN(income) || isNaN(expenses)) {
        resultBox.innerHTML = "<p style='color:red;'>Please enter valid income and expenses.</p>";
        return;
    }

    const savings = income - expenses;
    let suggestion = "";

    if (savings < 0) {
        suggestion = "You're spending more than you earn. Try to cut down on non-essential expenses.";
    } else if (savings < income * 0.2) {
        suggestion = "You’re saving a bit. Try to aim for at least 20% savings for future needs.";
    } else {
        suggestion = "Great job! You're saving well. Consider investing in a student-friendly savings account or SIP.";
    }

    resultBox.innerHTML = `
        <h3>Monthly Analysis</h3>
        <p><strong>Income:</strong> ₹${income}</p>
        <p><strong>Expenses:</strong> ₹${expenses}</p>
        <p><strong>Savings:</strong> ₹${savings}</p>
        <p><strong>Suggestion:</strong> ${suggestion}</p>
    `;
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
