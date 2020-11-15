const http = require('http');

const app = require('./app');

const port = process.env.PORT || 3300;

const server = http.createServer(app);

server.listen(3300, () => console.log(`Listening on port ${port}...`));
