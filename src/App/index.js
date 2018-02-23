import React from 'react';
import nl2br from 'react-nl2br';

import TEXT from '../constants/text';

import SelectionHandler from '../TextHighlighting';
import SelectionDetails from '../SelectionDetails';

import styles from './index.scss';

const App = () => (
    <div className={styles['main-container']}>
        <div className={styles['text-container']}>
            <SelectionHandler>
                <h3>0123</h3>
                {nl2br(TEXT)}
            </SelectionHandler>
        </div>
        <div className={styles['details-container']}>
            <h3>Selection details</h3>
            <SelectionDetails />
        </div>
    </div>
);

export default App;