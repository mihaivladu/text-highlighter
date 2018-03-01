import {
    SET_CURRENT_SELECTION,
    REMOVE_CURRENT_SELECTION,
    OPEN_COMMENT_AREA,
    CLOSE_COMMENT_AREA,
    SUBMIT_COMMENT,
    SET_RENDERED_DATA
} from '../actions/types';

const data = (state = {
    id: 0,
    wasDataRendered: false,
    currentSelection: null,
    viewCommentBox: false,
    selections: []
}, action = {}) => {
    if (action.type === SET_RENDERED_DATA) {
        return {
            ...state,
            wasDataRendered: true
        };
    }

    if (action.type === SET_CURRENT_SELECTION) {
        const {from, to, text, rectangles} = action;

        return {
            ...state,
            currentSelection: {
                id: 'add_new',
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
            ...state,
            id: state.id + 1,
            currentSelection: null,
            viewCommentBox: false,
            selections: [
                ...state.selections,
                {
                    ...state.currentSelection,
                    id: state.id + 1,
                    comment: action.comment
                }
            ]
        };
    }

    return state;
};

export default data;