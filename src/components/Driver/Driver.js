import { getUser, readyForTrip, getTrip, completeTrip, updateAvailableEmployees, setEmpty } from '../../redux/actions/userAction';
import { getSlot, getLocation } from '../../redux/actions/commonAction';
import * as _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import config from '../../config';
import Notifications, { notify } from 'react-notify-toast';
const mapStateToProps = state => {
    return {
        user: state.user.user,
        slots: state.common.slot,
        locations: state.common.location,
        trips: state.user.trips,
    };
};
class Driver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionData: {},
            slotDrop: {},
            locationDrop: {},
            region: 'SOUTH',
            selectedSlot: '',
            selectedLocation: '',
            tripStatus: 'IDLE',
            trip: [],
        };
        this.socketFunction = this.socketFunction.bind(this);
    }

    componentWillMount() {
        this.props.getTrip({}, () => {});
        this.props.getSlot();
        this.props.getLocation();
        this.props.getUser({ _id: JSON.parse(sessionStorage.getItem('userData'))._id }, () => {});
        this.setState(Object.assign({}, {
            sessionData: JSON.parse(sessionStorage.getItem('userData')),
        }), () => {
            if (_.get(this.state, 'sessionData.type') !== 'DRIVER') {
                sessionStorage.setItem('userData', JSON.stringify({}));
                this.props.history.push('/login');
            }
        });
    }
    componentWillReceiveProps(props) {
        if (!_.isEmpty(props.trips)) {
            const trip = _.filter(_.get(props, 'trips', []), (item) => {
                return item.driver._id === this.state.sessionData._id;
            });
            this.setState(Object.assign({}, {
                trip,
            }));
        }
        if (!_.isEmpty(props.user)) {
            this.setState(Object.assign({}, {
                sessionData: props.user,
            }));
        }
    }

    componentWillUnmount() {
        this.props.setEmpty();
    }

    readyForTrip() {
        const self = this;
        const newState = Object.assign({}, this.state);
        newState.sessionData.tripStatus = 'REQUESTED';
        this.setState(newState);
        this.props.readyForTrip({
            _id: this.state.sessionData._id,
            slot: this.state.selectedSlot,
            location: this.state.selectedLocation,
        }, () => {
            self.props.getUser({ _id: self.state.sessionData._id }, () => {
                const socket = socketIOClient(config.socketUrl);
                socket.emit('updated', 'driver');
            });
        });
    }
    updateAvilableEmployees(evt) {
        if (evt.target.value === 'On Board') {
            this.props.updateAvailableEmployees({ _id: evt.target.id, status: 'ONBOARD_REQ' }, () => {
                notify.show('On board request sent!', 'warning');
                this.props.getTrip({}, () => {});
                const socket = socketIOClient(config.socketUrl);
                socket.emit('updated', 'driver');
            });
        }
        if (evt.target.value === 'Off Board') {
            this.props.updateAvailableEmployees({ _id: evt.target.id, status: 'OFFBOARD_REQ' }, () => {
                notify.show('Off board request sent!', 'warning');
                this.props.getTrip({}, () => {});
                const socket = socketIOClient(config.socketUrl);
                socket.emit('updated', 'driver');
            });
        }
    }
    completeTrip() {
        const query = {};
        const trip = _.filter(_.get(this.props, 'trips', []), (item) => {
            return item.driver._id === this.state.sessionData._id;
        });
        query.employees = _.map(_.get(trip, '[0].employees', []), item => {
            return item._id;
        });
        query.availableEmployees = _.map(_.get(trip, '[0].availableEmployees', []), item => {
            return item._id;
        });
        query.driver = _.get(trip, '[0].driver._id', '');
        query.tripId = _.get(trip, '[0]._id', '');
        this.props.completeTrip(query, () => {
            this.props.getSlot();
            this.props.getLocation();
            this.props.getTrip({}, () => {
                const socket = socketIOClient(config.socketUrl);
                socket.emit('updated', 'driverComplete');
            });
        });
    }

    socketFunction() {
        window.location = 'driver';
    }

    render() {
        const socket = socketIOClient(config.socketUrl);
        socket.on('updated', (data) => {
            if (data !== 'driver') {
                this.socketFunction();
            }
        });
        let driverForm;
        if (this.state.sessionData.tripStatus === 'IDLE') {
            driverForm = (
                <input
                  className="btn btn-primary btn-outline centered w-100"
                  type="button"
                  value="Ready For Trip"
                  style={{ color: 'white' }}
                  onClick={this.readyForTrip.bind(this)}
                />
            );
        } else if (this.state.sessionData.tripStatus === 'REQUESTED') {
            driverForm = (
                <div>
                    <h4 className="centered">Waiting For Trip</h4>
                    <h6 className="centered">Trip details updated soon..</h6>
                </div>
        );
        } else if (this.state.sessionData.tripStatus === 'ALLOTTED' && !_.isEmpty(_.get(this.state.trip, '[0]'))) {
            driverForm = (
                <div className="m-t-20 panel panel-info">
                    <div className="panel-heading">
                        <h5 className="centered">Ready For Trip</h5>
                    </div>
                    <div className="panel-body">
                        <div className="well well-sm">
                            <table className="table table-responsive">
                                <thead>
                                    <th>Name</th>
                                    <th>Company</th>
                                    <th>Dropping</th>
                                </thead>
                                <tbody>
                                    {_.map(_.get(this.state.trip, '[0].employees', []), (item, key) => {
                                        return (<tr>
                                            <td>{item.name}</td>
                                            <td>{item.companyName}</td>
                                            <td>{_.get(this.state.trip, '[0].availableEmployees', [])[key].location}
                                                {(_.get(this.state.trip, '[0].availableEmployees', [])[key].tripStatus === 'STARTED') ?
                                                    <div className="centered m-b-10 pull-left">
                                                        <input type="button" id={_.get(this.state.trip, '[0].availableEmployees', [])[key]._id} onClick={this.updateAvilableEmployees.bind(this)} className="btn btn-success" value="On Board" />
                                                    </div> : ''
                                                }
                                                {(_.get(this.state.trip, '[0].availableEmployees', [])[key].tripStatus === 'ONBOARD_ACCEP') ?
                                                    <div className="centered m-b-10 pull-left">
                                                        <input type="button" id={_.get(this.state.trip, '[0].availableEmployees', [])[key]._id} onClick={this.updateAvilableEmployees.bind(this)} key={key} className="btn btn-success" value="Off Board" />
                                                    </div> : ''
                                                }
                                            </td>
                                        </tr>);
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="m-10">
                        <div className="pull-right">Total Employees: {_.get(this.state.trip, '[0].employees', []).length}</div>
                        <div>Route: {_.get(this.state.trip, '[0].region', '')}</div>
                        <div className="centered">Slot: {_.get(this.state.trip, '[0].slot', '')}</div>
                    </div>
                </div>
            );
        }
        return (
            <div className="container">
                <Notifications />
                <div className="card-login card-container">
                    <h4 className="centered">Driver Portal</h4>
                    <Link to="/" className="pull-right">logout</Link><br />
                    <div className="well well-sm">
                        <h5 className="pull-right">
                            Vendor: <br />{_.get(this.state, 'sessionData.companyName', '')}
                        </h5>
                        <h5>
                            Name: <br />{_.get(this.state, 'sessionData.name', '')}
                        </h5>
                        <h5 className="pull-right">
                            cabNo: <br />{_.get(this.state, 'sessionData.cabNo', '')}
                        </h5>
                        <h5>
                            seats: <br />{_.get(this.state, 'sessionData.seats', '')}
                        </h5>
                    </div>
                      {driverForm}
                    {(this.state.sessionData.tripStatus === 'ALLOTTED' && !_.isEmpty(_.get(this.state.trip, '[0]'))) ?
                        <div className="centered">
                            <input type="button" className="btn btn-danger btn-sm" onClick={this.completeTrip.bind(this)} value="Complete Trip" />
                        </div> : ''
                    }
                </div>
            </div>
        );
    }
}
Driver.propTypes = {
    getUser: PropTypes.func.isRequired,
    readyForTrip: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
    user: PropTypes.array.isRequired,
    slots: PropTypes.array.isRequired,
    getLocation: PropTypes.func.isRequired,
    getSlot: PropTypes.func.isRequired,
    locations: PropTypes.array.isRequired,
    trips: PropTypes.array.isRequired,
    getTrip: PropTypes.func.isRequired,
    updateAvailableEmployees: PropTypes.func.isRequired,
    completeTrip: PropTypes.func.isRequired,
    setEmpty: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { getUser, getSlot, getLocation, completeTrip, readyForTrip, updateAvailableEmployees, getTrip, setEmpty })(Driver);
