// Load questions.json into an array
var allQuestions = new Array();
var currentQuestion;

var correct_counter = 0;
var incorrect_counter = 0;

const audio_correct = new Audio("assets/correct.mp3")
const audio_incorrect = new Audio("assets/incorrect.mp3")
const secret_audio = new Audio("assets/secret_song.mp3")

function loadQuestions() {
    $.getJSON('questions.json', function (data) {
        allQuestions = data.questions;
    }).then(function () {
        nextQuestion();
    });
}

function scaleFontSize(element) {
    var container = document.getElementById(element);

    // Reset font-size to 100% to begin
    container.style.fontSize = "25px";

    // Check if the text is wider than its container,
    // if so then reduce font-size
    if (container.textContent.length > 200) {
        container.style.fontSize = "20";
    }

    if (container.textContent.length > 500) {
        container.style.fontSize = "15";
    }
}

function loadRandomQuestion() {
    var randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    return randomQuestion;
}

function updateCounters(correct, incorrect) {
    $('#counter_correct').html(correct);
    $('#counter_incorrect').html(incorrect);
}

function nextQuestion() {
    // Load the next question
    currentQuestion = loadRandomQuestion();

    // Update name and question counters
    $('#question_name').html(currentQuestion.name);
    updateCounters(correct_counter, incorrect_counter);

    // Scale font size to fit question name
    scaleFontSize("question_name")

    // Load the answers
    loadAnswers();
}

/*
function onAnswerButtonClick(answer) {
    // Check if the answer is correct by comparing index
    if (currentQuestion.answerIndex == $(this).attr('id').split('_')[1]) {
        // Correct answer
        correct_counter++;
        audio_correct.play();
    } else {
        // Incorrect answer
        incorrect_counter++;
        audio_incorrect.play();
    }

    // Update counters
    updateCounters(correct_counter, incorrect_counter);

    // Load the next question
    nextQuestion();
}
*/



function loadAnswers() {
    // Clear the answers
    $('#answers_container').empty();


    // Load the answers
    for (var i = 0; i < currentQuestion.answers.length; i++) {
        var answer = currentQuestion.answers[i];
        $('#answers_container').append('<a class="button" id="answer_' + i + '">' + answer.name + '</div>');

        // Add click event to answer
        $('#answer_' + i).click(function () {

            // Check if the answer is correct by comparing index
            if (currentQuestion.answerIndex == $(this).attr('id').split('_')[1]) {
                // Correct answer
                correct_counter++;
                //audio_correct.play();
                secret_audio.play();
            } else {
                // Incorrect answer
                incorrect_counter++;
                //audio_incorrect.play();
                secret_audio.play();
            }

            // Update counters
            updateCounters(correct_counter, incorrect_counter);

            // Load the next question
            nextQuestion();
        });
    }
}

// Load questions 
$(document).ready(function () {
    loadQuestions();
    
});









