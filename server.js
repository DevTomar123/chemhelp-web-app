const path = require("path");
const express = require("express");
const topics = require("./data/topics");
const quizQuestions = require("./data/quiz");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/topics", (req, res) => {
  const searchTerm = (req.query.search || "").toLowerCase().trim();

  if (!searchTerm) {
    return res.json(topics);
  }

  const filteredTopics = topics.filter(({ title, description }) => {
    return title.toLowerCase().includes(searchTerm) || description.toLowerCase().includes(searchTerm);
  });

  return res.json(filteredTopics);
});

app.get("/api/quiz", (_req, res) => {
  const publicQuestions = quizQuestions.map(({ answer, ...question }) => question);
  res.json(publicQuestions);
});

app.post("/api/quiz/submit", (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers must be an array." });
    }

    let score = 0;

    for (const question of quizQuestions) {
      const userAnswer = answers.find((answer) => answer.id === question.id);
      if (userAnswer && userAnswer.value === question.answer) {
        score += 1;
      }
    }

    return res.json({
      score,
      total: quizQuestions.length,
      percentage: Math.round((score / quizQuestions.length) * 100)
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to evaluate quiz answers." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Resource not found." });
});

app.use((error, _req, res, _next) => {
  res.status(500).json({ error: "Unexpected server error.", details: error.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ChemHelp server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
