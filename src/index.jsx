import React from 'react';
import Router from 'react-router';
import {Provider} from 'react-redux';
import Store from './data/store';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Problems from './pages/problems';
import Problem from './pages/problem';
import Ranking from './pages/ranking';
import Announcements from './pages/announcements';
import Main from './pages/main';
import {Top} from './pages/top';
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;

var routes = (
		<Route path="/" handler={Top}>
			<Route name="login" path="/login" handler={Login} />
			<Route name="main" handler={Main}>
				<Route name="dashboard" handler={Dashboard}/>
				<Route name="problems" path="/problems" handler={Problems}>
				</Route>
					<Route name="problem" path="/problems/:id" handler={Problem}/>
				<Route name="ranking" handler={Ranking}/>
				<Route name="announcements" handler={Announcements}/>
				<DefaultRoute handler={Dashboard}/>
			</Route>
			<DefaultRoute handler={Login}/>
		</Route>
		);

Router.run(routes, (Handler, routerState) => {
	React.render((
			<Provider store={Store}>
				{() => <Handler routerState={routerState} />}
			</Provider>
		), document.getElementById("content"));
})
