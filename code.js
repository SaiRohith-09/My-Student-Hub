// Select the necessary elements
const easyButton = document.getElementById('easy');
const intermediateButton = document.getElementById('intermediate');
const hardButton = document.getElementById('hard');

const easyQuestion = document.getElementById('easy-question');
const intermediateQuestion = document.getElementById('intermediate-question');
const hardQuestion = document.getElementById('hard-question');

const checkAnswerButton = document.getElementById('check-answer');
const feedbackDiv = document.getElementById('feedback');

// Set initial state for level selection
let currentLevel = '';

// Event listeners for level buttons
easyButton.addEventListener('click', () => {
    currentLevel = 'easy';
    showQuestion('easy');
    enableButton(intermediateButton);
    enableButton(hardButton);
    easyButton.disabled = true;
});

intermediateButton.addEventListener('click', () => {
    currentLevel = 'intermediate';
    showQuestion('intermediate');
    enableButton(hardButton);
    intermediateButton.disabled = true;
});

hardButton.addEventListener('click', () => {
    currentLevel = 'hard';
    showQuestion('hard');
    hardButton.disabled = true;
});

// Show the appropriate question based on the selected level
function showQuestion(level) {
    // Hide all questions
    easyQuestion.style.display = 'none';
    intermediateQuestion.style.display = 'none';
    hardQuestion.style.display = 'none';

    // Display the selected question
    if (level === 'easy') {
        easyQuestion.style.display = 'block';
    } else if (level === 'intermediate') {
        intermediateQuestion.style.display = 'block';
    } else if (level === 'hard') {
        hardQuestion.style.display = 'block';
    }
}

// Enable button (for next level)
function enableButton(button) {
    button.disabled = false;
}

// Check answer logic when user clicks "Check Answer"
checkAnswerButton.addEventListener('click', () => {
    const userAnswer = getUserAnswer(currentLevel);
    const correctAnswer = getCorrectAnswer(currentLevel);
    
    if (userAnswer === correctAnswer) {
        feedbackDiv.innerHTML = '<p style="color: green;">Correct! Well done!</p>';
    } else {
        feedbackDiv.innerHTML = `<p style="color: red;">Oops! Try again.</p><p><strong>Correct Answer:</strong><pre>${correctAnswer}</pre></p>`;
    }
});

// Get the user's answer based on selected level
function getUserAnswer(level) {
    let answer = '';
    if (level === 'easy') {
        answer = document.getElementById('html-easy').value.trim();
    } else if (level === 'intermediate') {
        answer = document.getElementById('html-intermediate').value.trim();
    } else if (level === 'hard') {
        answer = document.getElementById('html-hard').value.trim();
    }
    return answer;
}

// Get the correct answer for the selected level
function getCorrectAnswer(level) {
    const answers = {
        easy: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Webpage</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`,
        intermediate: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Box Layout</title>
</head>
<body>
        <h1>Heading</h1>
        <p>This is a paragraph.</p>
</body>
</html>`,
        hard: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three Item Layout</title>
</head>
<body>
    <div class="container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
    </div>
</body>
</html>`
    };
    return answers[level];
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
