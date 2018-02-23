import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import { openCommentArea } from '../../actions';

import styles from './index.scss';

class CommentHandler extends Component {
    static displayName = 'CommentHandler';

    static propTypes = {
        position: PropTypes.object,
        openCommentArea: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.openCommentArea = this.openCommentArea.bind(this);
    }

    openCommentArea() {
        this.props.openCommentArea();
    }

    render() {
        const {position} = this.props;

        return (
            <div
                className={cn(styles['comment-handler-container'])}
                style={{top: position.top, right: position.right}} onClick={this.openCommentArea}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                    <path fill="#FFFFFF" fillRule="nonzero" d="M5 5V.343h2V5h4.657v2H7v4.657H5V7H.343V5H5z" />
                </svg>
            </div>
        );
    }
}

export default connect(null, {
    openCommentArea
})(CommentHandler);