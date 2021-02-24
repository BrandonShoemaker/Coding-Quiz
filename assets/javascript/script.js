var startQuizEl = document.querySelector(".start-button");
startQuizEl.addEventListener("click", activateQuiz);
var selectedAnswer = document.querySelector("#answer-catcher");
selectedAnswer.addEventListener("click", quizHandler);
var questions = ["1+1", "3+2", "8*2"];
var answers = [["1", "2", "4", "3"],["5", "1", "3", "6"],["19", "29", "8", "16"]];
var correctAnswers = [2, 1, 4];
var currentQuestion = 0;
var active = false;
var scoreTimer = document.querySelector(".score");
var timer = 59;

setInterval(() => {
    if(timer >= 0 && active === true){
        scoreTimer.textContent = "Time: " + timer;
        timer--;
    }
}, 1000);

function activateQuiz(event){
    event.stopPropagation();
    event.preventDefault();
    active = true;
    var formEl = document.querySelector(".option-form");
    var infoPEl = document.querySelector(".info");
    var quizContentContainerEl = document.querySelector(".quiz-container");
    quizContentContainerEl.className = "quiz-container";
    startQuizEl.remove();
    infoPEl.remove();
    questionBuilder();
    answerBuilder(formEl);
}

function quizHandler(event){
    event.preventDefault();
    var formEl = document.querySelector(".option-form");
    if(event.target.getAttribute("data-correct-answer") === "y"){
        console.log("Correct");
    }
    else{
        console.log("Incorrect")
    }
}

function questionBuilder(){
    var questionH2El = document.querySelector("#question");
    questionH2El.textContent = questions[currentQuestion];
}

function answerBuilder(formEl){
    var answerButtonEl;
    for(var i = 0; i < answers[currentQuestion].length; i++){
        answerButtonEl = document.createElement("button");
        answerButtonEl.className = "option";
        if(correctAnswers[currentQuestion]-1 === i){
            answerButtonEl.setAttribute("data-correct-answer", "y");
            answerButtonEl.textContent = answers[currentQuestion][i];
        }
        else{
            answerButtonEl.setAttribute("data-correct-answer", "n");
            answerButtonEl.textContent = answers[currentQuestion][i];
        }
        formEl.appendChild(answerButtonEl);
    }
}