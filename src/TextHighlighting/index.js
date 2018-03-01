import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextArea from './TextArea';
import CommentHandler from './CommentHandler';
import CommentArea from './CommentArea';
import Comments from './Comments';

import styles from './index.scss';

const TextHighlighting = (props) => {
    const {wasDataRendered, currentSelection, viewCommentBox, selections, children} = props;

    const commentHandlerPosition = {
        top: `${currentSelection && currentSelection.rectangles[0].top || 0}`,
        right: -30
    };

    const commentAreaPosition = {
        top: `${currentSelection && currentSelection.rectangles[0].top || 0}`,
        right: -262
    };

    return (
        <div className={styles['highlighting-container']}>
            <TextArea>{children}</TextArea>

            {
                wasDataRendered && currentSelection && !viewCommentBox &&
                <CommentHandler position={commentHandlerPosition} /> ||
                null
            }

            {
                wasDataRendered && viewCommentBox &&
                <CommentArea position={commentAreaPosition} /> ||
                null
            }

            {
                wasDataRendered && !currentSelection && selections.length &&
                <Comments /> ||
                null
            }
        </div>
    );
};

TextHighlighting.displayName = 'TextHighlighting';

TextHighlighting.props = {
    wasDataRendered: PropTypes.bool.isRequired,
    currentSelection: PropTypes.object,
    viewCommentBox: PropTypes.bool,
    selections: PropTypes.array
};

const mapStateToProps = (state) => {
    const {wasDataRendered, currentSelection, viewCommentBox, selections} = state;

    return {
        wasDataRendered,
        currentSelection,
        viewCommentBox,
        selections
    };
};

export default connect(mapStateToProps)(TextHighlighting);