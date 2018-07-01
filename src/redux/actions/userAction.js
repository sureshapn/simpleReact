import axios from 'axios';
const config = require('../../config');

export function getUser(query, resFn) {
    return (dispatch) => {
        axios.post(`${config.apiUrl}getUser`, { data: query })
        .then((res) => {
            if (res.data.status === 'success') {
                dispatch({ type: 'SET_USER', user: res.data.data });
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function requestCab(userData, resFn) {
    return () => {
        axios.post(`${config.apiUrl}requestCab`, { userData })
        .then((res) => {
            if (res.data.status === 'success') {
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function readyForTrip(userData, resFn) {
    return () => {
        axios.post(`${config.apiUrl}readyForTrip`, { userData })
        .then((res) => {
            if (res.data.status === 'success') {
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function getAvailableCabs(query, resFn) {
    return (dispatch) => {
        axios.get(`${config.apiUrl}availableCab`)
        .then((res) => {
            if (res.data.status === 'success') {
                dispatch({ type: 'SET_AVAIL_CAB', cabs: res.data.data });
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function getAvailableEmployees(query, resFn) {
    return (dispatch) => {
        axios.get(`${config.apiUrl}availableEmployee`)
        .then((res) => {
            if (res.data.status === 'success') {
                dispatch({ type: 'SET_AVAIL_EMP', employees: res.data.data });
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}
export function updateAvailableEmployees(query, resFn) {
    return () => {
        axios.post(`${config.apiUrl}availableEmployee`, { query })
        .then((res) => {
            if (res.data.status === 'success') {
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function allocateSeat(query, resFn) {
    return () => {
        axios.post(`${config.apiUrl}allocateSeat`, { query })
        .then((res) => {
            if (res.data.status === 'success') {
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function createTrip(query, resFn) {
    return () => {
        axios.post(`${config.apiUrl}createTrip`, query)
        .then((res) => {
            if (res.data.status === 'success') {
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function completeTrip(query, resFn) {
    return () => {
        axios.post(`${config.apiUrl}completeTrip`, query)
        .then((res) => {
            if (res.data.status === 'success') {
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function getTrip(query, resFn) {
    return (dispatch) => {
        axios.get(`${config.apiUrl}getTrip`)
        .then((res) => {
            if (res.data.status === 'success') {
                dispatch({ type: 'SET_TRIP', trips: res.data.data });
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function singleAvailableEmployee(query, resFn) {
    return () => {
        axios.post(`${config.apiUrl}singleAvailableEmployee`, query)
        .then((res) => {
            if (res.data.status === 'success') {
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function makePayment(query, resFn) {
    return () => {
        axios.post(`${config.apiUrl}makePayment`, query)
        .then((res) => {
            if (res.data.status === 'success') {
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function getBlock(query, resFn) {
    return () => {
        axios.post(`${config.apiUrl}getBlock`, query)
        .then((res) => {
            if (res.data.status === 'success') {
                resFn(res.data.data);
            } else {
                resFn('');
            }
        })
        .catch(() => {
            resFn('');
        });
    };
}

export function setEmpty() {
    return (dispatch) => {
        dispatch({ type: 'SET_EMPTY' });
    };
}
