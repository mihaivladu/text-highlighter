import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextArea from './TextArea';
import CommentHandler from './CommentHandler';
import CommentArea from './CommentArea';

import styles from './index.scss';

const TextHighlighting = (props) => {
    const {currentSelection, viewCommentBox, selections, textAreaRef, children} = props;

    // Reduce the top by 40 because of the padding and margins above the div.
    const commentHandlerPosition = {
        top: `${currentSelection && currentSelection.rectangles[0].top - 40 || 0}px`,
        right: '-30px'
    };

    const commentAreaPosition = {
        top: `${currentSelection && currentSelection.rectangles[0].top - 40 || 0}px`,
        right: '-262px'
    };

    return (
        <div className={styles['highlighting-container']}>
            <TextArea>{children}</TextArea>

            {
                currentSelection && !viewCommentBox &&
                <CommentHandler position={commentHandlerPosition} /> ||
                null
            }

            {
                viewCommentBox &&
                <CommentArea position={commentAreaPosition} /> ||
                null
            }
        </div>
    );
};

TextHighlighting.displayName = 'TextHighlighting';

TextHighlighting.props = {
    currentSelection: PropTypes.object,
    viewCommentBox: PropTypes.bool,
    selections: PropTypes.array
};

const mapStateToProps = (state) => {
    const {currentSelection, viewCommentBox, selections} = state;

    return {
        currentSelection,
        viewCommentBox,
        selections
    };
};

export default connect(mapStateToProps)(TextHighlighting);