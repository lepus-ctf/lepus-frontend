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

	var menu = Menu.buildFromTemplate([
		{
			label: 'Lepus-CTF',
			submenu: [
			{
				label: 'Settings',
				accelerator: 'CmdOrCtrl+,',
			},
			{
				type: 'separator'
			},
			{
				label: 'Quit',
				accelerator: 'CmdOrCtrl+Q',
				click: function () {
					app.quit();
				}
			}
			]
		},
		{
			label: 'View',
			submenu: [
			{
				label: 'Toggle Full Screen',
				accelerator: 'CmdOrCtrl+Shift+F',
				click: function() {
					mainWindow.setFullScreen(!mainWindow.isFullScreen());
				}
			},
			{
				label: 'Toggle developer tool',
				accelerator: 'CmdOrCtrl+Alt+I',
				click: function() {
					mainWindow.toggleDevTools();
				}
			}
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
});
