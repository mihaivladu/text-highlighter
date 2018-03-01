import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './index.scss';
import textAreaStyles from '../TextArea/index.scss';

class SelectedText extends Component {
    static displayName = 'SelectedText';

    static propTypes = {
        text: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            commentPosition: {
                top: 0,
                left: 0
            }
        };
    }

    componentWillMount() {
        const textContainer = document.getElementsByClassName(textAreaStyles['text-area-container'])[0];
        const {x, width} = textContainer.getBoundingClientRect();

        this.setState({
            commentPosition: {
                top: 0,
                left: x + width
            }
        });

        console.log(this.span);
    }

    render() {
        console.log('render');

        const {top, left} = this.state.commentPosition;
        const {text, comment} = this.props;

        return [
            <span key="text" className={styles['selected-text']} ref={(span) => {
                console.log(span);
                this.span = span;
            }}>
                {text}
            </span>,
            [
                comment &&
                <div key="comment" className={styles['comment']} style={{top, left}}>
                    {comment}
                </div> || null
            ]
        ];
    }
}

const mapStateToProps = (state, ownProps) => {
    const {currentSelection, selections} = state;
    const {id} = ownProps;
    const allSelections = [...selections];

    if (currentSelection) {
        allSelections.push(currentSelection);
    }

    const selection = allSelections.filter(selection => {
        return selection.id === id;
    })[0];

    return {
        comment: selection.comment
    };
};

export default connect(mapStateToProps)(SelectedText);