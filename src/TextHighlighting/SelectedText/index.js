import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const SelectedText = (props) => {
    const {id, text} = props;

    return (
        <span id={id} className={styles['selected-text']}>
            {text}
        </span>
    );
};

SelectedText.displayName = 'SelectedText';

SelectedText.propTypes = {
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired
};

export default SelectedText;