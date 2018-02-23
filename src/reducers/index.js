import {} from '../actions/types';
import {
    SET_CURRENT_SELECTION,
    REMOVE_CURRENT_SELECTION,
    OPEN_COMMENT_AREA,
    CLOSE_COMMENT_AREA,
    SUBMIT_COMMENT
} from '../actions/types';

const data = (state = {
    currentSelection: null,
    viewCommentBox: false,
    selections: []
}, action = {}) => {
    if (action.type === SET_CURRENT_SELECTION) {
        const {from, to, text, rectangles} = action;

        return {
            ...state,
            currentSelection: {
                from,
                to,
                text,
                rectangles
            },
            viewCommentBox: false
        };
    }

    if (action.type === REMOVE_CURRENT_SELECTION) {
        return {
            ...state,
            currentSelection: null,
            viewCommentBox: false
        };
    }

    if (action.type === OPEN_COMMENT_AREA) {
        return {
            ...state,
            viewCommentBox: true
        };
    }

    if (action.type === CLOSE_COMMENT_AREA) {
        return {
            ...state,
            viewCommentBox: false
        };
    }

    if (action.type === SUBMIT_COMMENT) {
        return {
            currentSelection: null,
            viewCommentBox: false,
            selections: [
                ...state.selections,
                {
                    ...state.currentSelection,
                    comment: action.comment
                }
            ]
        };
    }

    return state;
};

export default data;