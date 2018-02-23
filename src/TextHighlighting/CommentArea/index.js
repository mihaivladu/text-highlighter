import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import { closeCommentArea, submitComment } from '../../actions';

import styles from './index.scss';

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
            comment: ''
        };

        this.onCommentChange = this.onCommentChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.closeCommentArea = this.closeCommentArea.bind(this);
    }

    onCommentChange(event) {
        this.setState({
            comment: event.target.value
        });
    }

    submitComment() {
        this.props.submitComment({
            comment: this.state.comment
        });

        this.setState({
            comment: ''
        });
    }

    closeCommentArea() {
        this.props.closeCommentArea();
    }

    render() {
        const {position} = this.props;

        return (
            <div className={cn(styles['comment-area-container'])}
                 style={{top: position.top, right: position.right}}>
                <div>Add a comment</div>
                <div className={styles['textarea-container']}>
                    <textarea rows="2" value={this.state.comment} onChange={this.onCommentChange} />
                </div>
                <div className={styles['buttons-container']}>
                    <div className={styles['submit-btn']} onClick={this.submitComment}>
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