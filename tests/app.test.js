const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../server");

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
});

test("filters topics by search query", async () => {
  const response = await fetch(`${baseUrl}/api/topics?search=acid`);
  assert.equal(response.status, 200);

  const topics = await response.json();
  assert.equal(topics.length, 1);
  assert.equal(topics[0].title, "Acids and Bases");
});

test("returns score when quiz answers are submitted", async () => {
  const response = await fetch(`${baseUrl}/api/quiz/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answers: [
        { id: 1, value: "6" },
        { id: 2, value: "7" },
        { id: 3, value: "Salt and water" },
        { id: 4, value: "Noble gases" }
      ]
    })
  });

  assert.equal(response.status, 200);
  const result = await response.json();

  assert.deepEqual(result, {
    score: 4,
    total: 4,
    percentage: 100
  });
});
