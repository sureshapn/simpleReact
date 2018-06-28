const User = require('../controllers/user.controller');
module.exports = (app) => {
    app.route('/getUser').post(User.getUser);
    app.route('/getLocation').get(User.getLocation);
    app.route('/getSlot').get(User.getSlot);
    app.route('/requestCab').post(User.requestCab);
    app.route('/readyForTrip').post(User.readyForTrip);
    app.route('/availableCab').get(User.getAvailableCab);
    app.route('/availableEmployee')
    .post(User.updateAvailableEmployees)
    .get(User.getAvailableEmployee);
    app.route('/allocateSeat').post(User.allocateSeat);
    app.route('/createTrip').post(User.createTrip);
    app.route('/completeTrip').post(User.completeTrip);
    app.route('/getTrip').get(User.getTrip);
    app.route('/singleAvailableEmployee').post(User.singleAvailableEmployee);
    app.route('/makePayment').post(User.makePayment);
};
