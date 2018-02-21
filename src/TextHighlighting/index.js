import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import { addNewSelection } from '../actions';

import styles from './index.scss';

class TextHighlighting extends Component {
    static displayName = 'TextHighlighting';

    static propTypes = {
        addNewSelection: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            waitingSelection: null,
            viewCommentBox: false
        };

        this.setWaitingSelection = this.setWaitingSelection.bind(this);
        this.openCommentBox = this.openCommentBox.bind(this);
    }

    componentDidMount() {
        this.div.onmouseup = () => this.setWaitingSelection();
    }

    setWaitingSelection() {
        if (this.state.viewCommentBox) {
            this.setState({
                waitingSelection: null,
                viewCommentBox: false
            });
        }

        const selection = window.getSelection();

        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const selectedText = selection.toString();
            const originalText = this.div.innerText;

            if (selectedText.length) {
                // Create preceding range of text.
                const precedingRange = document.createRange();
                precedingRange.setStartBefore(this.div.firstChild);
                precedingRange.setEnd(range.startContainer, range.startOffset);

                // Get preceding text.
                const textPrecedingSelection = precedingRange.toString();

                // Get remaining text starting from the selection.
                const remainingText = originalText.substring(textPrecedingSelection.length);

                // Set originals index of the selection in the text.
                const startIndex = remainingText.indexOf(selectedText) + textPrecedingSelection.length;
                const lastIndex = startIndex + selectedText.length;

                // Add selection to Redux
                /*this.props.addNewSelection({
                    from: startIndex,
                    to: lastIndex,
                    text: selectedText
                });*/

                this.setState({
                    waitingSelection: {
                        from: startIndex,
                        to: lastIndex,
                        text: selectedText,
                        rectangles: range.getClientRects()
                    }
                });
            }
        }
    }

    openCommentBox() {
        this.setState({
            viewCommentBox: true
        });
    }

    render() {
        const {waitingSelection, viewCommentBox} = this.state;

        console.log(this.state);

        // Reduce the top by 40 because of the padding and margins above the div.
        const selectionApproveHandlerTop = `${waitingSelection && waitingSelection.rectangles[0].top - 40 || 0}px`;

        return (
            <div className={styles['text-container']} ref={(div) => this.div = div}>
                {this.props.children}
                <div
                    className={cn(styles['selection-approve-handler'], {[styles['hidden']]: !waitingSelection || viewCommentBox})}
                    style={{top: selectionApproveHandlerTop}} onClick={this.openCommentBox}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                        <path fill="#FFFFFF" fillRule="nonzero" d="M5 5V.343h2V5h4.657v2H7v4.657H5V7H.343V5H5z" />
                    </svg>
                </div>
                <div className={cn(styles['comment-box-container'])}
                     style={{top: selectionApproveHandlerTop}}>
                    <div>Add a comment</div>
                    <div className={styles['textarea-container']}>
                        <textarea rows="2" />
                    </div>
                    <div className={styles['buttons-container']}>
                        <div className={styles['submit-btn']}>Submit</div>
                        <div className={styles['cancel-btn']}>Cancel</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {
    addNewSelection
})(TextHighlighting);