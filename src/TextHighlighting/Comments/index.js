import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './index.scss';
import textAreaStyles from '../TextArea/index.scss';

class Comments extends Component {
    static displayName = 'Comments';

    static propTypes = {
        textAreaRef: PropTypes.object.isRequired,
        selections: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.getElementsDetails = this.getElementsDetails.bind(this);
    }

    getElementsDetails() {
        const {textAreaRef, selections} = this.props;
        const textAreaChildNodes = textAreaRef.childNodes;
        const sortedSelections = [...selections];

        sortedSelections.sort((sel1, sel2) => {
            return sel1.from > sel2.from;
        });

        let elementsDetails = [];

        textAreaChildNodes.forEach(textAreaChildNode => {
            const childNodesLength = textAreaChildNode.childNodes.length;
            const hasSelectedClass = textAreaChildNode.className.indexOf(textAreaStyles['selected-text']) >= 0;

            console.log('%c--- element ----------------------', 'color: #ff0000');
            console.log(textAreaChildNode);

            sortedSelections.forEach((selection, index) => {
                const {id, from, to, text, comment} = selection;

                if (hasSelectedClass) {
                    console.log('%c--- selection ----------------------', 'color: #0000ff');
                    console.log(selection);
                    console.log('IDS: ' + selection.id + ' vs ' + textAreaChildNode.id);

                    const id = textAreaChildNode.id;
                    const innerText = textAreaChildNode.innerText;

                    if (innerText === text) {
                        const range = document.createRange();
                        range.setStart(textAreaChildNode, 0);
                        range.setEnd(textAreaChildNode, 1);

                        const rectangles = range.getClientRects();
                        const top = rectangles[rectangles.length - 1].top;

                        elementsDetails.push({
                            comment,
                            top: rectangles[rectangles.length - 1].top
                        });
                    }
                }
            });

            console.log('');
        });

        return elementsDetails;
    }

    render() {
        const elementsDetails = this.getElementsDetails();

        return (
            <div className={styles['comments-container']}>
                {
                    elementsDetails.map((elementDetails, index) => {
                        const {comment, top} = elementDetails;

                        return (
                            <div key={index} className={styles['comment']} style={{top: `${top - 40}px`}}>
                                {comment}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {textAreaRef, selections} = state;

    return {
        textAreaRef,
        selections
    };
};

export default connect(mapStateToProps)(Comments);