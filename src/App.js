import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Employee from './components/Employee/Employee';
import 'bootstrap/dist/css/bootstrap.css';
import Driver from './components/Driver/Driver';
import Admin from './components/Admin/Admin';
import Employer from './components/Employer/Employer';
import Vendor from './components/Vendor/Vendor';
class App extends Component {
    componentWillReceiveProps() {

    }
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/employee" component={Employee} withRouter />
                <Route exact path="/driver" component={Driver} />
                <Route exact path="/admin" component={Admin} />
                <Route exact path="/employer" component={Employer} />
                <Route exact path="/vendor" component={Vendor} />
                <Route exact path="**" component={Login} />
            </Switch>
        );
    }
}
export default App;
