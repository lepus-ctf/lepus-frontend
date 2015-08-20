import React from 'react';
import Router from 'react-router';
import {Login} from './js/login';
import {Dashboard} from './js/dashboard';
import {Main} from './js/main';

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var routes = (
		<Route name="main" path="/" handler={Main}>
			<Route name="dashboard" handler={Dashboard}/>
			<DefaultRoute handler={Dashboard}/>
		</Route>
		);

// TODO: check login cookie
var hasCookie = true;
if (!hasCookie) {
	React.render(<Login />, document.body);
} else {
	Router.run(routes, function (Handler) {
		React.render(<Handler />, document.body);
	});
}

