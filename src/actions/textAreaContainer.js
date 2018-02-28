import { SET_TEXT_AREA_REF } from './types';

const setTextAreaRefUD = (props) => {
    return {
        type: SET_TEXT_AREA_REF,
        ...props
    };
};

export const setTextAreaRef = (props) => {
    return (dispatch) => {
        dispatch(setTextAreaRefUD(props));
    };
};