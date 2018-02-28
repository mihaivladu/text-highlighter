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
        console.log('stuff !?');
        const {selections} = this.props;
        const mainContainer = document.getElementsByClassName(textAreaStyles['text-area-container'])[0];
        console.log(mainContainer);
        const textAreaChildNodes = mainContainer.childNodes;
        const sortedSelections = [...selections];

        sortedSelections.sort((sel1, sel2) => {
            return sel1.from > sel2.from;
        });

        let usedIds = [];
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
                    console.log('GET BY ID', document.getElementById('add_new'));
                    console.log('GET BY ID', document.getElementById('1'));
                    console.log('%cIDS: ' + selection.id + ' vs ' + textAreaChildNode.id, 'color: #aaa');
                    console.log('usedIds', usedIds, usedIds.indexOf(id));

                    const id = textAreaChildNode.id;
                    console.log(selection.id, id);
                    const innerText = textAreaChildNode.innerText;

                    if (usedIds.indexOf(id) === -1) {
                        if (id === 'add_new') {
                            console.log('FOUND: ' + text);

                            const range = document.createRange();
                            range.setStart(textAreaChildNode, 0);
                            range.setEnd(textAreaChildNode, 1);

                            const rectangles = range.getClientRects();
                            const top = rectangles[rectangles.length - 1].top;

                            elementsDetails.push({
                                comment,
                                top: rectangles[rectangles.length - 1].top
                            });

                            usedIds.push(id);
                        } else {
                            if (id === selection.id.toString()) {
                                console.log('FOUND: ' + text);

                                const range = document.createRange();
                                range.setStart(textAreaChildNode, 0);
                                range.setEnd(textAreaChildNode, 1);

                                const rectangles = range.getClientRects();
                                const top = rectangles[rectangles.length - 1].top;

                                elementsDetails.push({
                                    comment,
                                    top: rectangles[rectangles.length - 1].top
                                });

                                usedIds.push(id);
                            }
                        }
                    }
                }
            });

            console.log('');
        });

        return elementsDetails;
    }

    render() {
        console.log('comments render');

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