// Robot Pet Play Button
document.getElementById("playButton").addEventListener("click", () => {
    const pet = document.getElementById("robotPet");
    pet.style.transform = "rotate(20deg)";
    setTimeout(() => {
      pet.style.transform = "rotate(-20deg)";
      setTimeout(() => {
        pet.style.transform = "rotate(0deg)";
      }, 200);
    }, 200);
  });
  
  // Memory Game Logic
  const emojis = ["🍎", "🚀", "🎵", "🐶", "🌈", "⚽", "🎮", "🎲"];
  let memoryCards = [...emojis, ...emojis];
  let firstCard, secondCard;
  let lockBoard = false;
  
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  function startMemoryGame() {
    document.querySelector(".games-section").insertAdjacentHTML("beforeend", `<div id="memory-game" class="game-board"></div>`);
    const board = document.getElementById("memory-game");
    board.innerHTML = "";
    memoryCards = shuffle(memoryCards);
    board.style.display = "grid";
  
    memoryCards.forEach((emoji) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <span class="front"></span>
        <span class="back">${emoji}</span>
      `;
      board.appendChild(card);
  
      card.addEventListener("click", () => {
        if (lockBoard || card.classList.contains("flipped")) return;
  
        card.classList.add("flipped");
  
        if (!firstCard) {
          firstCard = card;
        } else {
          secondCard = card;
          checkMatch();
        }
      });
    });
  }
  
  function checkMatch() {
    const isMatch =
      firstCard.querySelector(".back").textContent ===
      secondCard.querySelector(".back").textContent;
  
    if (isMatch) {
      firstCard = null;
      secondCard = null;
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard = null;
        secondCard = null;
        lockBoard = false;
      }, 1000);
    }
  }
  
  // Quiz Game Logic
  const quizData = [
    {
      question: "Which language is used for web apps?",
      options: ["Python", "JavaScript", "C++", "Java"],
      answer: "JavaScript",
    },
    {
      question: "HTML stands for?",
      options: ["Hyper Transfer Markup Language", "Hyper Text Makeup Language", "Hyper Text Markup Language", "None"],
      answer: "Hyper Text Markup Language",
    },
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      answer: "Cascading Style Sheets",
    }
  ];
  
  let quizIndex = 0;
  
  function startQuizGame() {
    const quizBoxId = "quiz-game";
    let quizBox = document.getElementById(quizBoxId);
    if (!quizBox) {
      document.querySelector(".games-section").insertAdjacentHTML("beforeend", `<div id="${quizBoxId}" class="quiz-box"></div>`);
      quizBox = document.getElementById(quizBoxId);
    }
  
    quizBox.style.display = "block";
    quizIndex = 0;
    loadQuizQuestion();
  }
  
  function loadQuizQuestion() {
    const quizBox = document.getElementById("quiz-game");
    const qData = quizData[quizIndex];
  
    quizBox.innerHTML = `
      <div class="question">${qData.question}</div>
      <div class="options">
        ${qData.options
          .map(
            (option) => `<button class="option-btn" onclick="checkAnswer('${option}')">${option}</button>`
          )
          .join("")}
      </div>
    `;
  }
  
  function checkAnswer(selected) {
    const correct = quizData[quizIndex].answer;
    const result = selected === correct ? "✅ Correct!" : `❌ Incorrect! Correct answer: ${correct}`;
  
    const quizBox = document.getElementById("quiz-game");
    quizBox.innerHTML += `<p>${result}</p>`;
  
    quizIndex++;
    if (quizIndex < quizData.length) {
      setTimeout(loadQuizQuestion, 1500);
    } else {
      setTimeout(() => {
        quizBox.innerHTML += `<p>🎉 You finished the quiz!</p>`;
      }, 1500);
    }
  }
  