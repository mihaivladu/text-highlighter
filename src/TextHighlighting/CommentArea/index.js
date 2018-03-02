import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import { closeCommentArea, submitComment } from '../../actions';

import styles from './index.scss';
import highlightingContainerStyles from '../../TextHighlighting/index.scss';

const mainContainerClass = highlightingContainerStyles['highlighting-container'];

class CommentArea extends Component {
    static displayName = 'CommentArea';

    static propTypes = {
        position: PropTypes.object.isRequired,
        closeCommentArea: PropTypes.func.isRequired,
        submitComment: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            top: 0,
            right: 0,
            comment: '',
            submitButtonDisabled: true
        };

        this.updatePosition = this.updatePosition.bind(this);
        this.onCommentChange = this.onCommentChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.closeCommentArea = this.closeCommentArea.bind(this);
    }

    componentWillMount() {
        const currentSelectionElement = document.getElementById('add_new');

        if (currentSelectionElement) {
            this.updatePosition();
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
        this.textArea.focus();

        window.onresize = () => this.updatePosition();
        window.onkeyup = (event) => {
            console.log(event);

            if (event.keyCode === 27) {
                // ESC was pressed.
                this.closeCommentArea();
            } else if (event.ctrlKey && event.keyCode === 13) {
                // CTRL + ENTER was pressed.
                this.submitComment();
            }
        };
    }

    componentWillUnmount() {
        window.onresize = null;
        window.onkeyup = null;
    }

    updatePosition() {
        const {position} = this.props;
        const currentSelectionElement = document.getElementById('add_new');
        const currentSelectionElementRectangle = currentSelectionElement.getBoundingClientRect();
        const mainContainer = document.getElementsByClassName(mainContainerClass)[0];
        const top = currentSelectionElementRectangle.y - mainContainer.offsetTop + window.pageYOffset;

        this.setState({
            top,
            right: parseFloat(position.right) + window.pageXOffset
        });
    }

    onCommentChange(event) {
        let submitButtonDisabled = true;

        if (event.target.value.trim() !== '') {
            submitButtonDisabled = false;
        }

        this.setState({
            comment: event.target.value,
            submitButtonDisabled
        });
    }

    submitComment() {
        if (this.state.comment.trim() !== '') {
            this.props.submitComment({
                comment: this.state.comment
            });
        }
    }

    closeCommentArea() {
        this.props.closeCommentArea();
    }

    render() {
        const {top, right, comment, submitButtonDisabled} = this.state;

        console.log('submitButtonDisabled', submitButtonDisabled);

        return (
            <div className={cn(styles['comment-area-container'])}
                 style={{top: `${top}px`, right: `${right}px`}}>
                <div>Add a comment</div>
                <div className={styles['textarea-container']}>
                    <textarea rows="2" value={comment} onChange={this.onCommentChange} ref={(element) => {
                        this.textArea = element;
                    }} />
                </div>
                <div className={styles['buttons-container']}>
                    <div className={cn(styles['submit-btn'], {[styles['disabled']]: submitButtonDisabled})}
                         onClick={this.submitComment}>
                        Submit
                    </div>
                    <div className={styles['cancel-btn']} onClick={this.closeCommentArea}>
                        Cancel
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {
    closeCommentArea,
    submitComment
})(CommentArea);