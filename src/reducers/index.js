import {
    SET_CURRENT_SELECTION,
    REMOVE_CURRENT_SELECTION,
    OPEN_COMMENT_AREA,
    CLOSE_COMMENT_AREA,
    SUBMIT_COMMENT,
    SET_TEXT_AREA_REF
} from '../actions/types';

let id = 0;

const data = (state = {
    textAreaRef: null,
    currentSelection: null,
    viewCommentBox: false,
    selections: []
}, action = {}) => {
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
            currentSelection: null,
            viewCommentBox: false,
            selections: [
                ...state.selections,
                {
                    ...state.currentSelection,
                    id: ++id,
                    comment: action.comment
                }
            ]
        };
    }

    if (action.type === SET_TEXT_AREA_REF) {
        return {
            ...state,
            textAreaRef: action.textAreaRef
        };
    }

    return state;
};

export default data;