<h1 align="center">Welcome to PlanningPoker 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/DarianM/PlanningPoker">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
</p>

> A estimation tool used by remote teams to plan their projects.

### 🏠 [Homepage](https://github.com/DarianM/PlanningPoker)

## Demo

A demo version of the application can be found here:
[Demo](https://planning-pokerjm.herokuapp.com)

## Prerequisites

Brief list of dependecies used for creating this project:

### Client

- [React](https://reactjs.org/) is used as the client UI framework
- [Redux](https://redux.js.org/) with [Redux-thunk](https://www.npmjs.com/package/redux-thunk) are used for state management
- [Babel](https://www.npmjs.com/package/@babel/core) used to compile the code to a backwards compatible version of JavaScript
- [style-loader](https://www.npmjs.com/package/style-loader) with [css-loader](https://github.com/webpack-contrib/css-loader) are used for importing CSS styling into components
- [yup](https://www.npmjs.com/package/yup) as validator for user data inputs
- ESLint with [Airbnb ruleset](https://www.npmjs.com/package/eslint-config-airbnb) used for coding conventions
- [Prettier](https://www.npmjs.com/package/prettier) as the code formatter
- [Jest](https://www.npmjs.com/package/jest) with [enzyme](https://www.npmjs.com/package/enzyme) as the unit test framework

### Server

- [express](https://www.npmjs.com/package/express) responding to HTTP requests
- [ws](https://www.npmjs.com/package/ws) used for real time communications
- [knex](https://www.npmjs.com/package/knex) for schema model creation and table migrations
- [sqlite3](https://www.npmjs.com/package/sqlite3) database used in development and tests
- [postgresql](https://www.npmjs.com/package/pg) db used in production
- [Jest](https://www.npmjs.com/package/jest) used for integration tests, api, routes and websocket tests
- [@hapi/joi](https://www.npmjs.com/package/@hapi/joi) as data validator on server

## Install

In your planning-poker root directory, install project dependencies

```sh
npm install
```

For development, first knex db migration is required:

```
npm run knex migrate:latest
```

## Usage

```sh
npm run start
```

Note: When you run npm start, a server will be launched in your terminal for development. You can then open http://localhost:3000 to access the server and see the app.

`webpack.config.js` devServer is configured to proxy all `/api` and `/ws` calls to the server running on localhost:3000.

in `/Client`

```sh
npm run start
```

Note: Project is now running at http://localhost:8080

## Run tests

for client's tests on `/Client` run

```sh
npm run test
```

for integration tests found on Server in root directory

```sh
npm run test
```

Note: in Client directory for client's tests or in root directory to run all tests for server

## Project Structure

### `/Client/App`

```
+---actions
+---components
|   +---login
|   \---session
|       +---header
|       +---pokerBets
|       \---pokerTable
+---middleware
\---reducers
```

- `/components`:
  - /login represents login page
  - /session main presentation component

_Application store_

The Redux store is the heart of our application. Check out [`storeReudx.js`](https://github.com/DarianM/PlanningPoker/blob/master/Client/src/storeRedux.js) to see configuration and a brief part of the state.

- `/middleware`: intercept dispatched actions before they reach the redux store.

- `/actions`: containing all action creators

- `/reducers`: changing state in response to actions sent to the store.

### `/Server`

- `/routes`: contains all the routes for Api requests

- `/ws` holds the connection from to client to server, and the server to client, indispensable for real-time communication and live-update

## Author

👤 **JuniorMind**

- Github:
  [@RazvanS91](https://github.com/RazvanS91)
  [@DarianM](https://github.com/DarianM)

## Show your support

Give a ⭐️ if this project helped you !

---
