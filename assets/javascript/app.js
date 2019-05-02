class Game {
  questions;
  correctArray;
  incorrectArray;
  currentQuestion;
  questionInterval;
  timerRunning;
  timer;

  constructor() {
    this.reset();
    $("#start-container").css("display", "flex");
    $("#game-content").css("display", "none");
  }

  reset = () => {
    this.questions = [
      {
        question: "What is a Bezoar?",
        possibleAnswers: [
          "A sore from a bee sting.",
          "A stone from the stomach of a goat.",
          "A large bird.",
          "A delicious Armenian delicacy."
        ],
        correctAnswer: "A stone from the stomach of a goat.",
        userAnswer: ""
      },
      {
        question: "Where is Popocatepetl",
        possibleAnswers: ["Hawaii", "Mexico", "Peru", "Greenland"],
        correctAnswer: "Mexico",
        userAnswer: ""
      },
      {
        question: "Is Carrot Top funny?",
        possibleAnswers: ["no", "no", "no", "no"],
        correctAnswer: "no",
        userAnswer: ""
      },
      {
        question: "Who is Andrew Reynolds?",
        possibleAnswers: [
          "A surfer",
          "An actor",
          "A skateboarder",
          "Ryan Reynold's brother"
        ],
        correctAnswer: "A skateboarder",
        userAnswer: ""
      },
      {
        question: "What is a Santoku?",
        possibleAnswers: [
          "A knife",
          "A type of USB drive",
          "An item of clothing",
          "An IKEA bedframe"
        ],
        correctAnswer: "A knife",
        userAnswer: ""
      }
    ];
    this.correctArray = [];
    this.incorrectArray = [];
    this.timer = 10;
  };

  //pick a random question, and remove it from questions: []
  pickQuestion = () => {
    // console.log(this.questions);
    let index = Math.floor(Math.random() * this.questions.length);
    this.currentQuestion = this.questions[index];
    // console.log(this.currentQuestion);
    this.questions.splice(index, 1);
  };

  startGame = () => {
    this.reset();
    $(".start-button").css("display", "none");
    $("#start-container").css("display", "none");
    $("#end-game-container").css("display", "none");
    $("#game-content").css("display", "flex");
    this.startQuestion();
  };
  //begin a question
  startQuestion = () => {
    if (this.questions.length > 0) {
      this.pickQuestion();
      //   console.log("got outside of questions");
      this.displayQuestion();
      this.startQuestionTimer();
    } else {
      this.gameOver();
    }
  };

  //start question interval
  startQuestionTimer = () => {
    //clearInterval(this.questionInterval);
    // console.log("inside start question timer");
    this.timer = 10;
    this.displayTimer();
    clearInterval(this.questionInterval);
    this.questionInterval = setInterval(this.decrementTimer, 1000);
  };

  decrementTimer = () => {
    // console.log("decrement firing");
    if (this.timer > 0) {
      //   console.log(this.timer);
      this.timer--;
      this.displayTimer();
    } else {
      //   console.log("timer is zero");
      this.currentQuestion.userAnswer = "none";
      clearInterval(this.questionInterval);
      this.timeout();
    }
  };

  displayTimer = () => {
    $("#timer").html("Time Left: " + this.timer);
  };

  //display the question and its possible responses
  displayQuestion = () => {
    // console.log("inside display question");
    $("#question").text(this.currentQuestion.question);
    let answerList = $("<ul>");
    for (let item in this.currentQuestion.possibleAnswers) {
      let currentItem = this.currentQuestion.possibleAnswers[item];
      let answerItem = $("<div>");
      let answerCheckBox = $("<input>");
      let answerCheckMark = $("<span>");
      answerCheckMark.attr("class", "checkmark");

      answerCheckBox.attr("type", "checkbox");
      answerCheckBox.attr("class", "checkbox");
      answerCheckMark;
      answerCheckBox.val(currentItem);
      answerCheckMark.val(currentItem);

      answerItem.attr("class", "answer-item");
      answerItem.append(answerCheckBox);
      answerItem.append(answerCheckMark);
      answerItem.append(currentItem);

      answerList.append(answerItem);
    }
    $("#response-container").html(answerList);
  };

  //validate user guess
  guess = response => {
    if (response === this.currentQuestion.correctAnswer) {
      this.correctResponse();
    } else {
      this.inCorrectResponse(response);
    }
  };

  //display correct screen, then start next question
  correctResponse = () => {
    clearInterval(this.questionInterval);
    this.correctArray.push(this.currentQuestion);
    $("#game-content").css("display", "none");
    $("#success").html(
      "Correct! The correct answer was: <br>" +
        this.currentQuestion.correctAnswer
    );
    $("#success").css("display", "flex");
    setTimeout(() => {
      $("#game-content").css("display", "flex");
      $("#success").css("display", "none");
      this.startQuestion();
    }, 2000);
  };

  //display incorrect screen, then start next question
  inCorrectResponse = response => {
    clearInterval(this.questionInterval);
    this.currentQuestion.userAnswer = response;
    this.incorrectArray.push(this.currentQuestion);
    $("#game-content").css("display", "none");
    $("#fail").html(
      "Incorrect! The correct answer was: <br>" +
        this.currentQuestion.correctAnswer
    );
    $("#fail").css("display", "flex");
    setTimeout(() => {
      $("#game-content").css("display", "flex");
      $("#fail").css("display", "none");
      this.startQuestion();
    }, 2000);
  };

  //display question timeout screen, then start the next question
  timeout = () => {
    clearInterval(this.questionInterval);
    this.incorrectArray.push(this.currentQuestion);
    $("#game-content").css("display", "none");
    $("#fail").html(
      "Time's Up! The correct answer was: <br>" +
        this.currentQuestion.correctAnswer
    );
    $("#fail").css("display", "flex");
    setTimeout(() => {
      $("#game-content").css("display", "flex");
      $("#fail").css("display", "none");
      this.startQuestion();
    }, 2000);
  };

  //display the game over screen
  gameOver = () => {
    clearInterval(this.questionInterval);
    $("#game-content").css("display", "none");
    $("#start-game-container").css("display", "none");
    $("#end-game-container").css("display", "flex");
    $(".start-button").css("display", "flex");
    this.displayCorrectAnswers();
    this.displayIncorrectAnswers();
  };

  displayCorrectAnswers = () => {
    $("#correct").html("Correct Answers: " + this.correctArray.length);
  };

  displayIncorrectAnswers = () => {
    $("#incorrect").html("Incorrect Answers: " + this.incorrectArray.length);
    let details = $("#incorrect-details-container");
    details.html("");

    for (let item = 0; item < this.incorrectArray.length; item++) {
      let question = this.incorrectArray[item];
      let detail = $("<div>");
      let questionNum = item + 1;
      detail.append("<h4>Question " + questionNum + ":</h4>");
      detail.append(question.question);
      detail.append("<h4>Your Answer:</h4>");
      detail.append(question.userAnswer);
      detail.append("<h4>Correct Answer:</h4>");
      detail.append(question.correctAnswer);
      detail.attr("class", "incorrect-detail");
      details.append(detail);
    }
  };
}

$(document).ready(() => {
  let game = new Game();
  $(document).on("click", ".checkmark", function(event) {
    let response = $(this).val();
    game.guess(response);
  });

  $(document).on("click", ".start-button", function(event) {
    game.startGame();
  });
});
