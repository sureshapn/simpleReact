/** require dependencies */
const express = require("express");
const routes = require('./routes/');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();
const router = express.Router();
const config = require('../config/dev');
var connectionUrl = 'mongodb://' + config.db.host + '/' + config.db.name,
options = {
    user: config.username,
    pass: config.password,
};
mongoose.connect(connectionUrl, options, function(error) {
if (error) {
    console.error(error);
}
});

mongoose.connection.on('connected', function() {
console.info('%s: MongoDB connected', new Date());
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
console.error('MongoDB default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
console.info('%s: MongoDB default connection disconnected... ', new Date());
});

let port = config.port;

/** set up routes {API Endpoints} */
require('./lib/middleware')(app);
routes(router)
/** set up middlewares */
app.use(cors())
app.use(bodyParser.json())
app.use(helmet())
//app.use('/static',express.static(path.join(__dirname,'static')))

app.use('/api', router)

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});