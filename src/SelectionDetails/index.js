import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './index.scss';

const SelectionDetails = (props) => {
    const {selections} = props;

    if (selections.length) {
        return (
            <ul className={styles['selections-list']}>
                {
                    selections.map((selection, index) => {
                        return (
                            <li key={index} className={styles['selection-item']}>
                                <div><span className={styles['font-bold']}>Start index:</span> {selection.from}</div>
                                <div><span className={styles['font-bold']}>End index:</span> {selection.to}</div>
                                <div><span className={styles['font-bold']}>Text:</span></div>
                                <div className={styles['text']}>{selection.text}</div>
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
    return {
        selections: state
    };
};

export default connect(mapStateToProps)(SelectionDetails);