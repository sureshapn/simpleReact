import { getUser } from '../../redux/actions/userAction';
import { getSlot, getLocation } from '../../redux/actions/commonAction';
import * as _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Notifications, { notify } from 'react-notify-toast';
const loginImage = require('../../assets/img/login.png');
const mapStateToProps = state => {
    return {
        user: state.user.user,
    };
};
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
        };
    }

    componentWillMount() {
        this.props.getSlot();
        this.props.getLocation();
        sessionStorage.setItem('userData', JSON.stringify({}));
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
    handleFormSubmit(evt) {
        evt.preventDefault();
        this.props.getUser({ userName: this.state.userName, passwd: this.state.passwd }, (res) => {
            if (!_.isEmpty(res)) {
                sessionStorage.setItem('userData', JSON.stringify(res));
                switch (res.type) {
                case 'EMPLOYEE':
                    this.props.history.push('/employee');
                    break;
                case 'DRIVER':
                    this.props.history.push('/driver');
                    break;
                case 'VENDOR':
                    this.props.history.push('/vendor');
                    break;
                case 'ADMIN':
                    window.location = '/admin';
                    break;
                case 'EMPLOYER':
                    this.props.history.push('/employer');
                    break;
                default:
                    this.props.history.push('/login');
                    break;
                }
            } else {
                notify.show('Invalid Login', 'warning');
            }
        });
    }
    render() {
        return (
            <div>
                <Notifications />
                <div className="container">
                    <div className="card-login card-container">
                        <img id="profile-img" className="profile-img-card" src={loginImage} alt="not found" />
                        <p id="profile-name" className="profile-name-card"></p>
                        <form className="form-signin" onSubmit={this.handleFormSubmit.bind(this)}>
                            <span id="reauth-email" className="reauth-email"></span>
                            <input type="text" id="userName" className="form-control" placeholder="Email address" value={_.get(this.state, 'userName', '')} onChange={this.handleChange.bind(this)} required autoFocus />
                            <input type="password" id="passwd" className="form-control" placeholder="Password" value={_.get(this.state, 'passwd', '')} onChange={this.handleChange.bind(this)} required />
                            <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit">Sign in</button>
                        </form>
                        <a href="" className="forgot-password">
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
Login.propTypes = {
    getUser: PropTypes.func.isRequired,
    getLocation: PropTypes.func.isRequired,
    getSlot: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
};
export default connect(mapStateToProps, { getUser, getSlot, getLocation })(Login);
