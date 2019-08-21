import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';

const main = async () => {
    ReactDOM.render(
        <App />,
        document.getElementById('main'),
    );
};

(async () => {
    await main();
})();
