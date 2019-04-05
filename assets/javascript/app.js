"use strict"

// App goes here
const GAME_SPACE = $("#game_space");
const TIMER_SPACE = $("#timer_space");

/************************************************
   Data
 ************************************************/
const MY_QUESTIONS = [
  {
    question: "JavaScript is also known as...?",
    answers: ["ECMAScript", "Java", "jQuery", "Big Pharma"],
    index_correct: 0,
    question_image: "",
    answer_images: [], // Should match indices of answer choices
  },
  {
    question: "Who was the original designer of JavaScript?",
    answers: ["Alan Turing", "Brendan Eich", "Elon Musk", "Barack Obama"],
    index_correct: 1,
    question_image: "",
    answer_images: [], // Should match indices of answer choices
  },
  {
    question: "Which programming language below best exemplifies the style of 'Functional Programming'?",
    answers: ["C", "Java", "Haskell", "CSS"],
    index_correct: 2,
    question_image: "",
    answer_images: [], // Should match indices of answer choices
  },
]

/************************************************
   Game Logic
 ************************************************/
let game_state = {
  total_questions: MY_QUESTIONS.length,
  current_question: 0,
  correct_questions: 0,
}

let counter = 0;
let c; // Our clock
const TIME_LIMIT = 5; // 5 seconds per question; can be adjusted later

$(document).ready( () => {
  reset(); // Sets some starting text and stuff
});

const START_MESSAGE = "Press 'Start' to begin.";
const TIMER_EMPTY_MESSAGE = "(Timer goes here)";

// Main entry point into the game
function main() {
  GAME_SPACE.text(START_MESSAGE)
  quiz(0);
}

function quiz(question_index) {
  /* Quiz function begins at question index passed as argument */

  if (c !== undefined) {
    clearInterval(c);
  }

  // Check if game should be over
  if (game_state.current_question < (game_state.total_questions)) {
    // Reset variable used for counting time
    counter = 0; 

    // setInterval() used to count seconds...
    c = setInterval(() => {
      TIMER_SPACE.text(`Time remaining: ${TIME_LIMIT - counter}`)
      counter++;

      showQuestion(question_index);

      if (counter > TIME_LIMIT) {
        // Time is up!
        TIMER_SPACE.text('asdfjk;!!!!');

        // Advance to next question
        game_state.current_question++;
        quiz(game_state.current_question);
      };
    }, 1000);
  } else {
    gameOver();
  }
}

function showQuestion(index) {
  /* Index refers to MY_QUESTIONS */
  let questionNode = $('<div></div>')

  let questionText = $('<p></p>');
  questionText.text(MY_QUESTIONS[index].question);
  questionNode.append(questionText);

  MY_QUESTIONS[index].answers.map((val, ind) => {
    // Add the appropriate nodes...
    let answerButton = $('<button></button>');
    answerButton.text(val);
    answerButton.on('click', () => {
      questionAnswerHandler(index, ind); // question index, answer index
    }); 
    questionNode.append(answerButton);
  });

  GAME_SPACE.empty(); // First clear stuff that's already there
  GAME_SPACE.append(questionNode); // and then add the new stuff
}

function questionAnswerHandler(questionIndex, answerIndex) {
  GAME_SPACE.empty(); // Clear just in case there is stuff
  let wasCorrect = false;

  if(answerIndex === MY_QUESTIONS[questionIndex].index_correct) {
    wasCorrect = true;
    let correctMessage = $('<p></p>');
    correctMessage.text('Spot on!');
    GAME_SPACE.append(correctMessage);
    game_state.correct_questions++; // Add a correct response!
  } else {
    let incorrectMessage = $('<p></p>');
    incorrectMessage.text("Oh dear... you guessed incorrectly");
    GAME_SPACE.append(incorrectMessage);
  }

  clearInterval(c); // Stop timer...

  let rightAnswer = $('<p></p>');
  rightAnswer.html("<p>The correct answer was <b>" + 
    MY_QUESTIONS[questionIndex]
      .answers[MY_QUESTIONS[questionIndex].index_correct] +
    "</b>.<p>");
  GAME_SPACE.append(rightAnswer);

  game_state.current_question++; // Next question...
  quiz(game_state.current_question);

}

function gameOver() {
  TIMER_SPACE.text(TIMER_EMPTY_MESSAGE); // Don't display anything in the timer area
  GAME_SPACE.empty();
  let gameOverText = $('<div></div>');
  gameOverText.append('<h2>Game Over!</h2>');
  gameOverText.append("You got a total of " 
    + game_state.correct_questions
    + " out of " 
    + game_state.total_questions 
    + " correct answers.");
  
  gameOverText.append("<h3>Questions and (Correct) Answers</h3>");
  let q_and_a = $('<ul></ul>');
  MY_QUESTIONS.map((val, ind) => {
    q_and_a.append( $('<li></li>')
      .html(val.question + ' <b>'
        + val.answers[val.index_correct] + '</b>'));
  });
  gameOverText.append(q_and_a);

  GAME_SPACE.append(gameOverText);
}

// Reset to the starting state
function reset() {
  // Clear interval if clock is running
  if (c !== undefined) {
    clearInterval(c);
  }

  game_state.current_question = 0;  // Reset position in game
  game_state.correct_questions = 0; // Reset score

  TIMER_SPACE.text(TIMER_EMPTY_MESSAGE);
  GAME_SPACE.text(START_MESSAGE);
}