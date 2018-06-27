import axios from 'axios';
const config = require('../../config');
export function getSlot() {
    return (dispatch) => {
        axios.get(`${config.apiUrl}getSlot`)
        .then((res) => {
            if (res.data.status === 'success') {
                dispatch({ type: 'SET_SLOT', slot: res.data.data });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };
}

export function getLocation() {
    return (dispatch) => {
        axios.get(`${config.apiUrl}getLocation`)
        .then((res) => {
            if (res.data.status === 'success') {
                dispatch({ type: 'SET_LOCATION', location: res.data.data });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };
}
