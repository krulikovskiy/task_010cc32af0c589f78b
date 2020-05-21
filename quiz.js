console.log(data.quizcontent);
//for(var obj in data.quizcontent){console.log(data.quizcontent[obj].question);}

var lengthofobject = Object(data.quizcontent).length;
var curPage = 0,
    correct = 0;
var myAnswers = [];
var possibleAnswers = 4;
var rating = 0;
// FROM NIKITA
// Added a variable responsible for completing the test
var testСompleted = false;
var myHeader = document.getElementById("quizHeader");
var classname = document.getElementsByClassName("answer");
var myQuestion = document.getElementById("questions");
var progressBar = document.getElementById("progressBar");
var btnNext = document.getElementById("btnNext");
var btnPrevious = document.getElementById("btnPrevious");
var btnFinish = document.getElementById("finishQuiz");
checkPage();
btnNext.addEventListener("click", moveNext);
btnPrevious.addEventListener("click", moveBack);

// FROM-NIKITA
// Replaced the argument from endQuiz with finishTest
btnFinish.addEventListener("click", finishTest);

for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', myAnswer, false);
}

function myAnswer() {
    var idAnswer = this.getAttribute("data-id");
    /// check answer
    myAnswers[curPage] = idAnswer;
    if (data.quizcontent[curPage].correct == idAnswer) {
        //correct answer
    } else {
        //wrong answer
    }
    addBox();
}

function addBox() {
    for (var i = 0; i < myQuestion.children.length; i++) {
        var curNode = myQuestion.children[i];
        if (myAnswers[curPage] == (i + 1)) {
            curNode.classList.add("selAnswer");
        } else {
            curNode.classList.remove("selAnswer");
        }
    }
}

// FROM-NIKITA
// Added one function to complete the test. You need it to switch the testcompleted variable.
function finishTest() {
    if (myAnswers[(lengthofobject - 1)]) {
        var element = document.getElementById("ten-countdown");
        element.innerHTML = "Completed!";
        testСompleted = true;
        endQuiz();
    }
}

function moveNext() {
    ///check if an answer has been made
    if (myAnswers[curPage]) {
        //okay to proceed
        if (curPage < (lengthofobject - 1)) {
            curPage++;
            checkPage(curPage);
        } else {
            ///check if quiz is completed
            if (lengthofobject >= curPage) {
                finishTest();
            } else {
            }
        }
    } else {
        //console.log('not answered');
    }
}

function endQuiz() {
    // FROM-NIKITA:
    // I didn't understand why there was a check on myAnswers[(lengthofobject - 1)].
    // Because of it, the time lapse did not work, I removed it and everything is fine
    // if (myAnswers[(lengthofobject - 1)]) {
    var output = "<div class='output'><span class='title'>Резултат</span><br>";
    var questionResult = "NA";
    //console.log('Quiz Over');
    myAnswers.forEach(function (answer, i) {
        if (data.quizcontent[i].correct == myAnswers[i]) {
            questionResult = '<span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>';
            correct++;
        } else {
            questionResult = '<span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>';
        }
        output = output + '<p>Питање ' + (i + 1) + ' ' + questionResult + '</p> ';
    });

    output = output + '<p class="question-result">Имате ' + correct + ' од ' + lengthofobject + ' тачних одговора.</p> ';

    // FROM-NIKITA
    // Added percent calculation and evaluation check
    var score = correct / lengthofobject * 100

    if (score >= 85)
        rating = 5
    else if (score >= 70)
        rating = 4
    else if (score >= 55)
        rating = 3
    else if (score >= 40)
        rating = 2
    else
        rating = 1

    output = output + '<p>Your assessment: ' + rating + '</p></div>'
    document.getElementById("quizContent").innerHTML = output;
    // } else {
    // }
}

function checkPage(i) {
    /// add remove disabled buttons if there are no more questions in que
    if (curPage == 0) {
        btnPrevious.classList.add("hide");
    } else {
        btnPrevious.classList.remove("hide");
    }
    if ((curPage + 1) < (lengthofobject)) {
        btnNext.classList.remove("hide");
    } else {
        btnNext.classList.add("hide");
        btnFinish.classList.remove("hide");
    }
    myHeader.innerHTML = data.quizcontent[curPage].question;
    for (var i = 0; i < possibleAnswers; i++) {
        var curNode = myQuestion.children[i];
        console.log(data.quizcontent[curPage]["a" + (i + 1)]);
        curNode.childNodes[1].innerHTML = capitalise(data.quizcontent[curPage]["a" + (i + 1)]);
        //check if answered already
        if (myAnswers[curPage] == (i + 1)) {
            curNode.classList.add("selAnswer");
        } else {
            curNode.classList.remove("selAnswer");
        }
    }
    ///update progress bar
    var increment = Math.ceil((curPage) / (lengthofobject) * 100);
    progressBar.style.width = (increment) + '%';
    progressBar.innerHTML = (increment) + '%';
}

function moveBack() {
    if (curPage > 0) {
        curPage--;
        checkPage(curPage);
    } else {
        //console.log('end of quiz Page ' + curPage);
    }
}

function capitalise(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}


function countdown(elementName, minutes, seconds) {
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer() {
        msLeft = endTime - (+new Date);
        if (msLeft < 1000) {
            element.innerHTML = "Време је истекло!";
            endQuiz();

            // FROM-NIKITA
            // Added check for completion of the test. If testcompleted = true, the timer no longer works
        } else if (!testСompleted) {
            time = new Date(msLeft);
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());

            // FROM-NIKITA:
            // the setInterval function has been replaced with the setTimeout function.
            // setInterval-it works all the time, and because of this, thousands of timers were created.
            // And you need a recursive method via setTimeout.
            setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
            // setInterval(updateTimer, time.getUTCMilliseconds() + 500);
        }
    }

    element = document.getElementById(elementName);
    endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
    updateTimer();
}

countdown("ten-countdown", 10, 0);

