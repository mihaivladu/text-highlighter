import { ADD_NEW_SELECTION } from '../actions/types';

const data = (state = [], action = {}) => {
    if (action.type === ADD_NEW_SELECTION) {
        return [
            ...state,
            {
                from: action.from,
                to: action.to,
                text: action.text
            }
        ];
    }

    return state;
};

export default data;