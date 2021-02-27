// selects and adds event listeners for both main quiz wrapper and scoreboard shortcut wrapper
var selectedAnswer = document.querySelector("#answer-catcher");
selectedAnswer.addEventListener("click", quizHandler);
var scoreboard = document.querySelector(".score-wrapper");
scoreboard.addEventListener("click", prepareForScoreboard);

// beginning globals, global for sake of reduced clutter and accessibility
var initialSubmit;
// array of questions
var questions = ["1+1", "3+2", "8*2", "2+2", "1*3"];
// array of answers
var answers = [["1", "2", "4", "3"],["5", "1", "3", "6"],["19", "29", "8", "16"], ["3", "6", "7", "4"], ["1", "4", "3", "7"]];
// array of correct answer indexes
var correctAnswers = [1, 0, 3, 3, 2];
// keeps track of what question youre on after each answer
var currentQuestion = 0;
// tells timer to start when start quiz button pressed
var active = false;
// selects element that displays leftover time
var scoreTimer = document.querySelector(".score");
// time/score
var currentScore = 59;
// keeps track of all highscores
var highScores = [];
// timer
var scoreKeeper = setInterval(() => {
    // if the quiz has started and the time isn't zero, print the new time then decrement score
    if(active){
        scoreTimer.textContent = "Time: " + currentScore;
        if(currentScore > 0){
            currentScore--;
        }
        // if time is 0 kill quiz and move on
        else if(currentScore === 0){
            // selects the form element where buttons and inputs are
            var formEl = document.querySelector(".option-form");
            // destroys all answers
            answerDestroyer();
            // stops timer
            clearInterval(scoreKeeper);
            // begins scorekeeping
            buildInitials(formEl);
        }
    }
}, 1000);

// main quiz function
function quizHandler(event){
    // if not any desired button, do nothing
    if(event.target.matches("#answer-catcher"))return
    // start quiz button
    else if(event.target.matches(".start-button")){
        // stops correct button from rerunning this function through bubbling
        event.stopPropagation();
        // starts timer
        active = true;
        // gathers important elements
        var formEl = document.querySelector(".option-form");
        var infoPEl = document.querySelector(".info");
        var quizContentContainerEl = document.querySelector(".quiz-container");
        // gets rid of default center text alignment
        quizContentContainerEl.className = "quiz-container";
        // gets rid of start quiz button
        event.target.remove();
        // gets rid of info section
        infoPEl.remove();
        // jumps to functions later defined, primes question and builds answers
        questionBuilder();
        answerBuilder(formEl);
        // progresses to next question
        currentQuestion++;
    }
    // every other button up to finish after the first start quiz button
    else if(event.target.matches(".option")){
        // gathers form elements
        var formEl = document.querySelector(".option-form");
        // makes a new div to display if your answer was correct or not
        var answerResult = document.createElement("div");
        // class assignment to that new div
        answerResult.className = "answer-result";

        // checks if answers custom data is set to the correct answer value
        if(event.target.getAttribute("data-correct-answer") === "y"){
            // answer result
            answerResult.textContent = "Correct!";
        }
        else{
            answerResult.textContent = "Incorrect!";
            // punishes user for inability to answer correctly deducts time. If overdflowing 0, correct to 0
            if((currentScore - 10) < 0) currentScore = 0;
            else currentScore -= 10;
        }

        // displays the message
        formEl.appendChild(answerResult);
        // disallows user to interact with the answers for 1.5 seconds for clean looking transitions
        selectedAnswer.removeEventListener("click", quizHandler);
        setTimeout(() => {
            // after 1.5 seconds remove the message
            answerResult.remove();
            // if current question is within the number of questions
            if(currentQuestion < questions.length){
                // kills answers
                answerDestroyer();
                // rewrites question
                questionBuilder();
                //builds new answer set
                answerBuilder(formEl);
                // increments current question
                currentQuestion++;
                // adds the event listener back to continue quiz
                selectedAnswer.addEventListener("click", quizHandler);
            }
            // if all questions exhausted
            else{
                currentQuestion--;
                // kill answers
                answerDestroyer();
                // stop timer
                clearInterval(scoreKeeper);
                // start initials section
                buildInitials(formEl);
            }
        }, 1500);
    }
}

function questionBuilder(){
    // rewrites question
    var questionH2El = document.querySelector("#question");
    questionH2El.textContent = questions[currentQuestion];
}

function answerBuilder(formEl){
    var answerButtonEl;
    // for as many answers are present in answers array for this question
    for(var i = 0; i < answers[currentQuestion].length; i++){
        // create a button
        answerButtonEl = document.createElement("button");
        // assign it classes
        answerButtonEl.className = "option button-class";
        // if the answer index matches the correct answer index for this quesiton
        if(correctAnswers[currentQuestion] === i){
            // assign unique data to tell this answer is corrext
            answerButtonEl.setAttribute("data-correct-answer", "y");
        }
        else{
            // assign unique data to tell this answer is incorrect
            answerButtonEl.setAttribute("data-correct-answer", "n");
        }
        // prevents page reloading
        answerButtonEl.type = "button";
        // assigns unique data for destruction
        answerButtonEl.setAttribute("data-id", i);
        // assigns content from answers
        answerButtonEl.textContent = answers[currentQuestion][i];
        // adds element
        formEl.appendChild(answerButtonEl);
    }
}

