import { REMOVE_CURRENT_SELECTION, SET_CURRENT_SELECTION } from './types';

/* Set current selection. */
const setCurrentSelectionUD = (props) => {
    return {
        type: SET_CURRENT_SELECTION,
        ...props
    };
};

export const setCurrentSelection = (props) => {
    return (dispatch) => {
        dispatch(setCurrentSelectionUD(props));
    };
};

/* Remove current selection. */
const removeCurrentSelectionUD = () => {
    return {
        type: REMOVE_CURRENT_SELECTION
    };
};

export const removeCurrentSelection = () => {
    return (dispatch) => {
        dispatch(removeCurrentSelectionUD());
    };
};