import { ADD_NEW_SELECTION } from './types';

const addNewSelectionUndispatched = (props) => {
    return {
        type: ADD_NEW_SELECTION,
        ...props
    };
};

export const addNewSelection = (props) => {
    return (dispatch) => {
        return dispatch(addNewSelectionUndispatched(props));
    };
};