function answerDestroyer(){
    var buttonsEl;
    // kills all answers based on their id's
    for(var i = 0; i < answers[currentQuestion].length; i++){
        buttonsEl = document.querySelector(".option[data-id='"+ i +"']");
        buttonsEl.remove();
    }
}

function buildInitials(formEl){
    // tells user the quiz is finished
    var questionH2El = document.querySelector("#question");
    questionH2El.textContent = "Quiz Completed!";

    // creates div element for catching intials input
    var gameComleteContainerEl = document.createElement("div");
    gameComleteContainerEl.id = "input-catcher";

    // creates input element with name, placeholder text, its type, amd classname then adds
    var initialsInputEl = document.createElement("input");
    initialsInputEl.name = "initials";
    initialsInputEl.placeholder = "Your Initials Here...";
    initialsInputEl.type = "text";
    initialsInputEl.className = "initials";
    gameComleteContainerEl.appendChild(initialsInputEl);

    // creates p element to describe what happened and displays your score
    var gameComleteInfoEl = document.createElement("p");
    gameComleteInfoEl.className = "info";
    // assigns a color unique to this p element
    gameComleteInfoEl.style.color = "var(--questionTextColor)";
    // corrects timer
    if(currentScore != 0) currentScore += 1;
    // score display
    gameComleteInfoEl.innerHTML = "Your Score: "+ currentScore +"<br>You've Finished the quiz! Please enter your initials below to save your score: ";

    // creates submit button to save highscore
    var inputButtonEl = document.createElement("button");
    inputButtonEl.type = "button";
    inputButtonEl.textContent = "Submit";
    inputButtonEl.className = "input-button button-class";
    gameComleteContainerEl.appendChild(inputButtonEl);

    // adds new div wrapper and p tag to form element
    formEl.appendChild(gameComleteInfoEl);
    formEl.appendChild(gameComleteContainerEl);

    // adds listener
    initialSubmit = document.querySelector("#input-catcher");
    initialSubmit.addEventListener("click", writeInitials);
}

function writeInitials(event){
    // if not desired button do nothing
    if(event.target.matches(".initials")) return;
    if(!document.querySelector(".initials").value || document.querySelector(".initials").value.length < 2){
        window.alert("You must enter at least 2 digits for your initials!")
        return;
    }
    else if(event.target.matches("#input-catcher")) return;
    event.preventDefault();
    // creates object for scores
    var highScore = {
        // captures input for initials
        initial: document.querySelector(".initials").value,
        score: currentScore
    };
    // adds to highscores
    highScores.push(highScore);

    // sets scores to localstorage
    setHighScore();
    // kills initials page
    document.querySelector(".input-button").remove();
    document.querySelector(".info").remove();
    document.querySelector(".initials").remove();
    buildScoreboard();
}

// main hub for creating scoreboard, namely for the scoreboard shortcut button on top left of page
function prepareForScoreboard(event){
    // if not scoreboard shortcut element do nothing
    if(!event.target.matches(".scoreboard")) return;
    else if(event.target.matches(".scoreboard")){
        // if when pressed there currently exists the input catcher div element and p info element, return
        if(document.querySelector("#input-catcher") && document.querySelector(".info")) return;
        // same as above but without p
        else if(document.querySelector("#input-catcher") && !document.querySelector(".info")) return;

        // if none of the above, prep for scoreboard
        // create div element for containment
        var formEl = document.querySelector(".option-form");
        var createInputCatcher = document.createElement("div");
        createInputCatcher.id = "input-catcher";
        formEl.appendChild(createInputCatcher);

        // if on the start page
        if(document.querySelector(".start-button")){
            // eliminate default text-centered element
            document.querySelector(".quiz-container").className = "quiz-container";
            // remove p element and start button
            document.querySelector(".start-button").remove();
            document.querySelector(".info").remove();
            // stop current timer to avoid overlapping timers
            clearInterval(scoreKeeper);
            // begin building scoreboard
            buildScoreboard();
        }
        // if inside quiz
        else{
            // kill answers
            answerDestroyer();
            // stop timer
            clearInterval(scoreKeeper);
            // begin building scoreboard
            buildScoreboard();
        }
    }
}

