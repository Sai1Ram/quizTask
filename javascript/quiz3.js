let _question = document.getElementById("quiz-question");
let _options = document.querySelector(".quiz-optiongrp");
let _checkBtn = document.querySelector(".check-answer");
let _result = document.getElementById("result");
let nextButton = document.querySelector(".nextButton");
let _correctScore = document.getElementById("correct-score");
let _totalQuestion = document.getElementById("total-question");
let welcome = document.querySelector(".welcome");

let user_name = sessionStorage.getItem("name");
let correctAnswer = "",
  correctScore = (askedCount = 0),
  totalQuestion = 10;

async function loadQuestion() {
  const APIUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  result.innerHTML = "";
  showQuestion(data.results[0]);
}
function eventListeners() {
  _checkBtn.addEventListener("click", checkAnswer);
  //   _playAgainBtn.addEventListener("click", restartQuiz);
}

document.addEventListener("DOMContentLoaded", function () {
  loadQuestion();
  eventListeners();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});
function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );

  _question.innerHTML = `${data.question}  `;

  _options.innerHTML = `
          ${optionsList
            .map(
              (option, index) => `
              <li class="quiz-option"> ${
                index + 1
              }. <span>${option}</span> </li>
          `
            )
            .join("")}
      `;
  selectOption();
}

function selectOption() {
  _options.querySelectorAll("li").forEach(function (option) {
    option.addEventListener("click", function () {
      if (_options.querySelector(".active")) {
        const activeOption = _options.querySelector(".active");
        activeOption.classList.remove("active");
      }
      option.classList.add("active");
    });
  });
}
function checkAnswer() {
  _checkBtn.disabled = true;
  _result.style.display = "flex";
  if (_options.querySelector(".active")) {
    let selectedAnswer = _options.querySelector(".active span").textContent;
    if (selectedAnswer == HTMLDecode(correctAnswer)) {
      correctScore++;
      _result.innerHTML = `<p><i class="bi bi-check2"></i>Correct Answer!</p>`;
      _options.querySelector(".active").classList.add("right");
      _options.querySelector(".active").classList.remove("active");
    } else {
      _result.innerHTML = `<p><i class="bi bi-x-circle-fill"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
      _options.querySelector(".active").classList.add("wrong");
      _options.querySelector(".active").classList.remove("active");
    }
    checkCount();
    // console.log(correctAnswer);
  } else {
    _result.innerHTML = `<p><i class="bi bi-question-circle"></i>Please select an option!</p>`;
    _checkBtn.disabled = false;
  }
}
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
    //   setTimeout(function () {
    //     console.log("");
    //   }, 5000);

    _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;

    // _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
  }
}
function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

function submitForm(e) {
  e.preventDefault();
  let name = document.forms["welcome_forms"]["name"].value;
  //   store name
  sessionStorage.setItem("name", name);
  location.href = "quiz.html";
}
// time
let dt = new Date(new Date().setTime(0));
let time = dt.getTime();
let seconds = Math.floor((time % (100 * 60)) / 1000);
let minutes = Math.floor((time % (100 * 60 * 60)) / 1000);
setInterval(() => {
  if (seconds < 59) {
    seconds++;
  } else {
    minutes++;
    seconds = 0;
  }

  if (minutes < 10) {
    if (seconds < 10) {
      document.querySelector(".time").innerHTML =
        "0" + minutes + ":" + "0" + seconds;
    } else {
      document.querySelector(".time").innerHTML = "0" + minutes + ":" + seconds;
    }
  } else {
    document.querySelector(".time").innerHTML = `${minutes} :${seconds}`;
  }
}, 1000);
function nextQuestion() {
  askedCount++;
  if (askedCount >= totalQuestion - 1) {
    nextButton.innerHTML = "Score";
  }
  if (askedCount >= totalQuestion) {
    location.href = "end.html";
    sessionStorage.setItem("totalTimeMinutes", minutes);
    sessionStorage.setItem("totalTimeSeconds", seconds);
    sessionStorage.setItem("totalScore", correctScore);
  }
  _result.style.display = "none";
  setTimeout(function () {
    loadQuestion();
  }, 30);
}
welcome.innerHTML = `Welcome  ${user_name}!`;
//  end html
