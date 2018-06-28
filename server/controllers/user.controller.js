const _ = require('lodash');
const userService = require('../services/user.services');
exports.getUser = (req, res) => {
    const query = _.get(req, 'body.data', {});
    return userService.getUser(query)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.getLocation = (req, res) => {
    return userService.getLocation()
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.getSlot = (req, res) => {
    return userService.getSlot()
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.requestCab = (req, res) => {
    return userService.requestCab(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.readyForTrip = (req, res) => {
    return userService.readyForTrip(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.getAvailableEmployee = (req, res) => {
    return userService.getAvailableEmployee(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.updateAvailableEmployees = (req, res) => {
    return userService.updateAvailableEmployees(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.getAvailableCab = (req, res) => {
    return userService.getAvailableCab(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.allocateSeat = (req, res) => {
    return userService.allocateSeat(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.createTrip = (req, res) => {
    return userService.createTrip(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.completeTrip = (req, res) => {
    return userService.completeTrip(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.getTrip = (req, res) => {
    return userService.getTrip(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.singleAvailableEmployee = (req, res) => {
    return userService.singleAvailableEmployee(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};

exports.makePayment = (req, res) => {
    return userService.makePayment(req, res)
    .then(data => {
        return res.success(res, data);
    })
    .catch(err => {
        res.message(res, 401, err.message || err.stack || err);
    })
    .catch(err => {
        res.message(res, 500, err.message || err.stack || err);
    });
};
