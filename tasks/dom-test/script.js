

var questions = [
  {
    text: "А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.",
    answers: ["Пол деревни, за раз", "Полдеревни, зараз", "Пол-деревни, за раз"],
    correct: [1],
    more: "Правильно! Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз (ударение на второй слог) — это обстоятельственное наречие, пишется слитно. Означает быстро, одним махом."
  },
  {
    text: "А эти слова как пишутся?",
    answers: ["Капуччино и эспрессо", "Каппуччино и экспресо", "Капучино и эспрессо"],
    correct: [2],
    more: "Конечно! По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо»."
  },
  {
    text: "Как нужно писать?",
    answers: ["Черезчур", "Черес-чур", "Чересчур"],
    correct: [2],
    more: "Да! Это слово появилось от соединения предлога «через» и древнего слова «чур», которое означает «граница», «край». Но слово претерпело изменения, так что правильное написание учим наизусть — «чересчур»."
  },
  {
    text: "Где допущена ошибка?",
    answers: ["Аккордеон", "Белиберда", "Эпелепсия"],
    correct: [2],
    more: "Верно! Это слово пишется так: «эпИлепсия»."
  },
  {
    text: "В каких предложениях слово «одевать» употреблено правильно с точки зрения литературной нормы?",
    answers: [
      "Мама одевает ребёнка перед прогулкой.",
      "Он одевает пальто и выходит на улицу.",
      "Стилист одевает клиента перед фотосессией.",
      "Она одевает шапку и бежит на работу."
    ],
    correct: [0, 2],   
    more: "Правильно. Глагол «одевать» — переходный: он употребляется, когда кто-то одевает кого-то другого (ребёнка, клиента)."
  }
];


var PAUSE = 2;
var STEP = 0.3;
var HOLD = 2;
var LEAVE = 0.8;


var askBtn = document.getElementById("ask");
var restartBtn = document.getElementById("restart");
var board = document.getElementById("board");
var statusBox = document.getElementById("status");
var score = document.getElementById("score");


var queue = questions.slice();
var rightCount = 0;
var doneCount = 0;
var waiting = false;
var finished = false;


function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}


function isRight(question, n) {
  for (var i = 0; i < question.correct.length; i++) {
    if (question.correct[i] === n) return true;
  }
  return false;
}

function showQuestion() {
  if (waiting || queue.length === 0) return;

  var number = Math.floor(Math.random() * queue.length);
  var q = queue.splice(number, 1)[0];

  waiting = true;
  askBtn.disabled = true;

  var card = document.createElement("div");
  card.className = "card";

  var questionEl = document.createElement("button");
  questionEl.className = "question";
  questionEl.textContent = q.text;
  questionEl.disabled = true;
  questionEl.addEventListener("click", function () {
    toggleReview(card);
  });
  card.appendChild(questionEl);


  var order = [];
  for (var i = 0; i < q.answers.length; i++) order.push(i);
  shuffle(order);


  var answersBox = document.createElement("div");
  answersBox.className = "card__answers";

  for (var k = 0; k < order.length; k++) {
    var n = order[k];
    var right = isRight(q, n);

    var btn = document.createElement("button");
    btn.className = "answer";
    btn.innerHTML = q.answers[n];
    if (right) {
      btn.innerHTML += '<div class="answer__more">' + q.more + "</div>";
    }
    btn.addEventListener("click", makeHandler(card, answersBox, btn, right));
    answersBox.appendChild(btn);
  }
  card.appendChild(answersBox);


  var review = document.createElement("div");
  review.className = "card__review";
  for (var m = 0; m < q.correct.length; m++) {
    review.innerHTML += '<p class="card__review-text">' + q.answers[q.correct[m]] + "</p>";
  }
  review.innerHTML += '<p class="card__review-more">' + q.more + "</p>";
  card.appendChild(review);

  board.appendChild(card);
}


function makeHandler(card, answersBox, btn, right) {
  return function () {
    chooseAnswer(card, answersBox, btn, right);
  };
}

function chooseAnswer(card, answersBox, btn, right) {
  card.classList.add("card--locked");
  btn.classList.add("answer--chosen");

  if (right) {
    rightCount++;
    btn.classList.add("answer--correct");
  }

  waiting = false;
  askBtn.disabled = queue.length === 0;

  setTimeout(function () {
    if (right) card.classList.add("card--right");
    else card.classList.add("card--wrong");

    var blocks = answersBox.querySelectorAll(".answer");
    var count = 0;  
    for (var i = 0; i < blocks.length; i++) {
      if (right && blocks[i] === btn) continue; 
      blocks[i].style.transitionDelay = count * STEP + "s"; 
      blocks[i].classList.add("answer--leaving");
      count++;
    }
    var wait = ((count - 1) * STEP + LEAVE) * 1000;

    if (right) {
      setTimeout(function () {
        btn.classList.remove("answer--correct");
        btn.classList.add("answer--leaving");
        setTimeout(function () { finishCard(card, answersBox); }, LEAVE * 1000);
      }, wait + HOLD * 1000);
    } else {
      setTimeout(function () { finishCard(card, answersBox); }, wait);
    }
  }, PAUSE * 1000);
}

//карточка закончилась
function finishCard(card, answersBox) {
  card.removeChild(answersBox);   
  doneCount++;
  if (doneCount === questions.length) finishQuiz();
}

function finishQuiz() {
  finished = true;
  askBtn.hidden = true;
  restartBtn.hidden = false;

  score.textContent = "Правильных ответов: " + rightCount + " из " + questions.length;
  statusBox.hidden = false;

  var all = document.querySelectorAll(".question");
  for (var i = 0; i < all.length; i++) all[i].disabled = false;
}


function toggleReview(card) {
  if (!finished) return;
  var wasOpen = card.classList.contains("card--open");

  var opened = document.querySelectorAll(".card--open");
  for (var i = 0; i < opened.length; i++) {
    opened[i].classList.remove("card--open");
  }
  if (!wasOpen) card.classList.add("card--open");
}

askBtn.addEventListener("click", showQuestion);
restartBtn.addEventListener("click", function () {
  location.reload();
});
