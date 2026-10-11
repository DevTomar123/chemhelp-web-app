const topicGrid = document.getElementById("topicGrid");
const searchInput = document.getElementById("topicSearch");
const searchButton = document.getElementById("searchBtn");
const searchFeedback = document.getElementById("searchFeedback");
const quizForm = document.getElementById("quizForm");
const submitQuizBtn = document.getElementById("submitQuizBtn");
const resetQuizBtn = document.getElementById("resetQuizBtn");
const quizResult = document.getElementById("quizResult");

let activeQuizQuestions = [];

function renderTopics(topics) {
  topicGrid.innerHTML = "";

  if (!topics.length) {
    searchFeedback.textContent = "No topics found. Try another keyword.";
    return;
  }

  searchFeedback.textContent = `Showing ${topics.length} topic(s).`;

  topics.forEach((topic) => {
    const card = document.createElement("article");
    card.className = "topic-card";
    card.innerHTML = `<h4>${topic.title}</h4><p>${topic.description}</p>`;
    topicGrid.appendChild(card);
  });
}

async function loadTopics(searchTerm = "") {
  try {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    const response = await fetch(`/api/topics${query}`);

    if (!response.ok) {
      throw new Error("Failed to fetch topics.");
    }

    const topics = await response.json();
    renderTopics(topics);
  } catch (error) {
    searchFeedback.textContent = "Could not load topics right now. Please try again.";
  }
}

function renderQuiz(questions) {
  quizForm.innerHTML = "";

  questions.forEach((question, index) => {
    const container = document.createElement("fieldset");
    container.className = "quiz-question";
    container.innerHTML = `<legend>${index + 1}. ${question.question}</legend>`;

    question.options.forEach((option, optionIndex) => {
      const optionId = `q${question.id}-o${optionIndex}`;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <input type="radio" id="${optionId}" name="question-${question.id}" value="${option}" />
        <label for="${optionId}">${option}</label>
      `;
      container.appendChild(wrapper);
    });

    quizForm.appendChild(container);
  });
}

async function loadQuiz() {
  try {
    const response = await fetch("/api/quiz");

    if (!response.ok) {
      throw new Error("Failed to fetch quiz.");
    }

    activeQuizQuestions = await response.json();
    renderQuiz(activeQuizQuestions);
  } catch (error) {
    quizResult.textContent = "Could not load quiz right now. Please refresh the page.";
  }
}

async function submitQuiz() {
  const answers = activeQuizQuestions.map((question) => {
    const checkedOption = document.querySelector(`input[name="question-${question.id}"]:checked`);
    return {
      id: question.id,
      value: checkedOption ? checkedOption.value : ""
    };
  });

  try {
    const response = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });

    if (!response.ok) {
      throw new Error("Failed to submit quiz.");
    }

    const result = await response.json();
    quizResult.textContent = `Your score: ${result.score}/${result.total} (${result.percentage}%).`;
  } catch (error) {
    quizResult.textContent = "Could not submit quiz right now. Please try again.";
  }
}

searchButton.addEventListener("click", () => {
  loadTopics(searchInput.value);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loadTopics(searchInput.value);
  }
});

submitQuizBtn.addEventListener("click", submitQuiz);

resetQuizBtn.addEventListener("click", () => {
  quizForm.reset();
  quizResult.textContent = "Quiz reset. You can attempt again.";
});

loadTopics();
loadQuiz();
