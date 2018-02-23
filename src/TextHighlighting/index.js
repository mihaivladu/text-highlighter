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
        this.closeCommentBox = this.closeCommentBox.bind(this);
        this.hasSelection = this.hasSelection.bind(this);
        this.getNewElements = this.getNewElements.bind(this);
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
            const originalText = this.div.innerText.replace(/[\n\r]/g, '');

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
                const lastIndex = startIndex + selectedText.length - 1;

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

    closeCommentBox() {
        this.setState({
            waitingSelection: null,
            viewCommentBox: false
        });
    }

    /*getComputedText() {
        const {waitingSelection} = this.state;

        if (waitingSelection) {
            console.log(`# From: ${waitingSelection.from} To: ${waitingSelection.to}`);

            let shiftedIndex = 0;
            let html = [];

            this.props.children.forEach((children, index) => {
                console.log(children);

                const {from, to} = waitingSelection;
                const text = children.props ? children.props.children : children;
                const textStartIndex = shiftedIndex;
                const textEndIndex = shiftedIndex + text.length - 1;

                console.log(`${index}. From: ${textStartIndex} To: ${textEndIndex}`);

                if ((from <= textStartIndex && textStartIndex < to) ||
                    (from <= textEndIndex && textEndIndex <= to) ||
                    (textStartIndex <= from && to <= textEndIndex)) {
                    const selectionStartIndex = from <= textStartIndex ? textStartIndex : from;
                    const selectionEndIndex = to >= textEndIndex ? textEndIndex : to;

                    console.log(shiftedIndex, selectionStartIndex, selectionEndIndex);

                    if (children.type) {
                        const element = React.createElement(children.type, {key: index}, children.props.children);
                        html.push(element);
                    } else {
                        const startingText = children.substring(0, selectionStartIndex - shiftedIndex);
                        const selectedText = children.substring(selectionStartIndex - shiftedIndex, selectionEndIndex - shiftedIndex);
                        const endingText = children.substring(selectionEndIndex - shiftedIndex);

                        html.push(React.createElement('span', {key: `starting-text-${index}`}, startingText));
                        html.push(React.createElement('span', {
                            key: `selected-text-${index}`,
                            className: styles['selected-text']
                        }, selectedText));
                        html.push(React.createElement('span', {key: `ending-text-${index}`}, endingText));
                    }
                } else {
                    const element = children.type ?
                        React.createElement(children.type, {key: index}, children.props.children) :
                        React.createElement('span', {key: index}, children);

                    html.push(element);
                }

                shiftedIndex += text.length;
            });

            /!*return this.props.children;*!/

            return html;
        }

        return this.props.children;
    }*/

    hasSelection(textStartsAt, textEndsAt) {
        const {from, to} = this.state.waitingSelection;

        return (from <= textStartsAt && textStartsAt < to) ||
            (textStartsAt <= from && from <= textEndsAt) ||
            (textStartsAt <= to && to <= textEndsAt);
    }

    getNewElements(children, keyIdentifier, textStartsAt, textEndsAt, shiftedIndex) {
        const {from, to} = this.state.waitingSelection;
        let newElements = [];

        const startingSelectionIndex = (from <= textStartsAt ? textStartsAt : from) - shiftedIndex;
        const endingSelectionIndex = (to <= textEndsAt ? to : textEndsAt) - shiftedIndex + 1;

        /*console.log('---------------------');
        console.log('from: ' + from);
        console.log('to: ' + to);
        console.log('startsAt: ' + textStartsAt);
        console.log('endsAt: ' + textEndsAt);
        console.log('startSelection: ' + startingSelectionIndex);
        console.log('endSelection: ' + endingSelectionIndex);
        console.log('shiftedIndex: ' + shiftedIndex);*/

        const startingText = children.substring(0, startingSelectionIndex);
        const selectedText = children.substring(startingSelectionIndex, endingSelectionIndex);
        const endingText = children.substring(endingSelectionIndex);

        /*console.log(startingText);
        console.log(selectedText);
        console.log(endingText);*/

        newElements.push(React.createElement('span', {
            key: `starting-text-${keyIdentifier}`
        }, startingText));
        newElements.push(React.createElement('span', {
            key: `selected-text-${keyIdentifier}`,
            className: styles['selected-text']
        }, selectedText));
        newElements.push(React.createElement('span', {
            key: `ending-text-${keyIdentifier}`
        }, endingText));

        return newElements;
    }

    getComputedText() {
        const {waitingSelection} = this.state;

        if (waitingSelection) {
            let html = [];
            let shiftedIndex = 0;

            this.props.children.forEach((children, index) => {
                if (typeof children === 'string') {
                    const textStartsAt = shiftedIndex;
                    const textEndsAt = shiftedIndex + children.length - 1;

                    if (this.hasSelection(textStartsAt, textEndsAt)) {
                        const newElements = this.getNewElements(children, index, textStartsAt, textEndsAt, shiftedIndex);
                        html = html.concat(newElements);
                    } else {
                        html.push(React.createElement('span', {
                            key: `unselected-text-${index}`
                        }, children));
                    }

                    shiftedIndex += children.length;
                }

                if (typeof children === 'object') {
                    if (Array.isArray(children)) {
                        children.forEach((children, index) => {
                            console.log('shifted index: ' + shiftedIndex);

                            if (typeof children === 'string') {
                                if (children.length) {
                                    const textStartsAt = shiftedIndex;
                                    const textEndsAt = shiftedIndex + children.length - 1;

                                    console.log(this.hasSelection(textStartsAt, textEndsAt));

                                    if (this.hasSelection(textStartsAt, textEndsAt)) {
                                        const newElements = this.getNewElements(children, `paragraph-child-${index}`, textStartsAt, textEndsAt, shiftedIndex);
                                        console.log(newElements);
                                        html = html.concat(newElements);
                                    } else {
                                        html.push(React.createElement('span', {
                                            key: `paragraph-child-unselected-text-${index}`
                                        }, children));
                                    }

                                    shiftedIndex += children.length;
                                }
                            } else {
                                html.push(React.createElement(children.type, {
                                    key: `paragraph-child-br-${index}`
                                }, children.props.children));
                            }
                        });
                    } else {
                        const textStartsAt = shiftedIndex;
                        const textEndsAt = shiftedIndex + children.props.children.length - 1;

                        if (this.hasSelection(textStartsAt, textEndsAt)) {
                            const newElements = this.getNewElements(children.props.children, index, textStartsAt, textEndsAt, shiftedIndex);
                            console.log(newElements);
                            console.log(children.type);
                            html.push(React.createElement(children.type, {
                                key: index
                            }, newElements));
                        } else {
                            html.push(React.createElement(children.type, {
                                key: `unselected-text-${index}`
                            }, children.props.children));
                        }

                        shiftedIndex += children.props.children.length;
                    }
                }
            });

            return html;
        }

        return this.props.children;
    }

    render() {
        const {waitingSelection, viewCommentBox} = this.state;

        // Reduce the top by 40 because of the padding and margins above the div.
        const selectionApproveHandlerTop = `${waitingSelection && waitingSelection.rectangles[0].top || 0}px`;

        const text = this.getComputedText();

        return (
            <div className={styles['highlighting-container']}>
                <div className={styles['text-container']} ref={(div) => this.div = div}>
                    {text}
                </div>
                <div
                    className={cn(styles['selection-approve-handler'], {[styles['hidden']]: !waitingSelection || viewCommentBox})}
                    style={{top: selectionApproveHandlerTop}} onClick={this.openCommentBox}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                        <path fill="#FFFFFF" fillRule="nonzero" d="M5 5V.343h2V5h4.657v2H7v4.657H5V7H.343V5H5z" />
                    </svg>
                </div>
                <div className={cn(styles['comment-box-container'], {[styles['hidden']]: !viewCommentBox})}
                     style={{top: selectionApproveHandlerTop}}>
                    <div>Add a comment</div>
                    <div className={styles['textarea-container']}>
                        <textarea rows="2" />
                    </div>
                    <div className={styles['buttons-container']}>
                        <div className={styles['submit-btn']}>
                            Submit
                        </div>
                        <div className={styles['cancel-btn']} onClick={this.closeCommentBox}>
                            Cancel
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {
    addNewSelection
})(TextHighlighting);