import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './containers/App';
import Root from './containers/Root';
// import { browserHistory } from 'react-router';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import '../assets/styles/styles.scss';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);
const rootElement = document.getElementById('app');
const history = syncHistoryWithStore(createBrowserHistory(), store)

render(
  		<Root store={store} history={history} />,
  		rootElement
	);