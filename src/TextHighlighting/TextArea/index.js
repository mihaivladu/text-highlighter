import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    setCurrentSelection,
    removeCurrentSelection,
    closeCommentArea,
    setTextAreaRef
} from '../../actions';

import styles from './index.scss';

class TextArea extends Component {
    static displayName = 'TextArea';

    static propTypes = {
        currentSelection: PropTypes.object,
        viewCommentBox: PropTypes.bool,
        selections: PropTypes.array,
        setCurrentSelection: PropTypes.func.isRequired,
        removeCurrentSelection: PropTypes.func.isRequired,
        closeCommentArea: PropTypes.func.isRequired,
        setTextAreaRef: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.setCurrentSelection = this.setCurrentSelection.bind(this);
        this.hasSelection = this.hasSelection.bind(this);
        this.getNestedElementsDetailsDetails = this.getNestedElementsDetailsDetails.bind(this);
        this.getElementsDetails = this.getElementsDetails.bind(this);
    }

    componentDidMount() {
        this.div.onmouseup = () => this.setCurrentSelection();

        // Remove the selection on any click outside the text div's parent.
        document.querySelector('body').onclick = (event) => {
            const {currentSelection, removeCurrentSelection} = this.props;

            if (currentSelection) {
                if (!(this.div.parentNode.contains(event.target))) {
                    removeCurrentSelection();
                }
            }
        };

        this.props.setTextAreaRef({
            textAreaRef: this.div
        });
    }

