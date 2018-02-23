import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setCurrentSelection, removeCurrentSelection, closeCommentArea } from '../../actions';

import styles from './index.scss';

class TextArea extends Component {
    static displayName = 'TextArea';

    static propTypes = {
        currentSelection: PropTypes.object,
        viewCommentBox: PropTypes.bool,
        setCurrentSelection: PropTypes.func.isRequired,
        removeCurrentSelection: PropTypes.func.isRequired,
        closeCommentArea: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.setCurrentSelection = this.setCurrentSelection.bind(this);
        this.hasSelection = this.hasSelection.bind(this);
        this.getNewElements = this.getNewElements.bind(this);
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
        const {from, to} = this.props.currentSelection;

        return (from <= textStartsAt && textStartsAt < to) ||
            (textStartsAt <= from && from <= textEndsAt) ||
            (textStartsAt <= to && to <= textEndsAt);
    }

    getNewElements(children, keyIdentifier, textStartsAt, textEndsAt, shiftedIndex) {
        const {from, to} = this.props.currentSelection;

        let newElements = [];

        const startingSelectionIndex = (from <= textStartsAt ? textStartsAt : from) - shiftedIndex;
        const endingSelectionIndex = (to <= textEndsAt ? to : textEndsAt) - shiftedIndex + 1;

        const startingText = children.substring(0, startingSelectionIndex);
        const selectedText = children.substring(startingSelectionIndex, endingSelectionIndex);
        const endingText = children.substring(endingSelectionIndex);

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
        const {currentSelection} = this.props;

        if (currentSelection) {
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
                            if (typeof children === 'string') {
                                if (children.length) {
                                    const textStartsAt = shiftedIndex;
                                    const textEndsAt = shiftedIndex + children.length - 1;

                                    if (this.hasSelection(textStartsAt, textEndsAt)) {
                                        const newElements = this.getNewElements(children, `paragraph-child-${index}`, textStartsAt, textEndsAt, shiftedIndex);
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
        const text = this.getComputedText();

        return (
            <div className={styles['text-area-container']} ref={(div) => this.div = div}>
                {text}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {currentSelection, viewCommentBox} = state;

    return {
        currentSelection,
        viewCommentBox
    };
};

export default connect(mapStateToProps, {
    setCurrentSelection,
    removeCurrentSelection,
    closeCommentArea
})(TextArea);