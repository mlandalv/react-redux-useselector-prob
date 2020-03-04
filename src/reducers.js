export const nameReducer = (state = '', action) => {
    return action.type === 'SET_NAME' ? action.payload : state;
};

export const counterReducer = (state = 0, action) => {
    return action.type === 'SET_COUNTER' ? action.payload : state;
};
