import { SET_RENDERED_DATA } from './types';

const setRenderedDataUD = () => {
    return {
        type: SET_RENDERED_DATA
    };
};

export const setRenderedData = () => {
    return (dispatch) => {
        return dispatch(setRenderedDataUD());
    };
};