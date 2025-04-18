# One Day Planner API (Practicum Project)

This is the backend API for the **One Day Planner** app — a planning application where users can create one-day itineraries with multiple stops such as parks, museums, cafes, and restaurants. Built with **Express.js** and **MongoDB**, this API serves data to the frontend and handles user authentication, trip planning, and more.

The **frontend team** is developing the user interface in a separate [repository](https://github.com/Code-the-Dream-School/ii-practicum-team-5-front), using **Vite.js** and **React**.

## About the Advanced Practicum program and Code the Dream

The **[Advanced Practicum program](https://codethedream.org/classes/practicum/)** at **Code the Dream** is an 8–10 week hands-on experience where a team of 4-6 students work in teams to build real-world software using Agile practices, GitHub, and project management tools. It’s designed to bridge the gap between learning and working in a professional tech environment.

**[Code the Dream](https://codethedream.org)** is a nonprofit offering free, remote advanced coding classes to people from diverse backgrounds, aiming to make tech careers more accessible and inclusive.

Special thanks to **Code the Dream** and all the **volunteer mentors** for giving us the opportunity to grow, and gain valuable experience in a supportive and inclusive environment.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB / Mongoose
- JWT
- Swagger (for API docs)

---

## Setting up local development environment

The back-end server will be running on port 8000. The front-end app will be running on port 3000. You will need to run both the back-end server and the front-end app at the same time to test your app.

1. Create a folder to contain both the front-end and back-end repos
2. Clone this repository to that folder
3. Run `npm install` to install dependencies
4. Pull the latest version of the `main` branch (when needed)

Then create a `.env` file in the root based on `.env.example` and update the following variables:

```ini
MONGO_URI=your-mongodb-uri
```

Now you can run the server with `npm run dev` and test it in your browser at http://localhost:8000/api/v1/.

---

## API Documentation

API full documentation is available via Swagger. After starting the server, go to `http://localhost:5000/api-docs`

The OpenAPI definition is located in `swagger.yaml`. The endpoints that are not yet implemented are marked as Draft.

## Running the back-end server in Visual Studio Code

Note: In the below example, the group's front-end repository was named `bb-practicum-team1-front` and the back-end repository was named `bb-practicum-team-1-back`. Your repository will have a different name, but the rest should look the same.
![vsc running](images/back-end-running-vsc.png)

## Testing the back-end server API in the browser

![browser server](images/back-end-running-browser.png)

> Update the .node-version file to match the version of Node.js the **team** is using. This is used by Render.com to [deploy the app](https://render.com/docs/node-version).
