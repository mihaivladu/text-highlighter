import React from 'react';

import TEXT from '../constants/text';

import SelectionHandler from '../TextHighlighting';
import SelectionDetails from '../SelectionDetails';

import styles from './index.scss';

const App = () => (
    <div className={styles['main-container']}>
        <div className={styles['text-container']}>
            <SelectionHandler>
                <h3>Some title</h3>
                {TEXT}
            </SelectionHandler>
        </div>
        <div className={styles['details-container']}>
            <h3>Selection details</h3>
            <SelectionDetails />
        </div>
    </div>
);

export default App;