import React from 'react';
import Router from 'react-router';
import {Provider} from 'react-redux';
import Store from './js/data/store';
import Login from './js/pages/login';
import Dashboard from './js/pages/dashboard';
import Problems from './js/pages/problems';
import Problem from './js/pages/problem';
import Ranking from './js/pages/ranking';
import Announcements from './js/pages/announcements';
import Main from './js/pages/main';
import {Top} from './js/pages/top';
var remote = require('remote');
var clipboard = remote.require('clipboard');
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

// Patch for Electron on OS X Copy/Paste bug
function CopyPasteFunc(e){
	// Command key presses
	if (!e.ctrlKey && e.metaKey && !e.altKey && !e.shiftKey) {
		if (e.keyCode === 67) {
		// and key 'C' pressed
			var selectedText = window.getSelection().toString();
			if (selectedText) {
				clipboard.writeText(selectedText);
			}
		} else if (e.keyCode === 86){
		// and key 'V' pressed
			var activeElement = document.activeElement;
			var clipboardText = clipboard.readText();
			if (clipboardText && activeElement && activeElement.type == "text") {
				var currentText = activeElement.value;
				var cursorPosition = activeElement.selectionStart;
				if (cursorPosition != activeElement.selectionEnd) {
					currentText = currentText.slice(0, cursorPosition) + currentText.slice(activeElement.selectionEnd);
				}
				activeElement.value = currentText.slice(0, cursorPosition) + clipboardText + currentText.slice(cursorPosition);
				activeElement.selectionStart = activeElement.selectionEnd = cursorPosition + clipboardText.length;
			}
		}
	}
}
document.addEventListener("keydown", CopyPasteFunc);

Router.run(routes, (Handler, routerState) => {
	React.render((
			<Provider store={Store}>
				{() => <Handler routerState={routerState} />}
			</Provider>
		), document.getElementById("content"));
})
