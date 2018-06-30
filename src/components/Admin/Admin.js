import { getUser, getAvailableCabs, getAvailableEmployees, allocateSeat, createTrip, setEmpty } from '../../redux/actions/userAction';
import * as _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import config from '../../config';
const mapStateToProps = state => {
    return {
        user: state.user.user,
        availableCabs: state.user.availableCabs,
        availableEmployees: state.user.availableEmployees,
    };
};
class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionData: {},
            allocationTable: {
                NORTH: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
                EAST: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
                WEST: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
                SOUTH: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
            },
            emptyAllocationTable: {
                NORTH: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
                EAST: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
                WEST: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
                SOUTH: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
            },
            availableCabs: [],
            availableEmployees: [],
        };
        this.seatAllocation = this.seatAllocation.bind(this);
        this.createTrip = this.createTrip.bind(this);
        this.socketFunction = this.socketFunction.bind(this);
    }

    componentWillMount() {
        this.props.getAvailableCabs({}, () => {});
        this.props.getAvailableEmployees({}, () => {});
        this.setState(Object.assign({}, {
            sessionData: JSON.parse(sessionStorage.getItem('userData')),
        }), () => {
            if (_.get(this.state, 'sessionData.type') !== 'ADMIN') {
                sessionStorage.setItem('userData', JSON.stringify({}));
                this.props.history.push('/login');
            }
            this.props.getUser({ _id: this.state.sessionData._id }, (user) => {
                sessionStorage.setItem('userData', JSON.stringify(user));
            });
        });
    }

    componentDidMount() {

    }

    componentWillReceiveProps(props) {
        const self = this;
        this.setState(Object.assign({}, {
            availableCabs: _.get(props, 'availableCabs', []),
            availableEmployees: _.get(props, 'availableEmployees', []),
            allocationTable: {
                NORTH: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
                EAST: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
                WEST: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
                SOUTH: {
                    employees: [],
                    cab: {},
                    slot: '',
                    seats: -1,
                },
            },
        }), () => {
            if (!_.isEmpty(_.get(this.state, 'availableEmployees', []))) {
                self.setState(Object.assign({}, {
                    allocationTable: self.state.emptyAllocationTable,
                }), () => {
                    self.seatAllocation();
                });
            }
        });
    }

    componentWillUnmount() {
        this.props.setEmpty();
    }

    seatAllocation() {
        const newState = Object.assign({}, this.state);
        _.forEach(_.get(newState, 'availableEmployees', []), (employee, index) => {
            if (newState.allocationTable[employee.region].seats < 0 && !_.isEmpty(_.find(newState.availableCabs, { isAllotted: false }))) {
                if (_.isEmpty(_.find(newState.allocationTable[employee.region].employees, { name: employee.name }))) {
                    newState.allocationTable[employee.region].employees.push(employee);
                }
                newState.allocationTable[employee.region].slot = employee.slot;
                newState.allocationTable[employee.region].cab = newState.availableCabs[_.findIndex(newState.availableCabs, { isAllotted: false })].cab;
                newState.allocationTable[employee.region].cabId = newState.availableCabs[_.findIndex(newState.availableCabs, { isAllotted: false })]._id;
                newState.availableCabs[_.findIndex(newState.availableCabs, { isAllotted: false })].isAllotted = true;
                newState.availableEmployees[index].isAllotted = true;
                newState.allocationTable[employee.region].seats = 1;
            } else if (!_.isEmpty(newState.allocationTable[employee.region].cab) && newState.allocationTable[employee.region].slot === employee.slot && _.get(newState.allocationTable[employee.region].cab, 'seats') > newState.allocationTable[employee.region].employees.length) {
                newState.availableEmployees[index].isAllotted = true;
                if (_.isEmpty(_.find(newState.allocationTable[employee.region].employees, { name: employee.name }))) {
                    newState.allocationTable[employee.region].employees.push(employee);
                }
                newState.allocationTable[employee.region].employees.push(employee);
            }
            newState.allocationTable.NORTH.employees = _.unionBy(newState.allocationTable.NORTH.employees, 'user.name');
            newState.allocationTable.SOUTH.employees = _.unionBy(newState.allocationTable.SOUTH.employees, 'user.name');
            newState.allocationTable.EAST.employees = _.unionBy(newState.allocationTable.EAST.employees, 'user.name');
            newState.allocationTable.WEST.employees = _.unionBy(newState.allocationTable.WEST.employees, 'user.name');
            this.setState(newState, () => {
            });
        });
    }

    createTrip(evt) {
        const allocationTableData = this.state.allocationTable[evt.target.id];
        const availableEmployeeIds = _.map(allocationTableData.employees, item => {
            return item._id;
        });
        const employeeIds = _.map(allocationTableData.employees, item => {
            return item.user._id;
        });
        const companyNames = _.map(allocationTableData.employees, item => {
            return item.user.companyName;
        });
        const tripData = {
            availableEmployees: availableEmployeeIds,
            employees: employeeIds,
            driver: allocationTableData.cab._id,
            availableDriverId: allocationTableData.cabId,
            vendor: allocationTableData.cab.companyName,
            employers: companyNames,
            slot: allocationTableData.slot,
            region: evt.target.id,
        };
        this.props.createTrip(tripData, () => {
            this.props.getAvailableCabs({}, () => {});
            this.props.getAvailableEmployees({}, () => {});
            const socket = socketIOClient(config.socketUrl);
            socket.emit('updated', 'admin');
        });
    }

    socketFunction() {
        window.location.reload(true);
    }

    render() {
        const socket = socketIOClient(config.socketUrl);
        socket.on('updated', (data) => {
            if (data !== 'admin') {
                this.socketFunction();
            }
        });
        return (
            <div>
                <section id="container" >
                    <header className="header black-bg">
                        <a href="#" className="logo"><b>CAB SEAT</b></a>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <Link to="/" className="pull-right glyphicon glyphicon-log-in">logout</Link>
                            </li>
                        </ul>
                    </header>
                    <section>
                        <section className="wrapper">
                            <div className="row">
                                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                    <div className="panel panel-default border-panel card-view">
                                        <div className="panel-heading c-list">
                                            <span className="title">Waiting Employees</span>
                                        </div>
                                        <ul className="list-group overflow-auto" id="contact-list">
                                            {(!_.isEmpty(_.get(this.state, 'availableEmployees', []))) ?
                                                _.map(_.get(this.state, 'availableEmployees', []), item => {
                                                    return (
                                                        <li className={item.isAllotted ? 'list-group-item b-b-1 is-allotted' : 'list-group-item b-b-1'}>
                                                            <div className="col-xs-12 col-sm-3">
                                                                <img src={_.get(item, 'user.imageUrl', '')} alt="Scott Stevens" className="img-responsive img-circle" />
                                                            </div>
                                                            <div className="col-xs-12 col-sm-9">
                                                                <span className="name">{_.get(item, 'user.name', '')}</span><br />
                                                                <div className="well well-sm">
                                                                    <h5 className="pull-right">Dropping: {_.get(item, 'location', '')}</h5>
                                                                    <h5>Company Name: {_.get(item, 'user.companyName', '')}</h5>
                                                                    <h5 className="pull-right">Slot: {_.get(item, 'slot', '')}</h5>
                                                                    <h5>Region: {_.get(item, 'region', '')}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="clearfix"></div>
                                                        </li>
                                                    );
                                                }) :
                                                <li className="list-group-item">
                                                    <h4>No Data Found</h4>
                                                </li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12"><br />
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-1 col-md-1 col-sm-6 col-xs-12">
                                                </div>
                                                <div className="col-lg-10 col-md-10 col-sm-6 col-xs-12">
                                                    <div className="m-h-200 panel panel-default panel-front">
                                                        {
                                                            (!_.isEmpty(this.state.allocationTable.NORTH.employees)) ?
                                                                <div>
                                                                    <div className="panel-heading">
                                                                        <h4 className="panel-title">
                                                                            <div className="row">
                                                                            {
                                                                                _.map(_.range(0, _.get(this.state, 'allocationTable.NORTH.cab.seats', 0)), (item, index) => {
                                                                                    return (<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                                                                        <svg
                                                                                          version="1.1"
                                                                                          id="Capa_1"
                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                          x="0px"
                                                                                          y="0px"
                                                                                          stroke="black"
                                                                                          fill={(_.get(this.state, `allocationTable.NORTH.employees[${index}]`)) ? 'green' : 'white'}
                                                                                          viewBox="0 0 240.235 240.235"
                                                                                          style={{ 'enable-background': 'new 0 0 240.235 240.235' }}
                                                                                        >
                                                                                            <path
                                                                                              d="M211.744,6.089C208.081,2.163,203.03,0,197.52,0h-15.143c-11.16,0-21.811,8.942-23.74,19.934l-0.955,5.436
                                                                                            c-0.96,5.47,0.332,10.651,3.639,14.589c3.307,3.938,8.186,6.106,13.74,6.106h19.561c2.714,0,5.339-0.542,7.778-1.504l-2.079,17.761
                                                                                            c-2.001-0.841-4.198-1.289-6.507-1.289h-22.318c-9.561,0-18.952,7.609-20.936,16.961l-19.732,93.027l-93.099-6.69
                                                                                            c-5.031-0.36-9.231,1.345-11.835,4.693c-2.439,3.136-3.152,7.343-2.009,11.847l10.824,42.618
                                                                                            c2.345,9.233,12.004,16.746,21.53,16.746h78.049h1.191h39.729c9.653,0,18.336-7.811,19.354-17.411l15.272-143.981
                                                                                            c0.087-0.823,0.097-1.634,0.069-2.437l5.227-44.648c0.738-1.923,1.207-3.967,1.354-6.087l0.346-4.97
                                                                                            C217.214,15.205,215.407,10.016,211.744,6.089z"
                                                                                            />
                                                                                        </svg>
                                                                                        <h5> {(_.get(this.state, `allocationTable.NORTH.employees[${index}]`)) ? (_.get(this.state, `allocationTable.NORTH.employees[${index}].user.name`)) : ''}</h5>
                                                                                    </div>);
                                                                                })
                                                                            }
                                                                            </div>
                                                                        </h4>
                                                                    </div>
                                                                    <div className="panel-body">
                                                                        <h4 className="centered">{_.get(this.state, 'allocationTable.NORTH.cab.cabNo', '')}</h4>
                                                                        <p className="pull-right">Route: North</p>
                                                                        <p>Total Seats: {_.get(this.state, 'allocationTable.NORTH.cab.seats', '')}</p>
                                                                        <p className="pull-right">Vendor: {_.get(this.state, 'allocationTable.NORTH.cab.companyName', '')}</p>
                                                                        <p>Slot: {_.get(this.state, 'allocationTable.NORTH.slot', '')}</p>
                                                                    </div>
                                                                    <div className="centered m-b-10">
                                                                        <input type="button" id="NORTH" onClick={this.createTrip.bind(this)} className="btn btn-success" value="Initiate Trip" />
                                                                    </div>
                                                                </div>
                                                                :
                                                                <h4 className="centered">North Region</h4>
                                                            }
                                                    </div>
                                                </div>
                                                <div className="col-lg-1 col-md-1 col-sm-6 col-xs-12">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-1 col-md-1 col-sm-6 col-xs-12">
                                                </div>
                                                <div className="col-lg-10 col-md-10 col-sm-6 col-xs-12">
                                                    <div className="m-h-200 panel panel-default panel-front">
                                                        {
                                                            (!_.isEmpty(this.state.allocationTable.EAST.employees)) ?
                                                                <div>
                                                                    <div className="panel-heading">
                                                                        <h4 className="panel-title">
                                                                            <div className="row">
                                                                                {
                                                                                    _.map(_.range(0, _.get(this.state, 'allocationTable.EAST.cab.seats', 0)), (item, index) => {
                                                                                        return (<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                                                                            <svg
                                                                                              version="1.1"
                                                                                              id="Capa_1"
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              x="0px"
                                                                                              y="0px"
                                                                                              stroke="black"
                                                                                              fill={(_.get(this.state, `allocationTable.EAST.employees[${index}]`)) ? 'green' : 'white'}
                                                                                              viewBox="0 0 240.235 240.235"
                                                                                              style={{ 'enable-background': 'new 0 0 240.235 240.235' }}
                                                                                            >
                                                                                                <path
                                                                                                  d="M211.744,6.089C208.081,2.163,203.03,0,197.52,0h-15.143c-11.16,0-21.811,8.942-23.74,19.934l-0.955,5.436
                                                                                                c-0.96,5.47,0.332,10.651,3.639,14.589c3.307,3.938,8.186,6.106,13.74,6.106h19.561c2.714,0,5.339-0.542,7.778-1.504l-2.079,17.761
                                                                                                c-2.001-0.841-4.198-1.289-6.507-1.289h-22.318c-9.561,0-18.952,7.609-20.936,16.961l-19.732,93.027l-93.099-6.69
                                                                                                c-5.031-0.36-9.231,1.345-11.835,4.693c-2.439,3.136-3.152,7.343-2.009,11.847l10.824,42.618
                                                                                                c2.345,9.233,12.004,16.746,21.53,16.746h78.049h1.191h39.729c9.653,0,18.336-7.811,19.354-17.411l15.272-143.981
                                                                                                c0.087-0.823,0.097-1.634,0.069-2.437l5.227-44.648c0.738-1.923,1.207-3.967,1.354-6.087l0.346-4.97
                                                                                                C217.214,15.205,215.407,10.016,211.744,6.089z"
                                                                                                />
                                                                                            </svg>
                                                                                            <h5> {(_.get(this.state, `allocationTable.EAST.employees[${index}]`)) ? (_.get(this.state, `allocationTable.EAST.employees[${index}].user.name`)) : ''}</h5>
                                                                                        </div>);
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </h4>
                                                                    </div>
                                                                    <div className="panel-body">
                                                                        <h4 className="centered">{_.get(this.state, 'allocationTable.EAST.cab.cabNo', '')}</h4>
                                                                        <p className="pull-right">Route: East</p>
                                                                        <p>Total Seats: {_.get(this.state, 'allocationTable.EAST.cab.seats', '')}</p>
                                                                        <p className="pull-right">Vendor: {_.get(this.state, 'allocationTable.EAST.cab.companyName', '')}</p>
                                                                        <p>Slot: {_.get(this.state, 'allocationTable.EAST.slot', '')}</p>
                                                                    </div>
                                                                    <div className="centered m-b-10">
                                                                        <input type="button" id="EAST" onClick={this.createTrip.bind(this)} className="btn btn-success" value="Initiate Trip" />
                                                                    </div>
                                                                </div>
                                                                :
                                                                <h4 className="centered">East Region</h4>
                                                            }
                                                    </div>
                                                </div>
                                                <div className="col-lg-1 col-md-1 col-sm-6 col-xs-12">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-1 col-md-1 col-sm-6 col-xs-12">
                                                </div>
                                                <div className="col-lg-10 col-md-10 col-sm-6 col-xs-12">
                                                    <div className="m-h-200 panel panel-default panel-front">
                                                        {
                                                            (!_.isEmpty(this.state.allocationTable.WEST.employees)) ?
                                                                <div>
                                                                    <div className="panel-heading">
                                                                        <h4 className="panel-title">
                                                                            <div className="row">
                                                                                {
                                                                                    _.map(_.range(0, _.get(this.state, 'allocationTable.WEST.cab.seats', 0)), (item, index) => {
                                                                                        return (<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                                                                            <svg
                                                                                              version="1.1"
                                                                                              id="Capa_1"
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              x="0px"
                                                                                              y="0px"
                                                                                              stroke="black"
                                                                                              fill={(_.get(this.state, `allocationTable.WEST.employees[${index}]`)) ? 'green' : 'white'}
                                                                                              viewBox="0 0 240.235 240.235"
                                                                                              style={{ 'enable-background': 'new 0 0 240.235 240.235' }}
                                                                                            >
                                                                                                <path
                                                                                                  d="M211.744,6.089C208.081,2.163,203.03,0,197.52,0h-15.143c-11.16,0-21.811,8.942-23.74,19.934l-0.955,5.436
                                                                                                c-0.96,5.47,0.332,10.651,3.639,14.589c3.307,3.938,8.186,6.106,13.74,6.106h19.561c2.714,0,5.339-0.542,7.778-1.504l-2.079,17.761
                                                                                                c-2.001-0.841-4.198-1.289-6.507-1.289h-22.318c-9.561,0-18.952,7.609-20.936,16.961l-19.732,93.027l-93.099-6.69
                                                                                                c-5.031-0.36-9.231,1.345-11.835,4.693c-2.439,3.136-3.152,7.343-2.009,11.847l10.824,42.618
                                                                                                c2.345,9.233,12.004,16.746,21.53,16.746h78.049h1.191h39.729c9.653,0,18.336-7.811,19.354-17.411l15.272-143.981
                                                                                                c0.087-0.823,0.097-1.634,0.069-2.437l5.227-44.648c0.738-1.923,1.207-3.967,1.354-6.087l0.346-4.97
                                                                                                C217.214,15.205,215.407,10.016,211.744,6.089z"
                                                                                                />
                                                                                            </svg>
                                                                                            <h5> {(_.get(this.state, `allocationTable.WEST.employees[${index}]`)) ? (_.get(this.state, `allocationTable.WEST.employees[${index}].user.name`)) : ''}</h5>
                                                                                        </div>);
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </h4>
                                                                    </div>
                                                                    <div className="panel-body">
                                                                        <h4 className="centered">{_.get(this.state, 'allocationTable.WEST.cab.cabNo', '')}</h4>
                                                                        <p className="pull-right">Route: West</p>
                                                                        <p>Total Seats: {_.get(this.state, 'allocationTable.WEST.cab.seats', '')}</p>
                                                                        <p className="pull-right">Vendor: {_.get(this.state, 'allocationTable.WEST.cab.companyName', '')}</p>
                                                                        <p>Slot: {_.get(this.state, 'allocationTable.WEST.slot', '')}</p>
                                                                    </div>
                                                                    <div className="centered m-b-10">
                                                                        <input type="button" id="WEST" onClick={this.createTrip.bind(this)} className="btn btn-success" value="Initiate Trip" />
                                                                    </div>
                                                                </div>
                                                                :
                                                                <h4 className="centered">West Region</h4>
                                                            }
                                                    </div>
                                                </div>
                                                <div className="col-lg-1 col-md-1 col-sm-6 col-xs-12">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="row">
                                                <div className="col-lg-1 col-md-1 col-sm-6 col-xs-12">
                                                </div>
                                                <div className="col-lg-10 col-md-10 col-sm-6 col-xs-12">
                                                    <div className="m-h-200 panel panel-default panel-front">
                                                        {
                                                            (!_.isEmpty(this.state.allocationTable.SOUTH.employees)) ?
                                                                <div>
                                                                    <div className="panel-heading">
                                                                        <h4 className="panel-title">
                                                                            <div className="row">
                                                                                {
                                                                                    _.map(_.range(0, _.get(this.state, 'allocationTable.SOUTH.cab.seats', 0)), (item, index) => {
                                                                                        return (<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                                                                            <svg
                                                                                              version="1.1"
                                                                                              id="Capa_1"
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              x="0px"
                                                                                              y="0px"
                                                                                              stroke="black"
                                                                                              fill={(_.get(this.state, `allocationTable.SOUTH.employees[${index}]`)) ? 'green' : 'white'}
                                                                                              viewBox="0 0 240.235 240.235"
                                                                                              style={{ 'enable-background': 'new 0 0 240.235 240.235' }}
                                                                                            >
                                                                                                <path
                                                                                                  d="M211.744,6.089C208.081,2.163,203.03,0,197.52,0h-15.143c-11.16,0-21.811,8.942-23.74,19.934l-0.955,5.436
                                                                                                c-0.96,5.47,0.332,10.651,3.639,14.589c3.307,3.938,8.186,6.106,13.74,6.106h19.561c2.714,0,5.339-0.542,7.778-1.504l-2.079,17.761
                                                                                                c-2.001-0.841-4.198-1.289-6.507-1.289h-22.318c-9.561,0-18.952,7.609-20.936,16.961l-19.732,93.027l-93.099-6.69
                                                                                                c-5.031-0.36-9.231,1.345-11.835,4.693c-2.439,3.136-3.152,7.343-2.009,11.847l10.824,42.618
                                                                                                c2.345,9.233,12.004,16.746,21.53,16.746h78.049h1.191h39.729c9.653,0,18.336-7.811,19.354-17.411l15.272-143.981
                                                                                                c0.087-0.823,0.097-1.634,0.069-2.437l5.227-44.648c0.738-1.923,1.207-3.967,1.354-6.087l0.346-4.97
                                                                                                C217.214,15.205,215.407,10.016,211.744,6.089z"
                                                                                                />
                                                                                            </svg>
                                                                                            <h5> {(_.get(this.state, `allocationTable.SOUTH.employees[${index}]`)) ? (_.get(this.state, `allocationTable.SOUTH.employees[${index}].user.name`)) : ''}</h5>
                                                                                        </div>);
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </h4>
                                                                    </div>
                                                                    <div className="panel-body">
                                                                        <h4 className="centered">{_.get(this.state, 'allocationTable.SOUTH.cab.cabNo', '')}</h4>
                                                                        <p className="pull-right">Route: South</p>
                                                                        <p>Total Seats: {_.get(this.state, 'allocationTable.SOUTH.cab.seats', '')}</p>
                                                                        <p className="pull-right">Vendor: {_.get(this.state, 'allocationTable.SOUTH.cab.companyName', '')}</p>
                                                                        <p>Slot: {_.get(this.state, 'allocationTable.SOUTH.slot', '')}</p>
                                                                    </div>
                                                                    <div className="centered m-b-10">
                                                                        <input type="button" id="SOUTH" onClick={this.createTrip.bind(this)} className="btn btn-success" value="Initiate Trip" />
                                                                    </div>
                                                                </div>
                                                                :
                                                                <h4 className="centered">South Region</h4>
                                                            }
                                                    </div>
                                                </div>
                                                <div className="col-lg-1 col-md-1 col-sm-6 col-xs-12">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                    <div className="panel panel-default border-panel card-view">
                                        <div className="panel-heading c-list">
                                            <span className="title">Available Cabs</span>
                                        </div>
                                        <ul className="list-group overflow-auto">
                                        {(!_.isEmpty(_.get(this.state, 'availableCabs', []))) ?
                                                _.map(_.get(this.state, 'availableCabs', []), item => {
                                                    return (
                                                        <li className={item.isAllotted ? 'list-group-item b-b-1 is-allotted' : 'list-group-item b-b-1'}>
                                                            <a className="pull-left" href="#">
                                                                <img className="media-object" src={_.get(item, 'cab.imageUrl', '')} width="150px" height="90px" alt="..." />
                                                            </a>
                                                            <div className="media-body p-t-10">
                                                                <h5 className="media-heading">{_.get(item, 'cab.cabNo', '')}</h5>
                                                                <span className="by-author">Persons {_.get(item, 'cab.seats', '')}</span><br />
                                                            </div>
                                                        </li>);
                                                }) :
                                            <li className="list-group-item">
                                                <h4>No Data Found</h4>
                                            </li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                </section>
            </div>
        );
    }
}
Admin.propTypes = {
    getUser: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
    availableCabs: PropTypes.array.isRequired,
    availableEmployees: PropTypes.array.isRequired,
    getAvailableCabs: PropTypes.func.isRequired,
    getAvailableEmployees: PropTypes.func.isRequired,
    allocateSeat: PropTypes.func.isRequired,
    createTrip: PropTypes.func.isRequired,
    setEmpty: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { getUser, getAvailableCabs, getAvailableEmployees, allocateSeat, createTrip, setEmpty })(Admin);
