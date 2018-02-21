import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

import App from './App';

const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

const ReduxApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(
    <ReduxApp />,
    document.querySelector('#app-container')
);