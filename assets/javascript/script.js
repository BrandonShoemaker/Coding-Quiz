var selectedAnswer = document.querySelector("#answer-catcher");
selectedAnswer.addEventListener("click", quizHandler);
var initialSubmit;
var questions = ["1+1", "3+2", "8*2"];
var answers = [["1", "2", "4", "3"],["5", "1", "3", "6"],["19", "29", "8", "16"]];
var correctAnswers = [2, 1, 4];
var currentQuestion = 0;
var active = false;
var scoreTimer = document.querySelector(".score");
var currentScore = 59;
var highScores = [];

var scoreKeeper = setInterval(() => {
    if(currentScore >= 0 && active){
        scoreTimer.textContent = "Time: " + currentScore;
        currentScore--;
    }
}, 1000);

function quizHandler(event){
    if(event.target.matches(".start-button")){
        event.stopPropagation();
        active = true;
        var formEl = document.querySelector(".option-form");
        var infoPEl = document.querySelector(".info");
        var quizContentContainerEl = document.querySelector(".quiz-container");
        quizContentContainerEl.className = "quiz-container";
        event.target.remove();
        infoPEl.remove();
        questionBuilder();
        answerBuilder(formEl);
        currentQuestion++;
    }
    if(event.target.matches(".option")){
        var formEl = document.querySelector(".option-form");
        var answerResult = document.createElement("div");
        answerResult.className = "answer-result";

        if(event.target.getAttribute("data-correct-answer") === "y"){
            answerResult.textContent = "Correct!";
        }
        else{
            answerResult.textContent = "Incorrect!";
            currentScore -= 10;
        }

        formEl.appendChild(answerResult);
        selectedAnswer.removeEventListener("click", quizHandler);
        setTimeout(() => {
            answerResult.remove();
            if(currentQuestion <= questions.length-1){
                answerDestroyer();
                questionBuilder();
                answerBuilder(formEl);
                currentQuestion++;
                selectedAnswer.addEventListener("click", quizHandler);
            }
            else{
                currentQuestion = 0;
                answerDestroyer();
                clearInterval(scoreKeeper);
                buildInitials(formEl);
            }
        }, 1500);
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
        answerButtonEl.className = "option button-class";
        if(correctAnswers[currentQuestion]-1 === i){
            answerButtonEl.setAttribute("data-correct-answer", "y");
        }
        else{
            answerButtonEl.setAttribute("data-correct-answer", "n");
        }
        answerButtonEl.type = "button";
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

function buildInitials(formEl){
    var questionH2El = document.querySelector("#question");
    questionH2El.textContent = "Quiz Completed!";

    var gameComleteContainerEl = document.createElement("div");
    gameComleteContainerEl.id = "input-catcher";

    var initialsInputEl = document.createElement("input");
    initialsInputEl.name = "initials";
    initialsInputEl.placeholder = "Your Initials Here...";
    initialsInputEl.type = "text";
    initialsInputEl.className = "initials";
    gameComleteContainerEl.appendChild(initialsInputEl);

    var gameComleteInfoEl = document.createElement("p");
    gameComleteInfoEl.className = "info";
    gameComleteInfoEl.style.fontSize = "1.5vw";
    gameComleteInfoEl.style.color = "var(--questionTextColor)";
    gameComleteInfoEl.innerHTML = "Your Score: "+ (currentScore + 1) +"<br>You've Finished the quiz! Please enter your initials below to save your score: ";

    var inputButtonEl = document.createElement("button");
    inputButtonEl.type = "button";
    inputButtonEl.textContent = "Submit";
    inputButtonEl.className = "input-button button-class";
    gameComleteContainerEl.appendChild(inputButtonEl);

    formEl.appendChild(gameComleteInfoEl);
    formEl.appendChild(gameComleteContainerEl);

    initialSubmit = document.querySelector("#input-catcher");
    initialSubmit.addEventListener("click", writeInitials);
}

function writeInitials(event){
    if(event.target.matches(".initials")) return;
    else if(event.target.matches("#input-catcher")) return;
    event.preventDefault();
    var highScoreEntry
    var highScore = {
        initial: document.querySelector(".initials").value,
        score: currentScore
    };
    highScores.push(highScore);

    highScore = {
        initial: "ff",
        score: 40
    };
    highScores.push(highScore);

    highScore = {
        initial: "ib",
        score: 10
    };
    highScores.push(highScore);

    setHighScore();
    getHighScore();
    document.querySelector(".input-button").remove();
    document.querySelector(".info").remove();
    document.querySelector(".initials").remove();
    var highScoreEl = document.querySelector("#input-catcher");
    var question = document.querySelector("#question");
    question.textContent = "HighScores:";

    highScoreSorter();
    for(var i = 0; i < highScores.length; i++){
        highScoreEntry = document.createElement("p");

        if(i%2 === 0) highScoreEntry.className = "highscore1";
        else highScoreEntry.className = "highscore2";

        highScoreEntry.textContent = (i+1) + ". " + highScores[i].initial + " - " + highScores[i].score; 
        highScoreEl.appendChild(highScoreEntry);  
    }
}

function setHighScore(){
    localStorage.setItem("highscores", JSON.stringify(highScores));
}

function getHighScore(){
    highScores = localStorage.getItem("highscores");
    if(!highScores){
        highScores = [];
        return;
    }
    else highScores = JSON.parse(highScores);
}

function clearHighScore(){
    getHighScore();
    highScores = [];
    setHighScore();

}

function highScoreSorter(){
    var current;
    debugger;
    for(var i = 0; i < highScores.length; i++){
        current = highScores[i];
        for(var j = i+1; j < highScores.length; j++){
            if(current.score < highScores[j].score){
                var tempName = highScores[j].initial;
                var tempScore = highScores[j].score;
                highScores[j].initial = current.initial;
                highScores[j].score = current.score;
                current.initial = tempName;
                current.score = tempScore;
            }
        }
    }

}