function buildScoreboard(){
    var highScoreEntry;
    // retrieves loacalstorage for highscores
    getHighScore();

    // removes old event listener for div wrapper and adds new listener for proper handling
    var highScoreEl = document.querySelector("#input-catcher");
    highScoreEl.removeEventListener("click", writeInitials);
    highScoreEl.addEventListener("click", scoreBoardHandler);

    // re-writes question to fit highscore
    var question = document.querySelector("#question");
    question.textContent = "HighScores:";

    // sorts the highscores from highest scores to lowest
    highScoreSorter();
    // for as many highscores as there are
    for(var i = 0; i < highScores.length; i++){
        // creat a p element
        highScoreEntry = document.createElement("p");

        // if index is an even number assign one classname if odd assign another
        if(i%2 === 0) highScoreEntry.className = "highscore1";
        else highScoreEntry.className = "highscore2";

        // assigns scores
        highScoreEntry.textContent = (i+1) + ". " + highScores[i].initial + " - " + highScores[i].score;
        // sets unique data for deletion later
        highScoreEntry.setAttribute("data-score-id", i); 
        highScoreEl.appendChild(highScoreEntry);
    }
    // creates a button to reset the quiz
    var goBackEl = document.createElement("button");
    goBackEl.type = "button";
    goBackEl.textContent = "Go Back";
    goBackEl.className = "go-back-button button-class";

    // create a button to reset the highscores to empty
    var clearScoreEl = document.createElement("button");
    clearScoreEl.type = "button";
    clearScoreEl.textContent = "Clear Scores";
    clearScoreEl.className = "clear-score-button button-class";

    // adds buttons
    highScoreEl.appendChild(goBackEl);
    highScoreEl.appendChild(clearScoreEl);
}

function scoreBoardHandler(event){
    var scoreboardEl = document.querySelector("#input-catcher");
    // if not one of the buttons, do nothing
    if(event.target.matches("#input-catcher")) return;
    // if clearing score
    else if(event.target.matches(".clear-score-button")) {
        // deletes each entry
        for(var i = 0; i < highScores.length; i++){
            if(document.querySelector(".highscore1[data-score-id='"+i+"']")) document.querySelector(".highscore1[data-score-id='"+i+"']").remove();
            else if(document.querySelector(".highscore2[data-score-id='"+i+"']")) document.querySelector(".highscore2[data-score-id='"+i+"']").remove();
        }
        // clears highscores by setting it empty
        clearHighScore();
    }
    // if the go back button
    else{
        // remove the listener on div from initials
        scoreboardEl.removeEventListener("click", scoreBoardHandler);
        // kill said div
        scoreboardEl.remove();

        // re-creates the p element from starting page
        var formEl = document.querySelector(".option-form");
        var introEl = document.createElement("p");
        introEl.textContent = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum iure cupiditate distinctio sunt deleniti aperiam corrupti officiis atque quisquam quas quia libero labore dolore maxime itaque, assumenda non ad! Eum!";
        introEl.className = "info";

        // re-creates the start-quiz button from start
        var startQuizButtonEl = document.createElement("button");
        startQuizButtonEl.type = "button";
        startQuizButtonEl.textContent = "Start Quiz!";
        startQuizButtonEl.className = "start-button button-class"
        
        // re-defines question to be a normal title
        document.querySelector("#question").textContent = "Coding Challenge Quiz";

        // adds p and button
        formEl.appendChild(introEl);
        formEl.appendChild(startQuizButtonEl);

        // restores default text centered class to main wrapper
        document.querySelector(".quiz-container").className = "quiz-container text-centered";
        selectedAnswer.addEventListener("click", quizHandler);

        // resets timer to default
        document.querySelector(".score").textContent = "Time: 60";

        // restarts the curent question, score, and activation
        currentQuestion = 0;
        currentScore = 59;
        active = false;
        // restarts the timer
        scoreKeeper = setInterval(() => {
            if(active){
                scoreTimer.textContent = "Time: " + currentScore;
                if(currentScore > 0){
                    currentScore--;
                }
                else if(currentScore === 0){
                    var formEl = document.querySelector(".option-form");
                    answerDestroyer();
                    clearInterval(scoreKeeper);
                    buildInitials(formEl);
                }
            }
        }, 1000);
    }
}

function setHighScore(){
    // stores highscores
    localStorage.setItem("highscores", JSON.stringify(highScores));
}

function getHighScore(){
    // retrieves highscores
    highScores = localStorage.getItem("highscores");
    // if null return after resetting to empty array
    if(!highScores){
        highScores = [];
        return;
    }
    // otherwise parse highscore object
    else highScores = JSON.parse(highScores);
}

function clearHighScore(){
    // retrives current highscores
    getHighScore();
    // resets highscores to empty
    highScores = [];
    // stores empty array
    setHighScore();

}

// selection sort
function highScoreSorter(){
    var current;
    for(var i = 0; i < highScores.length; i++){
        // pivot point
        current = highScores[i];
        // compare every value after the pivot to pivot
        for(var j = i+1; j < highScores.length; j++){
            // checks to see if the pivot is the lower value, if it is, swap them to give pivot higher value, greatest to least sort
            if(current.score < highScores[j].score){
                // had to do individual variables because if I made temp = current, then made current = pivot, it would replace temp and would be = to pivot, no idea why
                // Maybe object declarations and instantiations just act differntly
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