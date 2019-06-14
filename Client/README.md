# Planning Poker

A estimation tool used by remote teams to plan their projects.

## Demo

A demo version of the application can be found here:
[Demo](https://planning-pokerjm.herokuapp.com)

## Running it locally

This document will provide you with some info about application-boilerplating.
**Installing all project code and dependencies**

In your planning-poker root directory, install project dependencies

```
npm install
```

## Tech Stack

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
- postgresql - used in production
- [Jest](https://www.npmjs.com/package/jest) - integration tests, api, routes and websocket tests
- @hapi/joi - data validation on server

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
  This area contains Login and Session folders. First folder is self explenatory while Session is the big main presentation component, conteining other presentations like Header, SessionInfo, PokerTable, PokerBets and Stories

_Application store_

The Redux store is the heart of our application. Check out [`storeReudx.js`](https://github.com/DarianM/PlanningPoker/blob/master/Client/src/storeRedux.js) to see configuration and a brief part of our state.

- `/middleware`: intercept dispatched actions before they reach the redux store

We are using 3 such middlewares:

1. redux-thunk: action creators that return a function instead of an action. Used to dispatch only if a certain condition is met.
2. messageMiddleware: used for dispatching actions after specific data received from server
3. websocketMiddleware: for managing socket connections or sending certain messages to the server

- `/actions`
  Containing all action creators responsable of modifying reducers

- `/reducers`
  Determinating the initial state of the app.

1. logReducer: handling room, and other members in room
2. storiesReducer: keeping stories and votes assigned to them
3. connectivity: for handling gaps over the network as well as keeping server/ui errors
4. toasts: temporary keeping event messages

### `/Server`

This folder contains all the routes for our Api requests while _/ws_ is our connection from to client to server, and the server to client, indispensable for real-time communication and live-update

## Tests

Each end has its own tests.
use `npm test` or `npm run test` in Client directory or Server directory to run all tests on one end or another
