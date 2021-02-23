var a = document.querySelector(".option-form button");
a.addEventListener("click", answerButtonBuilder);
var counter = 0;
var active = false;
var score_timer = document.querySelector(".score");
var i = 59;
setInterval(() => {
    if(i >= 0 && active === true){
        score_timer.textContent = "Time: " + i;
        i--;
    }
}, 1000);

function answerButtonBuilder(event){
    active = true;
    var g = document.querySelector(".green");
    var r = document.querySelector(".red");
    event.preventDefault();
    if(!event.target.matches(".option")){
        if(counter%2 === 0) g.className = "red";
        else r.className = "green";
    }
    else{
        if(counter%2 === 0) event.target.className = "red";
        else event.target.className = "green";
    }
    counter++;
}