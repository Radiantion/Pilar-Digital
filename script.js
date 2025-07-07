const questions = [
  { question: "Qual é a capital do Brasil?", options: ["Rio", "Brasília", "São Paulo", "Salvador"], answer: "Brasília" },
  { question: "Quanto é 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
  { question: "Cor do céu em dia limpo?", options: ["Azul", "Verde", "Vermelho", "Amarelo"], answer: "Azul" },
  { question: "Quem pintou a Mona Lisa?", options: ["Michelangelo", "Van Gogh", "Leonardo da Vinci", "Picasso"], answer: "Leonardo da Vinci" },
  { question: "Maior oceano do mundo?", options: ["Atlântico", "Índico", "Ártico", "Pacífico"], answer: "Pacífico" },
  { question: "Autor de 'O Pequeno Príncipe'?", options: ["Monteiro Lobato", "Saint-Exupéry", "Drummond", "Clarice"], answer: "Saint-Exupéry" },
  { question: "Quantos elementos na tabela periódica?", options: ["103", "118", "109", "120"], answer: "118" },
  { question: "Ano da Revolução Francesa?", options: ["1789", "1812", "1750", "1804"], answer: "1789" },
  { question: "Descobridor da penicilina?", options: ["Einstein", "Newton", "Fleming", "Pasteur"], answer: "Fleming" }
];

let currentQuestion = 0;
let score = 0;
let playerAnswers = [];

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const quiz = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const progressEl = document.getElementById("progress");
const playerNameInput = document.getElementById("playerName");
const rankingEl = document.getElementById("ranking");

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", handleNext);

function startQuiz() {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Digite seu nome!");
    return;
  }

  startBtn.classList.add("hidden");
  playerNameInput.classList.add("hidden");
  quiz.classList.remove("hidden");
  showQuestion();
  updateProgressBar();
}

function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = `${currentQuestion + 1}. ${q.question}`;
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => selectAnswer(option);
    optionsEl.appendChild(btn);
  });

  nextBtn.classList.add("hidden");
}

function selectAnswer(option) {
  playerAnswers[currentQuestion] = option;

  if (option === questions[currentQuestion].answer) {
    score++;
  }

  nextBtn.classList.remove("hidden");

  // Desativa opções após clique
  Array.from(optionsEl.children).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === option) {
      btn.style.backgroundColor = option === questions[currentQuestion].answer ? "#2ecc71" : "#e74c3c";
    }
  });
}

function handleNext() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
    updateProgressBar();
  } else {
    finishQuiz();
  }
}

function updateProgressBar() {
  const percent = (currentQuestion / questions.length) * 100;
  progressEl.style.width = `${percent}%`;
}

function finishQuiz() {
  quiz.classList.add("hidden");
  resultEl.classList.remove("hidden");

  const name = playerNameInput.value.trim();
  let feedback = `<h3>🎯 ${name}, você acertou ${score} de ${questions.length}</h3>`;

  questions.forEach((q, i) => {
    if (playerAnswers[i] !== q.answer) {
      feedback += `
        <p><strong>${i + 1}. ${q.question}</strong><br>
        Sua resposta: <span style="color:red;">${playerAnswers[i] || "Não respondeu"}</span><br>
        Correta: <span style="color:green;">${q.answer}</span></p>`;
    }
  });

  resultEl.innerHTML = feedback;

  saveRanking(name, score);
  showRanking();

  // Reiniciar para nova tentativa
  currentQuestion = 0;
  score = 0;
  playerAnswers = [];
  startBtn.classList.remove("hidden");
  playerNameInput.classList.remove("hidden");
  updateProgressBar();
}

function saveRanking(name, score) {
  const key = "ranking-geral";
  const data = JSON.parse(localStorage.getItem(key)) || [];
  data.push({ name, score });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(data.slice(0, 5)));
}

function showRanking() {
  const key = "ranking-geral";
  const data = JSON.parse(localStorage.getItem(key)) || [];
  rankingEl.innerHTML = "";
  data.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${entry.name} - ${entry.score} pts`;
    rankingEl.appendChild(li);
  });
}

showRanking();
