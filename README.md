# 日本語の Quiz Game

This is a project built by group 4 in the japanese program batch 1 to practice using SvelteKit with TypeScript.

This project is a game built with SvelteKit using TypeScript. The game consists of English words that the player can pick the Japanese word that corresponds to the displayed word in English.

## Live URL

This project is deployed on Vercel here:
https://quiz-game-hsl7ci04k-pascaruuus-projects.vercel.app/

## Prerequisites

- Node.js 18+
- npm

## Setting Up Database

In order to run this project you need to:

1. Sign up a Turso account
2. Create a database for the project use
3. Run the queries in the 0000_magenta_storm.sql file to get the table set up
4. Using the template in the .env.example, paste in the secrets from Turso to complete

## Installing Dependencies

In order to run this SvelteKit app, you can follows the following instructions:

```sh
# run this command in the root terminal of the project
npm install
```

## Running in Development Mode

To run this project in localhost, follow the following instruction:

```sh
# run this command in the root terminal of the project
npm run dev
```

## Screens

1. **Home Screen**: This screen contains the welcome page of the page with BGM and moving background.

2. **Name Input Screen**: This screen contains the form for inputting the user's name for record.

3. **Game Screen**: This screen contains the timer, score, questions, and answers　(if the correct answer is picked, 100 points will be added to the total score).

4. **Result Screen**: This screen contains the score, correct answers, and incorrect answers. Users can pick to replay or view the leaderboard here as well.

5. **Leaderboard Screen**: Users can view the 10 highest acquired scores and the name of the user that played the session.

6. **Credits Screen**: This screens contain the credits of the developers who developed this project long with their share of work.
