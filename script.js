// Load questions.json into an array
var allQuestions = new Array();
var randomQuestions = new Array();

var currentQuestionIndex = 0;
var currentQuestion;

var correct_counter = 0;
var incorrect_counter = 0;

const audio_correct = new Audio("assets/correct.mp3")
const audio_incorrect = new Audio("assets/incorrect.mp3")
const secret_audio = new Audio("assets/secret_song.mp3")

function loadQuestions() {
    $.getJSON('questions.json', function (data) {
        allQuestions = data.questions;
    })
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
    // remove the question from the array
    allQuestions.splice(allQuestions.indexOf(randomQuestion), 1);
    return randomQuestion;
}



function updateCounters(correct, incorrect) {
    $('#counter_correct').html(correct);
    $('#counter_incorrect').html(incorrect);
}

function nextQuestion() {
    // Check if there are any questions left
    if (randomQuestions.length == currentQuestionIndex) {
        // If there are no questions left, show the results
        showModal('Has obtenido ' + correct_counter + ' preguntas correctas y ' + incorrect_counter + ' preguntas incorrectas. <br> Tu nota es de un ' + Math.round((correct_counter / (correct_counter + incorrect_counter)) * 100) + '%');
        return;
    }
    
    // Load the next question
    currentQuestion = randomQuestions[currentQuestionIndex++];
    console.log(currentQuestionIndex)

    // Update name and question counters
    $('#question_name').html(currentQuestion.name);
    updateCounters(correct_counter, incorrect_counter);

    // Scale font size to fit question name
    scaleFontSize("question_name")

    // Load the answers
    loadAnswers();
}

function showModal(message) {
    $('#modal-text').html(message);
    $('#myModal').show();

    // Add click event to close button
    $('#modal-close').click(function () {
        $('#myModal').hide();

        // Reset counters
        correct_counter = 0;
        incorrect_counter = 0;

        // Reset question index
        currentQuestionIndex = 0;

        // Show menu
        $('#container_menu').show();
        $('#container_quiz').hide();
    });
}

function beginQuiz() {
    // Get number of questions from input
    var questionAmount = $('#question_amount').val();

    // Pick questionAmount random questions
    randomQuestions = new Array();
    for (var i = 0; i < questionAmount; i++) {
        randomQuestions.push(loadRandomQuestion());
    }

    nextQuestion();

    // Display quiz
    $('#container_quiz').show();
    $('#container_menu').hide();
}



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
        });
    }
}

// Load questions 
$(document).ready(function () {
    loadQuestions();
    
});









