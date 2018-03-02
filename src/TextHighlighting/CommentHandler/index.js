import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import { openCommentArea } from '../../actions';

import styles from './index.scss';
import highlightingContainerStyles from '../../TextHighlighting/index.scss';

const mainContainerClass = highlightingContainerStyles['highlighting-container'];

class CommentHandler extends Component {
    static displayName = 'CommentHandler';

    static propTypes = {
        position: PropTypes.object,
        openCommentArea: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.updatePosition = this.updatePosition.bind(this);
        this.openCommentArea = this.openCommentArea.bind(this);
    }

    componentWillMount() {
        const currentSelectionElement = document.getElementById('add_new');

        if (currentSelectionElement) {

        } else {
            const {position} = this.props;
            const mainContainer = document.getElementsByClassName(mainContainerClass)[0];

            this.setState({
                top: parseFloat(position.top) - mainContainer.offsetTop + window.pageYOffset,
                right: parseFloat(position.right) + window.pageXOffset
            });
        }
    }

    componentDidMount() {
        window.onresize = () => this.updatePosition();

    }

    componentWillUnmount() {
        window.onresize = () => null;
    }

    updatePosition() {
        const {position} = this.props;
        const currentSelectionElement = document.getElementById('add_new');
        const currentSelectionElementRectangle = currentSelectionElement.getBoundingClientRect();
        const mainContainer = document.getElementsByClassName(mainContainerClass)[0];
        const mainContainerRectangle = mainContainer.getBoundingClientRect();
        const top = currentSelectionElementRectangle.y - mainContainer.offsetTop + window.pageYOffset;

        this.setState({
            top,
            right: parseFloat(position.right) + window.pageXOffset
        });
    }

    openCommentArea() {
        this.props.openCommentArea();
    }

    render() {
        const {top, right} = this.state;

        return (
            <div
                className={cn(styles['comment-handler-container'])}
                style={{top: `${top}px`, right: `${right}px`}} onClick={this.openCommentArea}>
                <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'>
                    <path fill='#FFFFFF' fillRule='nonzero' d='M5 5V.343h2V5h4.657v2H7v4.657H5V7H.343V5H5z' />
                </svg>
            </div>
        );
    }
}

export default connect(null, {
    openCommentArea
})(CommentHandler);