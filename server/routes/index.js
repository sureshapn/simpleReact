const user = require('./user.routes')
module.exports = (router) => {
    user(router);
}