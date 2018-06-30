const defaultState = {
    user: {},
    availableCabs: [],
    availableEmployees: [],
    trips: [],
};
export default (state = defaultState, action) => {
    switch (action.type) {
    case 'SET_USER':
        return {
            ...state,
            user: action.user,
        };
    case 'SET_AVAIL_CAB':
        return {
            ...state,
            availableCabs: action.cabs,
        };
    case 'SET_AVAIL_EMP':
        return {
            ...state,
            availableEmployees: action.employees,
        };
    case 'SET_TRIP':
        return {
            ...state,
            trips: action.trips,
        };
    case 'SET_EMPTY':
        return {
            ...state,
            user: {},
            availableCabs: [],
            availableEmployees: [],
            trips: [],
        };
    default:
        return state;
    }
};
