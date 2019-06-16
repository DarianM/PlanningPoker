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
- [Redux](https://redux.js.org/) is used for state management, look below for details about configuration
- [Redux-thunk](https://www.npmjs.com/package/redux-thunk) redux middleware used for api calls
- [Babel](https://www.npmjs.com/package/@babel/core) used to compile the code to a backwards compatible version of JavaScript
  CSS styling
- [style-loader](https://www.npmjs.com/package/style-loader) for importing CSS styling into components
- [css-loader](https://github.com/webpack-contrib/css-loader)
- [yup](https://www.npmjs.com/package/yup) - as validator for user data inputs
- ESLint - for coding conventions
- [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) - as a set of lint rules
- [Prettier](https://www.npmjs.com/package/prettier) - code formater
- [Jest](https://www.npmjs.com/package/jest) - JS unit test framework
- [enzyme](https://www.npmjs.com/package/enzyme) - JS testing utility for components

Note that in order to format your code on save file with Prettier you must toggle Format on Save in _File > Preferences > Settings_

### Server

- express - responding to HTTP requests
- ws - for real time communications
- knex - for schema model creation and table migrations
- sqlite3 - database used in development and tests
- postgresql - db used in production
- [Jest](https://www.npmjs.com/package/jest) - integration tests, api, routes and websocket tests
- @hapi/joi - data validation on server

## Install

In your planning-poker root directory, install project dependencies

```sh
npm install
```

For development, first knex db migration is required

1. in root directory _cd Server_
2. npm knex migrate:latest

## Usage

```sh
npm run start
```

Note: When you run npm start, a server will be launched in your terminal for development. You can then open http://localhost:3000 to access the server and see the app.

## Run tests

```sh
npm run test
```

Note: in Client directory for client's tests or in root directory to run all tests for server

## Project Structure

### `/Client/App`

We use the container/component architecture. _containers/_ contains React components which are connected to the redux store. _components/_ contains presentation React components which depend on containers for data. Container components care about how things work, while components care about how things look.

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

- `/components`
  This area contains Login and Session folders. First folder represents login page while Session is the big main presentation component, conteining other presentations like Header, SessionInfo, PokerTable, PokerBets and Stories

_Application store_

The Redux store is the heart of our application. Check out [`storeReudx.js`](https://github.com/DarianM/PlanningPoker/blob/master/Client/src/storeRedux.js) to see configuration and a brief part of our state.

- `/middleware`: intercept dispatched actions before they reach the redux store.
  We are using 3 such middlewares:

1. redux-thunk
2. messageMiddleware
3. websocketMiddleware

- `/actions`: containing all action creators

1. roomActions
2. storyActions
3. toastActions
4. websocketActions

- `/reducers`: determinating the initial state of the app

1. logReducer
2. storiesReducer
3. connectivity: for handling gaps over the network as well as keeping server/ui errors
4. toasts: temporary keeping event messages

### `/Server`

- `/routes`: contains all the routes for Api requests

1. /api
2. /room
3. /story

- `/ws` holds the connection from to client to server, and the server to client, indispensable for real-time communication and live-update

## Contribution

For development, please note that the Client is served as a static source. In order to see any change made in Client reflected in app you must:

1.  in `/Client`> npm run build
2.  copy everything in `/Client/dist`
3.  paste in root `/public`

For deployment, after all changes commited, to push heroku:

1.  open powershell and nagivate to root directory
2.  `heroku login` to login into your heroku account
3.  `git push heroku master` then `heroku open` to view the app in your browser

## Author

👤 **JuniorMind**

- Github:
  [@RazvanS91](https://github.com/RazvanS91)
  [@DarianM](https://github.com/DarianM)

## Show your support

Give a ⭐️ if this project helped you !

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
