import path from 'path'
import Express from 'express'
import qs from 'qs'
import React from 'react';
import  { match, RoutingContext } from 'react-router';
import webpack from 'webpack'
import config from './webpack.config';
import configureStore from './app/store/configureStore';
import createMemoryHistory from 'history/createMemoryHistory';
import { StaticRouter, Switch, Route, matchPath } from 'react-router';
import render from './render';
import fetch from 'node-fetch';
import App from './app/containers/App';
import TodoPage from './app/containers/TodoPage';
import { Provider } from 'react-redux'

const port = process.env.PORT || 3000;

let todos = [{id: 1, text: 'Here is the task 1'},
			 {id: 2, text: 'Task 2'},
			 {id: 3, text: 'Task 3'}]

let app = Express();

let compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
	hot: false, 
	noInfo: true,
	publicPath: config.output.publicPath,
	stats: {
		colors: true
	}
}));

app.use(require('webpack-hot-middleware')(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}));
// app.use(require("webpack-hot-middleware")(compiler));

app.use('/assets', Express.static(__dirname+'assets'));

app.get('/api/todos', (req, res)=>{
	res.json({todos: todos});
});

app.post('/api/addtodo', (req, res)=>{
	todos.push({id: todos.length(), text: res.body.text});
	res.json({todos: todos});
});

function getSomeData(url) {
	return fetch('http://localhost:3000/api/todos')
	.then(r=>r.json())
	.then(data => {
		return data;
	})
}

const routes = [
	{ path: '/',
	    component: App,
	    loadData: (params) => getSomeData(params),
	},
	{ path: '/todo/:todoid',
	    component: TodoPage,
	    loadData: (params) => getSomeData(params),
	},
];

app.get('/favicon.ico', (req, res, next) => {

})

app.get('*', (req, res, next) => {
	let history = createMemoryHistory();
	
	const match = routes.reduce((acc, route) => matchPath(req.url, route, { exact: true }) || acc, null);
    if (!match) {
        res.status(404).send(render(<div>No match found</div>));
        return;
    }
    const promises = [];

	var c = routes.some(route => {
	  const match = matchPath(req.url, route)
	  if (match)
	  { 
		promises.push(route.loadData(match))
	  }
	  return match
	});
	Promise.all(promises).then((data)=>{
		const store = configureStore(data[0]);
		const finalState = store.getState()
        res.status(200).send(render(
            (
            	<Provider store={store}>
				  <div>
					<StaticRouter context={{}} location={req.url}>
						<Switch>
							<Route path="/todo/:id" component={TodoPage} />
							<Route path="/" component={App}/>
				  		</Switch>
					</StaticRouter>
				</div>
                </Provider>
            ),  finalState
        ));
	});
});

app.listen(port , (err) => {
	if(err)
		console.log(err)
	console.log(`Express serever 🌏 started listening on ${port}`);
});