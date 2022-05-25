Quiz = function () {
    function begin() {
        // Get number of questions from input
        var questionAmount = $('#question_amount').val();
        var totalQuestions = Questions.getQuestions().length;

        if (questionAmount < 0 || questionAmount == '') {
            questionAmount = 1;
        }    
        else if (questionAmount > totalQuestions) {
            questionAmount = totalQuestions;
        }

        // Pick questionAmount random questions
        Questions.loadQuestions();
        for (var i = 0; i < questionAmount; i++) {
            Questions.pushRandomQuestion();
        }
        Questions.nextQuestion();

        // Display quiz
        $('#container_quiz').show();
        $('#container_menu').hide();
    }
    return {
        begin: begin
    }
}();

Questions = function () {
    var allQuestions = new Array();
    var randomQuestions = new Array();
    var questionCorrectRegister = new Array();
    var questionIncorrectRegister = new Array();
    
    function loadQuestions() {
        $.getJSON('questions.json', function (data) {
            allQuestions = data.questions;
        });
    };

    function loadRandomQuestion() {
        var randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        // remove the question from the array
        allQuestions.splice(allQuestions.indexOf(randomQuestion), 1);
        return randomQuestion;

    };
    function nextQuestion() {
        // Check if there are any questions left
        if (randomQuestions.length == CurrentQuestion.getIndex()) {
            // If there are no questions left, show the results
            showModal('Cuestionario finalizado', 'Has obtenido ' + Counters.getCorrectCounter() + ' preguntas correctas y ' + Counters.getIncorrectCounter() + ' preguntas incorrectas. <br> Tu nota es de un ' + Math.round((Counters.getCorrectCounter() / (Counters.getCorrectCounter() + Counters.getIncorrectCounter())) * 100) + '% <br> <br> Preguntas correctas: <br> ' + Questions.getCorrectRegister().join('<br>') + '<br> <br> Preguntas incorrectas: <br> ' + Questions.getIncorrectRegister().join('<br>'), 'Felicidades!');
            return;
        };

        // Load the next question
        CurrentQuestion.setCurrentQuestion(randomQuestions[CurrentQuestion.getIndex()]);
        CurrentQuestion.addIndex();
        // Update name and question counters
        $('#question_name').html(CurrentQuestion.getCurrentQuestion().name);
        Counters.updateCounters();

        // Load the answers
        Questions.loadAnswers();
    };
    function loadAnswers() {
        // Clear the answers
        $('#answers_container').empty();
        // Load the answers
        for (var i = 0; i < CurrentQuestion.getCurrentQuestion().answers.length; i++) {
            var answer = CurrentQuestion.getCurrentQuestion().answers[i];
            $('#answers_container').append('<button class="button" id="answer_' + i + '">' + answer.name + '</button>');

            // Add click event to answer
            $('#answer_' + i).click(function () {

                // Check if the answer is correct by comparing index
                if (CurrentQuestion.getCurrentQuestion().answerIndex == $(this).attr('id').split('_')[1]) {
                    // Correct answer
                    Counters.addCorrect();
                    questionCorrectRegister.push(CurrentQuestion.getCurrentQuestion().name);
                    Audio.playCorrect();
                } else {
                    // Incorrect answer
                    Counters.addIncorrect();
                    questionIncorrectRegister.push(CurrentQuestion.getCurrentQuestion().name);
                    Audio.playIncorrect();
                }

                // Update counters
                Counters.updateCounters();

                // Load the next question
                Questions.nextQuestion();
            });
        }
    }
    function getAllQuestions() {
        return allQuestions;
    }
    function getRandomQuestions() {
        return randomQuestions;
    }
    function setAllQuestions(questions) {
        allQuestions = questions;
    }

    function getCorrectRegister() {
        return questionCorrectRegister;
    }
    function getIncorrectRegister() {
        return questionIncorrectRegister;
    }
    function pushRandomQuestion() {
        randomQuestions.push(loadRandomQuestion());
    }

    return {
        loadQuestions: loadQuestions,
        loadRandomQuestion: loadRandomQuestion,
        nextQuestion: nextQuestion,
        loadAnswers: loadAnswers,
        getAllQuestions: getAllQuestions,
        getRandomQuestions: getRandomQuestions,
        setAllQuestions:setAllQuestions,
        getCorrectRegister: getCorrectRegister,
        getIncorrectRegister: getIncorrectRegister,
        pushRandomQuestion: pushRandomQuestion
    }
}();

CurrentQuestion = function () {
    var currentQuestionIndex = 0;
    var currentQuestion;

    function getCurrentQuestion() {
        return currentQuestion;
    }
    function addIndex(index) {
        currentQuestionIndex++;
    }
    function getIndex() {
        return currentQuestionIndex;
    }
    function setCurrentQuestion(question) {
        currentQuestion = question;
    }
    function setIndex(index) {
        currentQuestionIndex = index;
    }

    return {
        getCurrentQuestion: getCurrentQuestion,
        addIndex: addIndex,
        getIndex: getIndex,
        setCurrentQuestion: setCurrentQuestion,
        setIndex: setIndex
    }
}();

Counters = function () {
    var correct_counter = 0;
    var incorrect_counter = 0;
    function init() {
        correct_counter = 0;
        incorrect_counter = 0;
    }
    function addCorrect() {
        correct_counter++;
    }
    function addIncorrect() {
        incorrect_counter++;
    }

    function updateCounters() {
        $('#counter_correct').html(correct_counter);
        $('#counter_incorrect').html(incorrect_counter);
    }
    function getCorrectCounter() {
        return correct_counter;
    }
    function getIncorrectCounter() {
        return incorrect_counter;
    }
    function setCorrectCounter(counter) {
        correct_counter = counter;
    }
    function setIncorrectCounter(counter) {
        incorrect_counter = counter;
    }


    return {
        init: init,
        addCorrect: addCorrect,
        addIncorrect: addIncorrect,
        updateCounters: updateCounters,
        getCorrectCounter: getCorrectCounter,
        getIncorrectCounter: getIncorrectCounter,
        setCorrectCounter: setCorrectCounter,
        setIncorrectCounter: setIncorrectCounter
    }
}();

Audio = function () {
    const audio_correct = new Audio("assets/correct.mp3")
    const audio_incorrect = new Audio("assets/incorrect.mp3")
    const secret_audio = new Audio("assets/secret_song.mp3")

    function playCorrect() {
        audio_correct.play();
    }
    function playIncorrect() {
        audio_incorrect.play();
    }

    return {
        playCorrect: playCorrect,
        playIncorrect: playIncorrect
    }
}();

// Modals
function showModal(header, content, footer) {
    $('#modal-header-text').html(header);
    $('#modal-body-text').html(content);
    $('#modal-footer-text').html(footer);
    $('#myModal').show();

    // Add click event to close button
    $('#modal-header-close').click(function () {
        $('#myModal').hide();

        // Reset counters
        Counters.setCorrectCounter(0);
        Counters.setIncorrectCounter(0);

        // Reset question index
        CurrentQuestion.setIndex(0);

        // Show menu
        $('#container_menu').show();
        $('#container_quiz').hide();
    });
}

// Load questions 
$(document).ready(function () {
    Questions.loadQuestions();
});









