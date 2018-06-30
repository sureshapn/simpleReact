/** require dependencies */
const express = require('express');
const routes = require('./routes/');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const helmet = require('helmet');
const app = express();
const router = express.Router();
const socketIO = require('socket.io');
const config = require('../config/dev');
const connectionUrl = 'mongodb://' + config.db.host + '/' + config.db.name;
const options = {
    user: config.username,
    pass: config.password,
};
mongoose.connect(connectionUrl, options, function (error) {
    if (error) {
        console.error(error);
    }
});

mongoose.connection.on('connected', function () {
    console.info('%s: MongoDB connected', new Date());
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.error('MongoDB default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.info('%s: MongoDB default connection disconnected... ', new Date());
});

let port = config.port;
const server = http.createServer(app);
const io = socketIO(server);
/** set up routes {API Endpoints} */
require('./lib/middleware')(app);
routes(router);
/** set up middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
io.on('connection', socket => {
    console.log('User connected');
    socket.on('updated', (item) => {
        // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
        // we make use of the socket.emit method again with the argument given to use from the callback function above
        console.log('updated: ', item);
        io.sockets.emit('updated', item);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
// app.use('/static',express.static(path.join(__dirname,'static')))

app.use('/api', router);

/** start server */
server.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
