import { getUser, readyForTrip } from '../../redux/actions/userAction';
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
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Company 1</td>
                                                <td>Emp01</td>
                                                <td>SOUTH</td>
                                                <td>TAMBARAM</td>
                                                <td>SST087</td>
                                                <td>12/05/2018</td>
                                                <td><input type="button" className="btn btn-sm" value="Request Payment" /></td>
                                            </tr>
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
};
export default connect(mapStateToProps, { getUser, getSlot, getLocation, readyForTrip })(Vendor);
