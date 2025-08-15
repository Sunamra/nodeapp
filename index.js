// This file is the entry point of the project
require('dotenv').config({ quiet: true }); // load env before reading process.env

const app = require('./app');

const port = Number(process.argv.slice(2)[0]) || process.env.PORT || 3000;

const server = require('http').createServer(app);
require('./apps/sharefile/sockets/websocket')(server);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


/**
 * @ToDo
 * 1. New sharefile/api/v1/storage-stats path
 *    to fetch storage rules before uploading file.
 * 2. If file(s) doesn't comply with rules, reject
 *    those files only.
 * 3. If number of files exceed, upload first
 *    valid number of files.
 */