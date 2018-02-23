import { OPEN_COMMENT_AREA, CLOSE_COMMENT_AREA, SUBMIT_COMMENT } from './types';

/* Open comment area. */
const openCommentAreaUD = () => {
    return {
        type: OPEN_COMMENT_AREA
    };
};

export const openCommentArea = () => {
    return (dispatch) => {
        dispatch(openCommentAreaUD());
    };
};

/* Close comment area. */
const closeCommentAreaUD = () => {
    return {
        type: CLOSE_COMMENT_AREA
    };
};

export const closeCommentArea = () => {
    return (dispatch) => {
        dispatch(closeCommentAreaUD());
    };
};

/* Submit comment. */
const submitCommentUD = (props) => {
    return {
        type: SUBMIT_COMMENT,
        ...props
    };
};

export const submitComment = (props) => {
    return (dispatch) => {
        dispatch(submitCommentUD(props));
    };
};