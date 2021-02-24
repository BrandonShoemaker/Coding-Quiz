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
var score = 59;

var scoreKeeper = setInterval(() => {
    if(score >= 0 && active){
        scoreTimer.textContent = "Time: " + score;
        score--;
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
    currentQuestion++;
}

function quizHandler(event){
    event.preventDefault();
    var formEl = document.querySelector(".option-form");
    var answerResult = document.createElement("div");
    answerResult.className = "answer-result";

    if(event.target.getAttribute("data-correct-answer") === "y"){
        answerResult.textContent = "Correct!";
    }
    else{
        answerResult.textContent = "Incorrect!";
    }

    formEl.appendChild(answerResult);
    setTimeout(() => {
        answerResult.remove();
        answerDestroyer();
        questionBuilder();
        answerBuilder(formEl);
    }, 1500);

    if(currentQuestion !== questions.length-1) currentQuestion++;
    else{
        answerDestroyer();
        clearInterval(scoreKeeper);
        
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
        }
        else{
            answerButtonEl.setAttribute("data-correct-answer", "n");
        }
        answerButtonEl.setAttribute("data-id", i);
        answerButtonEl.textContent = answers[currentQuestion][i];
        formEl.appendChild(answerButtonEl);
    }
}

function answerDestroyer(){
    var buttonsEl;
    for(var i = 0; i <= questions.length; i++){
        buttonsEl = document.querySelector(".option[data-id='"+ i +"']");
        buttonsEl.remove();
    }
}