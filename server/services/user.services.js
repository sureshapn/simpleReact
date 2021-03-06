const _ = require('lodash');
const User = require('../models/User');
const Location = require('../models/Location');
const Slot = require('../models/Slot');
const Trip = require('../models/Trip');
const AvailableEmployee = require('../models/AvailableEmployee');
const updateBlock = require('./updateBlock');
const AvailableCab = require('../models/AvailableCab');
exports.getUser = (query) => {
    const queryData = query;
    if (_.has(queryData, 'userName')) {
        queryData.userName = _.toLower(queryData.userName);
    }
    return User.findOne(queryData)
    .populate('pickupLocation')
    .then(data => {
        if (_.isEmpty(data)) {
            throw 'Username/Passwword not matching';
        }
        return data;
    });
};

exports.getLocation = () => {
    return Location.find({})
    .then(data => {
        if (_.isEmpty(data)) {
            throw 'Location Not Found';
        }
        return data;
    });
};

exports.getSlot = () => {
    return Slot.find({})
    .then(data => {
        if (_.isEmpty(data)) {
            throw 'Location Not Found';
        }
        return data;
    });
};

exports.requestCab = (req) => {
    return User.findOneAndUpdate(
        { _id: _.get(req, 'body.userData._id', null) },
        { tripStatus: 'REQUESTED' },
        { new: true, upsert: false }
    )
    .then(row => {
        const availableEmp = new AvailableEmployee({
            user: _.get(req, 'body.userData._id', null),
            slot: _.get(req, 'body.userData.slot', null),
            region: _.get(req, 'body.userData.region', null),
            location: _.get(req, 'body.userData.location', null),
        });
        return availableEmp.save();
    });
};

exports.readyForTrip = (req) => {
    return User.findOneAndUpdate(
        { _id: _.get(req, 'body.userData._id', null) },
        { tripStatus: 'REQUESTED' },
        { new: true, upsert: false }
    )
    .then(row => {
        const availableCab = new AvailableCab({
            cab: _.get(req, 'body.userData._id', null),
        });
        return availableCab.save();
    });
};

exports.getAvailableCab = () => {
    return AvailableCab.find({ isCompleted: false })
    .populate('cab')
    .then(row => {
        return row;
    });
};

exports.getAvailableEmployee = () => {
    return AvailableEmployee.find({ isCompleted: false })
    .populate('user')
    .then(row => {
        return row;
    });
};

exports.updateAvailableEmployees = (req) => {
    const data = _.get(req, 'body.query', {});
    const returnCondn = { new: true, upsert: false };
    return AvailableEmployee.findOneAndUpdate({ _id: data._id }, { tripStatus: data.status }, returnCondn)
    .then(row => {
        return row;
    });
};

exports.allocateSeat = (req) => {
    const data = _.get(req, 'body.query', {});
    const returnCondn = { new: true, upsert: false };
    return User.findOneAndUpdate({ _id: data._id }, { tripStatus: 'ALLOTTED' }, returnCondn)
    .then(() => {
        if (data.type === 'EMPLOYEE') {
            return AvailableEmployee.findOneAndUpdate({ user: data._id }, { isCompleted: true }, returnCondn);
        }
        return AvailableCab.findOneAndUpdate({ cab: data._id }, { isCompleted: true }, returnCondn);
    });
};

exports.createTrip = (req) => {
    const tripData = req.body;
    const tripRaw = new Trip({
        employees: tripData.employees,
        employers: tripData.employers,
        availableEmployees: tripData.availableEmployees,
        driver: tripData.driver,
        vendor: tripData.vendor,
        region: tripData.region,
        slot: tripData.slot,
        paymentStatus: 'PENDING',
        tripStatus: 'REQUESTED',
    });
    const userArray = tripData.employees;
    userArray.push(tripData.driver);
    const query = {
        _id: { $in: userArray },
    };
    return tripRaw.save()
    .then(() => {
        return User.update(query, { $set: { tripStatus: 'ALLOTTED' } }, { multi: true });
    })
    .then(() => {
        const queryData = {
            _id: { $in: tripData.availableEmployees },
        };
        return AvailableEmployee.update(queryData, { $set: { isCompleted: true } }, { multi: true });
    })
    .then(() => {
        const queryData = {
            _id: tripData.availableDriverId,
        };
        return AvailableCab.update(queryData, { $set: { isCompleted: true } });
    });
};

exports.completeTrip = (req) => {
    const tripData = req.body;
    const userArray = tripData.employees;
    userArray.push(tripData.driver);
    const query = {
        _id: { $in: userArray },
    };
    return Trip.findOneAndUpdate({ _id: tripData.tripId }, { tripStatus: 'COMPLETED' })
    .then(() => {
        return User.update(query, { $set: { tripStatus: 'IDLE' } }, { multi: true });
    })
    .then(() => {
        const queryData = {
            _id: { $in: tripData.availableEmployees },
        };
        const amount = _.random(20, 100);
        return AvailableEmployee.update(queryData, { $set: { tripStatus: 'COMPLETED', amount } }, { multi: true });
    })
    .then(() => {
        return Trip.find({ _id: tripData.tripId })
    .sort({ createdAt: -1 })
    .populate(['employees'])
    .populate('driver')
    .populate(['availableEmployees']);
    })
    .then(data => {
        const trpData = {
            trip: tripData.tripId,
            tripData: JSON.stringify(data),
        };
        return updateBlock.createTrip(trpData);
    });
};

exports.getTrip = () => {
    return Trip.find({})
    .sort({ createdAt: -1 })
    .populate(['employees'])
    .populate('driver')
    .populate(['availableEmployees'])
    .then((data) => {
        return data;
    });
};

exports.singleAvailableEmployee = (req) => {
    return AvailableEmployee.find({ user: _.get(req, 'body.id') })
    .sort({ createdAt: -1 })
    .populate('user')
    .then(row => {
        return row[0];
    });
};

exports.makePayment = (req) => {
    const query = req.body.query;
    const updateData = req.body.updateData;
    return AvailableEmployee.findOneAndUpdate(query, updateData)
    .populate('user')
    .then(row => {
        return row;
    });
};
