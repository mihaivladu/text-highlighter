import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import nl2br from 'react-nl2br';

import styles from './index.scss';

const SelectionDetails = (props) => {
    const {selections} = props;

    if (selections.length) {
        return (
            <ul className={styles['selections-list']}>
                {
                    selections.map((selection, index) => {
                        const {from, to, comment, text} = selection;

                        return (
                            <li key={index} className={styles['selection-item']}>
                                <div><span className={styles['font-bold']}>Start index:</span> {from}</div>
                                <div><span className={styles['font-bold']}>End index:</span> {to}</div>
                                <div><span className={styles['font-bold']}>Comment:</span> {nl2br(comment)}</div>
                                <div><span className={styles['font-bold']}>Text:</span></div>
                                <div className={styles['text']}>{text}</div>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }

    return (
        <div>No selections where made.</div>
    );
};

SelectionDetails.displayName = 'SelectionDetails';

SelectionDetails.propTypes = {
    selections: PropTypes.array
};

const mapStateToProps = (state) => {
    const {selections} = state;

    return {
        selections
    };
};

export default connect(mapStateToProps)(SelectionDetails);