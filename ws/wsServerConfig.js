let server;

const setRealServer = receivedServer => {
  server = receivedServer;
};

const updateServer = () => server;

module.exports = { server, updateServer, setRealServer };
