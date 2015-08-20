'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
	if (process.platform != 'darwin')
		app.quit();
});

app.on('ready', function() {

	mainWindow = new BrowserWindow({width: 1024, height: 600});
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});

var menu = Menu.buildFromTemplate([
		{
			label: 'TDUCTF',
			submenu: [
			{label: 'Settings'},
			{label: 'Quit'}
			]
		},
		{
			label: 'Edit',
			submenu: [
			{label: 'Copy', selector: 'copy'},
			{label: 'Paste', selector: 'paste'}
			]
		},
		{
			label: 'Help',
			submenu: [
			{label: 'About'},
			{label: 'Contact to admin'},
			]
		}
]);
Menu.setApplicationMenu(menu);
