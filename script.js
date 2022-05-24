// Load questions.json into an array
var allQuestions = new Array();
var currentQuestion;

var correct_counter = 0;
var incorrect_counter = 0;

function loadQuestions() {
    $.getJSON('questions.json', function (data) {
        allQuestions = data.questions;
    }).then(function () {
        nextQuestion();
    });
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
    $('#question_name').html(currentQuestion.name);
    updateCounters(correct_counter, incorrect_counter);
}

// Make answer buttons clickable
$(document).ready(function () {
    $('#true_button').click(function () {
        if (currentQuestion.answer == "true") {
            correct_counter++;
        } else {
            incorrect_counter++;
        }

        nextQuestion();
    });

    $('#false_button').click(function () {
        if (currentQuestion.answer == "false") {
            correct_counter++;
        } else {
            incorrect_counter++;
        }

        nextQuestion();
    });

    loadQuestions();
});







