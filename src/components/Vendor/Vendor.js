import { getUser, readyForTrip, getTrip, makePayment } from '../../redux/actions/userAction';
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
class Vendor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionData: {},
        };
    }

    componentWillMount() {
        this.props.getTrip({}, () => {});
        this.setState(Object.assign({}, {
            sessionData: JSON.parse(sessionStorage.getItem('userData')),
        }), () => {
            if (_.get(this.state, 'sessionData.type') !== 'VENDOR') {
                sessionStorage.setItem('userData', JSON.stringify({}));
                this.props.history.push('/login');
            }
        });
    }
    componentWillReceiveProps() {
    }

    makePayment(evt) {
        this.props.makePayment({
            query: { _id: evt.target.id },
            updateData: { tripStatus: 'PAYMENT_REQUESTED' },
        }, () => {
            this.props.getTrip({}, () => {});
        });
    }
    render() {
        return (
            <div>
                <Notifications />
                <section id="container" >
                    <header className="header black-bg">
                        <a href="#" className="logo"><b>VENDOR</b></a>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <Link to="/" className="pull-right glyphicon glyphicon-log-in">logout</Link>
                            </li>
                        </ul>
                    </header>
                    <aside>
                        <div id="sidebar" className="nav-collapse ">
                            <ul className="sidebar-menu" id="nav-accordion">
                                <li className="mt">
                                    <a className="active" href="/admin">
                                        <i className="fa fa-dashboard"></i>
                                        <span>Trips</span>
                                    </a>
                                </li>
                                <li className="mt">
                                    <a href="/admin">
                                        <i className="fa fa-cog"></i>
                                        <span>Request Payment</span>
                                    </a>
                                </li>
                                <li className="mt">
                                    <a href="#" >
                                        <i className=" fa fa-bar-chart-o"></i>
                                        <span>Cabs</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </aside>
                    <section id="main-content" style={{ 'margin-left': '210px' }}>
                        <section className="wrapper">
                            <div className="row">
                                <div className="col-md-12 col-sm-12">
                                    <h2>Trip History</h2>
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Company</th>
                                                <th>Employee Code</th>
                                                <th>Region</th>
                                                <th>Dropping Point</th>
                                                <th>Cab No</th>
                                                <th>Trip Date</th>
                                                <th>Amount</th>
                                                <th>Payment Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {_.map(_.get(this.props, 'trips', []), trip => {
                                            return _.map(trip.employees, (employee, key) => {
                                                return (<tr>
                                                    <td>{trip.driver.companyName}</td>
                                                    <td>{employee.employeeCode}</td>
                                                    <td>{trip.region}</td>
                                                    <td>{trip.availableEmployees[key].location}</td>
                                                    <td>{trip.driver.cabNo}</td>
                                                    <td>{trip.createdAt.slice(0, 10)}</td>
                                                    <td>{trip.availableEmployees[key].amount}</td>
                                                    <td>{trip.availableEmployees[key].paymentStatus}</td>
                                                    {(trip.availableEmployees[key].amount > 0 && trip.availableEmployees[key].paymentStatus === 'NOT PAID')
                                                    ? <td>
                                                        <input type="button" id={trip.availableEmployees[key]._id} onClick={this.makePayment.bind(this)} className="btn btn-sm btn-success" value="Request Payment" />
                                                    </td> : ''
                                                    }
                                                </tr>);
                                            });
                                        })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </section>
                </section>
            </div>
        );
    }
}
Vendor.propTypes = {
    getUser: PropTypes.func.isRequired,
    readyForTrip: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
    slots: PropTypes.array.isRequired,
    getLocation: PropTypes.func.isRequired,
    getSlot: PropTypes.func.isRequired,
    locations: PropTypes.array.isRequired,
    getTrip: PropTypes.func.isRequired,
    makePayment: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { getUser, getSlot, getLocation, getTrip, makePayment, readyForTrip })(Vendor);
