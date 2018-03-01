import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './index.scss';
import textAreaStyles from '../TextArea/index.scss';
import selectedTextStyles from '../SelectedText/index.scss';

const textAreaClass = textAreaStyles['text-area-container'];
const selectedTextClass = selectedTextStyles['selected-text'];

class Comments extends Component {
    static displayName = 'Comments';

    static propTypes = {
        maxSelectionId: PropTypes.number,
        selections: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.updatePositions = this.updatePositions.bind(this);
        this.getElementsDetails = this.getElementsDetails.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        window.onresize = () => this.updatePositions();
    }

    componentWillUnmount() {
        window.onresize = null;
    }

    updatePositions() {
        console.log('resize');
    }

    getElementsDetails() {
        const {maxSelectionId, selections} = this.props;
        const textAreaContainer = document.getElementsByClassName(textAreaClass)[0];
        const textAreaChildNodes = textAreaContainer.childNodes;
        const sortedSelections = [...selections];

        sortedSelections.sort((sel1, sel2) => {
            return sel1.from > sel2.from;
        });

        let elementsDetails = [];
        let usedIds = [];

        textAreaChildNodes.forEach(textAreaChildNode => {
            const childNodesLength = textAreaChildNode.childNodes.length;
            const hasSelectedClass = textAreaChildNode.className.indexOf(selectedTextClass) >= 0;

            sortedSelections.forEach((selection, index) => {
                const {id, from, to, text, comment} = selection;

                if (hasSelectedClass) {
                    if (usedIds.indexOf(selection.id) === -1 && selection.id.toString() === textAreaChildNode.id) {
                        const range = document.createRange();
                        range.setStart(textAreaChildNode, 0);
                        range.setEnd(textAreaChildNode, 1);

                        const rectangles = range.getClientRects();
                        const top = rectangles[rectangles.length - 1].top;

                        elementsDetails.push({
                            comment,
                            top: rectangles[rectangles.length - 1].top
                        });

                        usedIds.push(selection.id);
                    } else if (textAreaChildNode.id === 'add_new' && selection.id === maxSelectionId && usedIds.indexOf(maxSelectionId) === -1) {
                        const range = document.createRange();
                        range.setStart(textAreaChildNode, 0);
                        range.setEnd(textAreaChildNode, 1);

                        const rectangles = range.getClientRects();
                        const top = rectangles[rectangles.length - 1].top;

                        elementsDetails.push({
                            comment,
                            top: rectangles[rectangles.length - 1].top
                        });

                        usedIds.push(maxSelectionId);
                    }
                }
            });
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
    const {id, selections} = state;

    return {
        maxSelectionId: id,
        selections
    };
};

export default connect(mapStateToProps)(Comments);