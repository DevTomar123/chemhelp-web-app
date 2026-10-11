# ChemHelp Web App

ChemHelp is a modern, student-friendly chemistry learning platform built for college projects and portfolios.

## Features

- Responsive homepage with navigation, hero section, and clear product introduction
- Learning sections for:
  - Elements
  - Periodic table
  - Chemical reactions
  - Acids and bases
  - Basic chemistry concepts
- Topic search with instant filtering through backend sample data
- Interactive multiple-choice quiz with score and percentage feedback
- Smooth UI animations and chemistry-themed colors
- Basic backend error handling for API routes

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express

## Project Structure

```
chemhelp-web-app/
├── data/
│   ├── quiz.js
│   └── topics.js
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── server.js
├── package.json
└── README.md
```

## Setup Instructions (VS Code)

1. Open the project folder in VS Code.
2. Open the integrated terminal.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```
5. Open your browser at:
   ```
   http://localhost:3000
   ```

## Available Scripts

- `npm start` - runs the Express server
- `npm run dev` - runs server with Node watch mode
- `npm test` - runs Node test runner (currently no test files)

## Notes

- This project uses local sample educational data only.
- No fake external API integrations are used.
