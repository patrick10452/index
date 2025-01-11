// Import questions from separate files (must be at the top level)
import { autoQuestions } from './autoQuestions.js';
import { houseQuestions } from './houseQuestions.js';
import { commercialQuestions } from './commercialQuestions.js';

// Combine all questions into a single object
const questionSets = {
    auto: autoQuestions,
    house: houseQuestions,
    commercial: commercialQuestions,
    all: [...autoQuestions, ...houseQuestions, ...commercialQuestions] // Combine all questions for "All Insurance"
};

// Wait for the DOM to load before running the rest of the code
document.addEventListener('DOMContentLoaded', () => {
    // Quiz variables
    let currentQuestionIndex = 0;
    let score = 0;
    let totalQuestions = 0;
    let successfulAnswers = 0;
    let unsuccessfulAnswers = 0;
    let selectedQuestions = [];

    // DOM elements
    const menuContainer = document.getElementById('menu-container');
    const quizContainer = document.querySelector('.quiz-container');
    const questionContainer = document.getElementById('question-container');
    const nextButton = document.getElementById('next-btn');
    const resultContainer = document.getElementById('result-container');
    const progress = document.getElementById('progress');
    const exitButton = document.getElementById('exit-btn');
    const restartButton = document.getElementById('restart-btn');

    // Event listeners for menu buttons
    document.getElementById('auto-insurance-btn').addEventListener('click', () => startQuiz('auto'));
    document.getElementById('house-insurance-btn').addEventListener('click', () => startQuiz('house'));
    document.getElementById('commercial-insurance-btn').addEventListener('click', () => startQuiz('commercial'));
    document.getElementById('all-insurance-btn').addEventListener('click', () => startQuiz('all'));

    // Function to start the quiz based on the selected type
    function startQuiz(type) {
        console.log("Starting quiz for:", type); // Debug log
        selectedQuestions = questionSets[type]; // Set the selected questions
        totalQuestions = selectedQuestions.length; // Update total questions
        currentQuestionIndex = 0; // Reset question index
        score = 0; // Reset score
        successfulAnswers = 0; // Reset successful answers
        unsuccessfulAnswers = 0; // Reset unsuccessful answers

        // Hide the menu and show the quiz container
        menuContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        restartButton.style.display = 'block';
        exitButton.style.display = 'block';

        // Reset the result container and question container
        resultContainer.innerHTML = '';
        questionContainer.style.display = 'block';

        // Show the first question
        showQuestion(selectedQuestions[currentQuestionIndex]);
    }

    // Function to display the current question and its answers
    function showQuestion(question) {
        questionContainer.innerHTML = ''; // Clear previous content

        // Display the question
        const questionElement = document.createElement('div');
        questionElement.innerText = question.question;
        questionContainer.appendChild(questionElement);

        // Display the answer choices
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('answer-btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            questionContainer.appendChild(button);
        });

        // Update the progress counter
        progress.innerText = `Question ${currentQuestionIndex + 1}/${totalQuestions}`;
    }

    // Function to handle answer selection
    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';
        if (isCorrect) {
            score++;
            successfulAnswers++;
        } else {
            unsuccessfulAnswers++;
        }

        // Disable all buttons after selection
        Array.from(questionContainer.children).forEach(button => {
            if (button.tagName === 'BUTTON') {
                button.disabled = true;
                if (button.dataset.correct === 'true') {
                    button.style.backgroundColor = 'lightgreen';
                } else {
                    button.style.backgroundColor = 'salmon';
                }
            }
        });

        // Show the "Next" button
        nextButton.style.display = 'block';
    }

    // Function to move to the next question
    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < selectedQuestions.length) {
            showQuestion(selectedQuestions[currentQuestionIndex]);
            nextButton.style.display = 'none';
        } else {
            showResult();
        }
    }

    // Function to display the final result
    function showResult() {
        questionContainer.style.display = 'none';
        nextButton.style.display = 'none';
        const percentageScore = ((score / totalQuestions) * 100).toFixed(2);
        resultContainer.innerHTML = `
            <p>Total des questions: ${totalQuestions}</p>
            <p>Réponses réussies: ${successfulAnswers}</p>
            <p>Réponses non réussies: ${unsuccessfulAnswers}</p>
            <p>Score final: ${percentageScore}%</p>
        `;
    }

    // Restart button functionality
    restartButton.addEventListener('click', () => {
        // Reset all quiz variables
        currentQuestionIndex = 0;
        score = 0;
        successfulAnswers = 0;
        unsuccessfulAnswers = 0;
        selectedQuestions = [];

        // Clear the question and result containers
        questionContainer.innerHTML = '';
        resultContainer.innerHTML = '';

        // Hide the quiz container and show the menu
        quizContainer.style.display = 'none';
        restartButton.style.display = 'none';
        exitButton.style.display = 'none';
        menuContainer.style.display = 'block';
    });

    // Exit button functionality
    exitButton.addEventListener('click', () => {
        // Stop the quiz and show the results
        showResult();

        // Show the exit message
        alert("Merci d'avoir utilisé le quiz ! Vous pouvez maintenant fermer cet onglet ou cette fenêtre manuellement.");
    });

    // Event listener for the "Next" button
    nextButton.addEventListener('click', nextQuestion);
});