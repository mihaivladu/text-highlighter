import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import nl2br from 'react-nl2br';

import styles from './index.scss';
import textAreaStyles from '../TextArea/index.scss';
import selectedTextStyles from '../SelectedText/index.scss';
import highlightingContainerStyles from '../../TextHighlighting/index.scss';

const textAreaClass = textAreaStyles['text-area-container'];
const selectedTextClass = selectedTextStyles['selected-text'];
const mainContainerClass = highlightingContainerStyles['highlighting-container'];

class Comments extends Component {
    static displayName = 'Comments';

    static propTypes = {
        maxSelectionId: PropTypes.number,
        selections: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.state = {
            elementsDetails: []
        };

        this.isSelection = this.isSelection.bind(this);
        this.updatePositions = this.updatePositions.bind(this);
    }

    componentWillMount() {
        this.updatePositions();
    }

    componentDidMount() {
        window.onresize = () => this.updatePositions();
    }

    componentWillUnmount() {
        window.onresize = null;
    }

    isSelection(textAreaChildNode, selection, usedIds) {
        const {maxSelectionId} = this.props;
        const hasSelectedClass = textAreaChildNode.className.indexOf(selectedTextClass) >= 0;
        const isRenderedSelection = usedIds.indexOf(selection.id) === -1 && selection.id.toString() === textAreaChildNode.id;
        const isUnRenderedSelection = textAreaChildNode.id === 'add_new' && selection.id === maxSelectionId && usedIds.indexOf(maxSelectionId) === -1;

        return hasSelectedClass && (isRenderedSelection || isUnRenderedSelection);
    }

    updatePositions() {
        const {maxSelectionId, selections} = this.props;
        let elementsDetails = [];
        let usedIds = [];
        const textAreaContainer = document.getElementsByClassName(textAreaClass)[0];
        const textAreaChildNodes = textAreaContainer.childNodes;
        const sortedSelections = [...selections];

        sortedSelections.sort((sel1, sel2) => {
            return sel1.from > sel2.from;
        });

        textAreaChildNodes.forEach(textAreaChildNode => {
            sortedSelections.forEach((selection) => {
                const {comment} = selection;

                if (this.isSelection(textAreaChildNode, selection, usedIds)) {
                    const range = document.createRange();
                    range.setStart(textAreaChildNode, 0);
                    range.setEnd(textAreaChildNode, 1);

                    const rectangles = range.getClientRects();
                    const mainContainer = document.getElementsByClassName(mainContainerClass)[0];

                    console.log(mainContainer);
                    console.log(rectangles[rectangles.length - 1].top, mainContainer.offsetTop, window.pageYOffset);

                    const top = rectangles[rectangles.length - 1].top - mainContainer.offsetTop + window.pageYOffset;

                    elementsDetails.push({
                        comment,
                        top
                    });

                    if (textAreaChildNode.id === 'add_new') {
                        usedIds.push(maxSelectionId);
                    } else {
                        usedIds.push(selection.id);
                    }
                }
            });
        });

        this.setState({
            elementsDetails
        });
    }

    render() {
        const {elementsDetails} = this.state;

        return (
            <div className={styles['comments-container']}>
                {
                    elementsDetails.map((elementDetails, index) => {
                        const {comment, top} = elementDetails;

                        return (
                            <div key={index} className={styles['comment']} style={{top: `${top}px`}}>
                                {nl2br(comment)}
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