    setCurrentSelection() {
        const {viewCommentBox, setCurrentSelection, removeCurrentSelection, closeCommentArea} = this.props;

        if (viewCommentBox) {
            closeCommentArea();
        }

        const selection = window.getSelection();

        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const selectedText = selection.toString().replace(/[\n\r]/g, '');
            const originalText = this.div.innerText.replace(/[\n\r]/g, '');

            if (selectedText.length) {
                // Create preceding range of text.
                const precedingRange = document.createRange();
                precedingRange.setStartBefore(this.div.firstChild);
                precedingRange.setEnd(range.startContainer, range.startOffset);
                /*console.log('precedingRange', precedingRange);
                console.log('toString', precedingRange.toString());
                console.log('startOffset: ' + range.startOffset);*/

                // Get preceding text.
                const textPrecedingSelection = precedingRange.toString();

                // Get remaining text starting from the selection.
                const remainingText = originalText.substring(textPrecedingSelection.length);

                // Set originals index of the selection in the text.
                const startIndex = remainingText.indexOf(selectedText) + textPrecedingSelection.length;
                const lastIndex = startIndex + selectedText.length - 1;

                // Add selection to Redux
                setCurrentSelection({
                    from: startIndex,
                    to: lastIndex,
                    text: selectedText,
                    rectangles: range.getClientRects()
                });

                if (window.getSelection) {
                    if (window.getSelection().empty) {  // Chrome
                        window.getSelection().empty();
                    } else if (window.getSelection().removeAllRanges) {  // Firefox
                        window.getSelection().removeAllRanges();
                    }
                } else if (document.selection) {  // IE?
                    document.selection.empty();
                }
            } else {
                removeCurrentSelection();
            }
        }
    }

    hasSelection(textStartsAt, textEndsAt) {
        const {selections, currentSelection} = this.props;

        let totalSelections = [...selections];

        if (currentSelection) {
            totalSelections.push(currentSelection);
        }

        let status = false;

        totalSelections.forEach(selection => {
            const {from, to} = selection;

            if ((from <= textStartsAt && textStartsAt < to) ||
                (textStartsAt <= from && from <= textEndsAt) ||
                (textStartsAt <= to && to <= textEndsAt)) {
                status = true;
            }
        });

        return status;
    }

    getNestedElementsDetailsDetails(children, keyIdentifier, textStartsAt, textEndsAt, shiftedIndex) {
        const {selections, currentSelection} = this.props;

        let totalSelections = [...selections];

        if (currentSelection) {
            totalSelections.push(currentSelection);
        }

        totalSelections.sort((sel1, sel2) => {
            return sel1.from > sel2.from;
        });

        let nestedElementsDetails = [];
        let maxTo = 0;

        /*console.log('%c---  new element  -----------------------------------------', 'color: #ff0000');
        console.log('%c' + children.substring(0, children.length > 50 ? 50 : children.length) + (children.length > 50 ? '...' : ''), 'color: #aaa');
        console.log('textStartsAt: ' + textStartsAt + ' | textEndsAt: ' + textEndsAt + ' | shifted: ' + shiftedIndex + '\n\n');*/

        totalSelections.forEach((selection, index) => {
            const {from, to} = selection;

            /*console.log('%c--- #' + index + ' selection ---', 'color: #0000ff');
            console.log('from : ' + from + ' | to: ' + to + ' | maxTo: ' + maxTo + '\n\n');*/

            if (from > maxTo) {
                // Text between [maxTo : from] is NOT selected.
                const max = maxTo <= textStartsAt ? textStartsAt : (maxTo + 1);
                let startingSelectionIndex = max - shiftedIndex;

                let endingSelectionIndex = (from <= textEndsAt ? from : textEndsAt) - shiftedIndex;

                /*console.log('%cUnselected text indexes:', 'color: #16822D');
                console.log('startingIndex: ' + startingSelectionIndex + ' | endingIndex: ' + endingSelectionIndex + '\n\n');*/

                if (endingSelectionIndex >= startingSelectionIndex) {
                    const unSelectedText = children.substring(startingSelectionIndex, endingSelectionIndex);

                    /*console.log('%cUnselected text:', 'color: #16822D');
                    console.log(unSelectedText + '\n\n');*/

                    nestedElementsDetails.push({
                        type: 'span',
                        text: unSelectedText
                    });
                }

                startingSelectionIndex = (from <= textStartsAt ? textStartsAt : from) - shiftedIndex;
                endingSelectionIndex = (to <= textEndsAt ? to : textEndsAt) - shiftedIndex + 1;

                /*console.log('%cSelected text indexes:', 'color: #16822D');
                console.log('startingIndex: ' + startingSelectionIndex + ' | endingIndex: ' + endingSelectionIndex + '\n\n');*/

                if (endingSelectionIndex > startingSelectionIndex) {
                    const selectedText = children.substring(startingSelectionIndex, endingSelectionIndex);

                    /*console.log('%cSelected text:', 'color: #16822D');
                    console.log(selectedText + '\n\n');*/

                    nestedElementsDetails.push({
                        type: 'span',
                        props: {
                            className: styles['selected-text'],
                            id: selection.id
                        },
                        text: selectedText
                    });
                }
            } else if (from === maxTo) {
                // Text between [from + 1 : to] is selected.
                const startingSelectionIndex = (from <= textStartsAt ? textStartsAt : from) - shiftedIndex;
                const endingSelectionIndex = (to <= textEndsAt ? to : textEndsAt) - shiftedIndex + 1;
                const selectedText = children.substring(startingSelectionIndex, endingSelectionIndex);

                /*console.log('%cSelected text indexes:', 'color: #16822D');
                console.log('startingIndex: ' + startingSelectionIndex + ' | endingIndex: ' + endingSelectionIndex + '\n\n');*/

                /*console.log('%cSelected text:', 'color: #16822D');
                console.log(selectedText + '\n\n');*/

                nestedElementsDetails.push({
                    type: 'span',
                    props: {
                        className: styles['selected-text'],
                        id: selection.id
                    },
                    text: selectedText
                });
            } else {
                /** TODO: Work on this case. Is not working! */

                if (to > maxTo) {
                    // Text between [maxTo: to] is selected.
                    const startingSelectionIndex = (maxTo <= textStartsAt ? textStartsAt : maxTo) - shiftedIndex + 1;
                    const endingSelectionIndex = (to <= textEndsAt ? to : textEndsAt) - shiftedIndex + 1;

                    const selectedText = children.substring(startingSelectionIndex, endingSelectionIndex);

                    /*console.log('to > maxTo (sel): ' + selectedText);*/

                    nestedElementsDetails.push({
                        type: 'span',
                        props: {
                            className: styles['selected-text'],
                            id: selection.id
                        },
                        text: selectedText
                    });
                }
            }

            // Setting the maximum TO index.
            if (to > maxTo) {
                maxTo = to;
            }

            // Text between [maxTo : ] is not selected.
            if (totalSelections.length - 1 === index) {
                const startingSelectionIndex = (maxTo <= textStartsAt ? textStartsAt : maxTo) - shiftedIndex + 1;
                const unSelectedText = children.substring(startingSelectionIndex);

                /*console.log('remaining: ', unSelectedText);*/

                nestedElementsDetails.push({
                    type: 'span',
                    text: unSelectedText
                });
            }
        });

        /*console.log('\n');*/

        return nestedElementsDetails;
    }

    getElementsDetails() {
        let elementsDetails = [];
        let shiftedIndex = 0;
        const keyIdentifier = Date.now();

        this.props.children.forEach((children) => {
            if (typeof children === 'string') {
                const textStartsAt = shiftedIndex;
                const textEndsAt = shiftedIndex + children.length;

                if (this.hasSelection(textStartsAt, textEndsAt)) {
                    const newElements = this.getNestedElementsDetailsDetails(children, keyIdentifier, textStartsAt, textEndsAt, shiftedIndex);
                    elementsDetails = elementsDetails.concat(newElements);
                } else {
                    elementsDetails.push({
                        type: 'span',
                        text: children
                    });
                }

                shiftedIndex += children.length;
            } else if (Array.isArray(children)) {
                children.forEach((children, index) => {
                    if (typeof children === 'string') {
                        if (children.length) {
                            const textStartsAt = shiftedIndex;
                            const textEndsAt = shiftedIndex + children.length;

                            if (this.hasSelection(textStartsAt, textEndsAt)) {
                                const newElements = this.getNestedElementsDetailsDetails(children, `paragraph-child-${keyIdentifier}-${index}`, textStartsAt, textEndsAt, shiftedIndex);
                                elementsDetails = elementsDetails.concat(newElements);
                            } else {
                                elementsDetails.push({
                                    type: 'span',
                                    text: children
                                });
                            }

                            shiftedIndex += children.length;
                        }
                    } else {
                        elementsDetails.push({
                            type: children.type,
                            text: children.props.children
                        });
                    }
                });
            } else {
                const textStartsAt = shiftedIndex;
                const textEndsAt = shiftedIndex + children.props.children.length;

                if (this.hasSelection(textStartsAt, textEndsAt)) {
                    const newElements = this.getNestedElementsDetailsDetails(children.props.children, keyIdentifier, textStartsAt, textEndsAt, shiftedIndex);
                    elementsDetails.push({
                        type: children.type,
                        text: newElements
                    });
                } else {
                    elementsDetails.push({
                        type: children.type,
                        text: children.props.children
                    });
                }

                shiftedIndex += children.props.children.length;
            }
        });

        return elementsDetails;
    }

    render() {
        const elementsDetails = this.getElementsDetails();

        return (
            <div className={styles['text-area-container']} ref={(div) => this.div = div}>
                {
                    elementsDetails.map((elementDetails, index) => {
                        const {type, props, text} = elementDetails;
                        let nestedElements = [];

                        if (Array.isArray(text)) {
                            nestedElements = text.map((element, index) => {
                                const {type, props, text} = element;

                                return React.createElement(type, {
                                    key: `2nd-level-${index}`,
                                    ...props
                                }, text);
                            });
                        }

                        return React.createElement(type, {
                            key: index,
                            ...props
                        }, nestedElements.length ? nestedElements : text);
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {currentSelection, viewCommentBox, selections} = state;

    return {
        currentSelection,
        viewCommentBox,
        selections
    };
};

export default connect(mapStateToProps, {
    setCurrentSelection,
    removeCurrentSelection,
    closeCommentArea,
    setTextAreaRef
})(TextArea);