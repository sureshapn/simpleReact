import { getUser, readyForTrip, getTrip, makePayment, getBlock, setEmpty } from '../../redux/actions/userAction';
import { getSlot, getLocation } from '../../redux/actions/commonAction';
import * as _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Notifications, { notify } from 'react-notify-toast';
import socketIOClient from 'socket.io-client';
import { Modal, Button } from 'react-bootstrap';
import config from '../../config';
const mapStateToProps = state => {
    return {
        user: state.user.user,
        slots: state.common.slot,
        locations: state.common.location,
        trips: state.user.trips,
        paymentEmployeeId: '',
    };
};
class Employer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionData: {},
            showVerifyModal: false,
            blockData: {},
        };
    }

    componentWillMount() {
        this.props.getTrip({}, () => {});
        this.setState(Object.assign({}, {
            sessionData: JSON.parse(sessionStorage.getItem('userData')),
        }), () => {
            if (_.get(this.state, 'sessionData.type') !== 'EMPLOYER') {
                sessionStorage.setItem('userData', JSON.stringify({}));
                this.props.history.push('/login');
            }
            this.props.getUser({ _id: this.state.sessionData._id }, (user) => {
                sessionStorage.setItem('userData', JSON.stringify(user));
            });
        });
    }
    componentWillReceiveProps() {
    }

    componentWillUnmount() {
        this.props.setEmpty();
    }
    makePayment() {
        this.closeModal();
        notify.show('Payment verified!', 'warning');
        this.props.makePayment({
            query: { _id: this.state.paymentEmployeeId },
            updateData: { tripStatus: 'PAYMENT_ACCEPTED',
                            paymentStatus: 'PAID' },
        }, () => {
            this.props.getTrip({}, () => {});
            const socket = socketIOClient(config.socketUrl);
            socket.emit('updated', 'employer');
        });
    }

    socketFunction() {
        window.location.reload(true);
    }
    closeModal() {
        this.setState(Object.assign({
            showVerifyModal: false,
            paymentEmployeeId: '',
        }));
    }
    showVerifyModal(tripId, evt) {
        const employeeId = evt.target.id;
        this.props.getBlock({ queryData: {
            trip: tripId,
        } }, (res) => {
            this.setState(Object.assign({
                showVerifyModal: true,
                paymentEmployeeId: employeeId,
                blockData: res,
            }));
        });
    }
    render() {
        const socket = socketIOClient(config.socketUrl);
        socket.on('updated', (data) => {
            if (data !== 'employer') {
                this.socketFunction();
            }
        });
        return (
            <div>
                <Notifications />
                <Modal
                  className="modal-container"
                  show={this.state.showVerifyModal}
                  onHide={this.closeModal.bind(this)}
                  bsSize="medium"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Verify Block</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-12">
                                <h4>
                                    Block Information
                                </h4>
                                <p style={{ wordWrap: 'break-word' }}>
                                     {this.state.blockData}
                                </p>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                          id="closeButton"
                          onClick={this.closeModal.bind(this)}
                        >Cancel</Button>
                        <Button
                          id="createModalButton"
                          bsStyle="success"
                          onClick={this.makePayment.bind(this)}
                        >Pay
                        </Button>
                    </Modal.Footer>
                </Modal>
                <section id="container" >
                    <header className="header black-bg">
                        <a href="#" className="logo"><b>EMPLOYER</b></a>
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
                                        <span>Trip History</span>
                                    </a>
                                </li>
                                <li className="mt">
                                    <a href="/admin">
                                        <i className="fa fa-cog"></i>
                                        <span>Payments</span>
                                    </a>
                                </li>
                                <li className="mt">
                                    <a href="#" >
                                        <i className=" fa fa-bar-chart-o"></i>
                                        <span>On Going Trips</span>
                                    </a>
                                </li>
                                <li className="mt">
                                    <a href="#" >
                                        <i className=" fa fa-bar-chart-o"></i>
                                        <span>Employees</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    <section id="main-content" style={{ 'margin-left': '210px' }}>
                        <section className="wrapper">
                            <div className="row">
                                <div className="col-md-12 col-xs-12 col-sm-12 bg-white">
                                    <h2>Trip History</h2>
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Employee Code</th>
                                                <th>Region</th>
                                                <th>Dropping Point</th>
                                                <th>Cab No</th>
                                                <th>Vendor</th>
                                                <th>Time</th>
                                                <th>Amount</th>
                                                <th>Payment Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {_.map(_.get(this.props, 'trips', []), trip => {
                                                return _.map(trip.employees, (employee, key) => {
                                                    return (<tr>
                                                        <td>{employee.name}</td>
                                                        <td>{employee.employeeCode}</td>
                                                        <td>{trip.region}</td>
                                                        <td>{trip.availableEmployees[key].location}</td>
                                                        <td>{trip.driver.cabNo}</td>
                                                        <td>{trip.driver.companyName}</td>
                                                        <td>{trip.createdAt.slice(0, 10)}</td>
                                                        <td>{trip.availableEmployees[key].amount}</td>
                                                        <td>{trip.availableEmployees[key].paymentStatus}</td>
                                                        {(trip.availableEmployees[key].tripStatus === 'PAYMENT_REQUESTED')
                                                    ? <td>
                                                        <input type="button" id={trip.availableEmployees[key]._id} onClick={this.showVerifyModal.bind(this, trip._id)} className="btn btn-sm btn-success" value="Verify and Pay" />
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
Employer.propTypes = {
    getUser: PropTypes.func.isRequired,
    readyForTrip: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
    slots: PropTypes.array.isRequired,
    getLocation: PropTypes.func.isRequired,
    getSlot: PropTypes.func.isRequired,
    locations: PropTypes.array.isRequired,
    getTrip: PropTypes.func.isRequired,
    makePayment: PropTypes.func.isRequired,
    setEmpty: PropTypes.func.isRequired,
    getBlock: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { getUser, getBlock, getSlot, getTrip, makePayment, getLocation, readyForTrip, setEmpty })(Employer);
