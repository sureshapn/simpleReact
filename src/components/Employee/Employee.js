import { getUser, requestCab, getTrip } from '../../redux/actions/userAction';
import { getSlot, getLocation } from '../../redux/actions/commonAction';
import * as _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Notifications, { notify } from 'react-notify-toast';
const mapStateToProps = state => {
    return {
        user: state.user.user,
        slots: state.common.slot,
        locations: state.common.location,
        trips: state.user.trips,
    };
};
class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            sessionData: {},
            slotDrop: {},
            locationDrop: {},
            region: 'SOUTH',
            selectedSlot: '',
            selectedLocation: '',
            tripStatus: 'IDLE',
        };
    }

    componentWillMount() {
        this.props.getSlot();
        this.props.getTrip({}, () => {});
        this.props.getLocation();
        this.setState(Object.assign({}, {
            sessionData: JSON.parse(sessionStorage.getItem('userData')),
        }), () => {
            if (_.get(this.state, 'sessionData.type') !== 'EMPLOYEE') {
                sessionStorage.setItem('userData', JSON.stringify({}));
                this.props.history.push('/login');
            }
        });
    }
    componentWillReceiveProps() {
    }

    handleChange(evt) {
        switch (evt.target.id) {
        case 'userName': {
            this.setState(Object.assign({}, {
                userName: evt.target.value,
            }));
            break;
        }
        case 'passwd': {
            this.setState(Object.assign({}, {
                passwd: evt.target.value,
            }));
            break;
        }
        default:
            break;
        }
    }

    handleSlotChange(evt) {
        this.setState(Object.assign({}, {
            selectedSlot: evt.target.value,
        }));
    }
    handleLocationChange(evt) {
        this.setState(Object.assign({}, {
            selectedLocation: evt.target.value,
            region: _.get(_.find(this.props.locations, { name: evt.target.value }), 'REGION', 'SOUTH'),
        }));
    }
    requestCab(evt) {
        evt.preventDefault();
        if (!_.isEmpty(this.state.selectedLocation) && !_.isEmpty(this.state.selectedSlot)) {
            this.props.requestCab({
                _id: this.state.sessionData._id,
                slot: this.state.selectedSlot,
                location: this.state.selectedLocation,
                region: this.state.region,
            }, () => {
                this.props.getUser({ _id: this.state.sessionData._id }, () => {});
                const newState = this.state;
                newState.sessionData.tripStatus = 'REQUESTED';
                this.setState(newState);
            });
        } else {
            notify.show('Invalid Data', 'warning');
        }
    }
    render() {
        const trip = _.filter(_.get(this.props, 'trips'), (item) => { return _.find(item.employees, { name: _.get(this.state, 'sessionData.name') }); });
        let employeeForm;
        if (this.state.sessionData.tripStatus === 'IDLE') {
            employeeForm = (
                <form className="form-signin" onSubmit={this.requestCab.bind(this)}>
                    <select
                      className="form-control m-b-10"
                      onChange={this.handleLocationChange.bind(this)}
                      value={this.state.selectedLocation}
                    >
                        <option>Choose Location</option>
                        {
                            _.map(this.props.locations, (item) => {
                                return <option value={item.name}>{item.name}</option>;
                            })
                        }
                    </select>
                    <input className="form-control" type="text" value={this.state.region} disabled />
                    <select
                      className="form-control m-b-10"
                      onChange={this.handleSlotChange.bind(this)}
                      value={this.state.selectedSlot}
                    >
                        <option>Select Slot</option>
                        {
                            _.map(this.props.slots, (item) => {
                                return <option value={item.slot}>{item.slot}</option>;
                            })
                        }
                    </select>
                    <input className="btn btn-success centered w-100" type="submit" value="Confirm Trip" />
                </form>
            );
        } else if (this.state.sessionData.tripStatus === 'REQUESTED') {
            employeeForm = (
                <div>
                    <h5 className="centered">Cab Requested</h5>
                    <h6 className="centered">Will Update Cab Details..</h6>
                </div>
            );
        } else if (this.state.sessionData.tripStatus === 'ALLOTTED' && !_.isEmpty(_.get(trip, '[0]'))) {
            employeeForm = (<div>
                <div className="m-t-20 panel panel-info">
                    <div className="panel-heading">
                        <h5 className="centered">Cab Allotted</h5>
                    </div>
                    <div className="panel-body">
                        <h5 className="centered">Your Allotted Cab Details</h5>
                        <h4 className="centered">{trip[0].driver.cabNo}</h4>
                    </div>
                    <div className="m-10">
                        <div className="pull-right">{trip[0].driver.cabNo}</div>
                        <div>Route: {trip[0].region}</div>
                        <div className="pull-right">Vendor: {trip[0].vendor}</div>
                        <div>Slot: {trip[0].slot}</div>
                    </div>
                </div>
            </div>);
        }
        return (
            <div className="container">
                <Notifications />
                <div className="card-login card-container">
                    <Link to="/" className="pull-right">logout</Link>
                    {(this.state.sessionData.tripStatus === 'IDLE') ? <h4 className="centered">Book Your Cab Here</h4> : ''}
                    <div className="well well-sm">
                        <h5 className="pull-right">
                            Employer: <br />{_.get(this.state, 'sessionData.companyName', '')}
                        </h5>
                        <h5>
                            Name: <br />{_.get(this.state, 'sessionData.name', '')}
                        </h5>
                        <h5 className="pull-right">
                            Employee code: <br />{_.get(this.state, 'sessionData.employeeCode', '')}
                        </h5>
                        <h5>
                            Pickup Location: <br />{_.get(this.state, 'sessionData.pickupLocation.name', '')}
                        </h5>
                    </div>
                        {employeeForm}
                </div>
            </div>
        );
    }
}
Employee.propTypes = {
    getUser: PropTypes.func.isRequired,
    requestCab: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
    slots: PropTypes.array.isRequired,
    getLocation: PropTypes.func.isRequired,
    getSlot: PropTypes.func.isRequired,
    locations: PropTypes.array.isRequired,
    getTrip: PropTypes.func.isRequired,
    trips: PropTypes.array.isRequired,
};
export default connect(mapStateToProps, { getUser, getSlot, getLocation, getTrip, requestCab })(Employee);
