const defaultState = {
    appName: 'Cab-Booking',
    location: {},
    slot: {},
};
export default (state = defaultState, action) => {
    switch (action.type) {
    case 'SET_LOCATION':
        return {
            ...state,
            location: action.location,
        };
    case 'SET_SLOT':
        return {
            ...state,
            slot: action.slot,
        };
    default:
        return state;
    }
};
