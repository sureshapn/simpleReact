import { combineReducers } from 'redux';
import user from './reducers/user';
import common from './reducers/common';
import { routerReducer } from 'react-router-redux';
export default combineReducers({
    user,
    common,
    router: routerReducer,
});
