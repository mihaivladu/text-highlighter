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

        /*console.log({...textAreaRef});*/

        const textAreaChildNodes = textAreaRef.childNodes;
        const originalText = textAreaRef.innerText.replace(/[\n\r]/g, '');
        let elementsDetails = [];

        textAreaChildNodes.forEach(textAreaChildNode => {
            const childNodesLength = textAreaChildNode.childNodes.length;
            const hasSelectedClass = textAreaChildNode.className.indexOf(textAreaStyles['selected-text']) >= 0;

            selections.forEach(selection => {
                const {id, from, to, text, comment} = selection;

                if (hasSelectedClass) {
                    const id = textAreaChildNode.id;
                    console.log(textAreaRef);
                    console.log(textAreaChildNode);
                    console.log('ID = ' + id);

                    const innerText = textAreaChildNode.innerText;

                    /*console.log(from, to, text, comment);
                    console.log(innerText);*/

                    if (innerText === text) {
                        const auxSelectedText = originalText.substring(from, to + 1);
                        /*console.log(auxSelectedText);
                        console.log('');*/

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
            })
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
    const {selections} = state;

    return {
        selections
    };
};

export default connect(mapStateToProps)(Comments);