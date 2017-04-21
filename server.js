//import express from 'express';    
//import path from 'path';  
//import open from 'open';  

const express = require('express');
const webpackdevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const path = require('path');

/* eslint-disable no-console */

const port = 3000;  
const app = express();  

const compiler = webpack(webpackConfig);

// User details
const userToUser = {};
const userList = {};
const userToId = {};

function getUserValues() {
	const lst = [];
	for (var item of Object.keys(userList)) {
		lst.push(userList[item]);
	}
	return lst;
}

//app.use(express.static(__dirname + '/public'));
 
app.use(webpackdevMiddleware(compiler, {
  hot: true,
  //filename: 'bundle.js',
  publicPath: '/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/', 'index.html'));
});

//app.get('*', function(req, res) {  
//  res.sendFile(path.join( __dirname, '../public/index.html'));
//});

const server = app.listen(port, function(err) { 
/* 
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
*/  
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {  
	console.log('connected! => ' + socket.id);
	console.log(__dirname);
	socket.on('new user', function(username) {
		if (userToId[username] == null) {
			console.log('Welcome, ' + username);
			// no conflicting user name
			// id ==> (name, isFree)
			userList[socket.id] = {name: username, isFree: true};

			// name ==> id
			userToId[username] = socket.id; 

			// notify user
			io.to(socket.id).emit('user entry', username);

			// send out available users' name to everyone
			io.emit('available partners', getUserValues());
		} else {
			console.log('Username ' + username + ' is already taken.');
			// conflicting user name
			io.to(socket.id).emit('username taken', {});
		}

	});

	socket.on('choose partner', function(name) {
		const partnerId = userToId[name];

		// update isFree
		userList[socket.id].isFree = false;
		userList[partnerId].isFree = false;

		// update user to user mapping
		userToUser[socket.id] = partnerId;
		userToUser[partnerId] = socket.id;
		
		// send out available users' name to everyone
		io.emit('available partners', getUserValues());

		// send out notif for successful chosing
		io.to(socket.id).emit('assign partner', userList[partnerId].name);
		io.to(partnerId).emit('assign partner', userList[socket.id].name);
	});

	socket.on('send message', function(msg) {
		const partnerId = userToUser[socket.id];
		const partnerName = userList[partnerId].name;
		console.log(userList[socket.id].name + ' sent a message... to ' + partnerName);

		// send to partner
		io.to(partnerId).emit('receive message', [1, msg]);
		// send to self
		io.to(socket.id).emit('receive message', [0, msg]);
	});

	socket.on('exit room', function(partnerName) {
		console.log(userList[socket.id].name + ' exiting to lobby...');

		// tell partner
		const partnerId = userToUser[socket.id];
		delete userToUser[partnerId];

		console.log('Notifying partner ' + userList[partnerId].name);

		io.to(partnerId).emit('partner exit', {});

		// remove userToUser mapping for current user
		delete userToUser[socket.id];

		// set both to free
		userList[socket.id].isFree = true;
		userList[partnerId].isFree = true;

		// send out available users' name to everyone
		io.emit('available partners', getUserValues());
	});

  	socket.on('disconnect', () => {
  		const name = userList[socket.id] == null ? '' : userList[socket.id].name;
		console.log('User ' + name + ' disconnected');

		// no need to tell self

		// tell partner (if any)
		const partnerId = userToUser[socket.id];
		if (partnerId != null) {
			// delete partner mappings
			delete userToUser[partnerId];
			delete userToUser[socket.id];

			// set partner to free
			userList[partnerId].isFree = true;
			io.to(partnerId).emit('partner disconnect', {});
		}

		if (userList[socket.id] != null) {
			delete userToId[userList[socket.id].name];
			delete userList[socket.id];
		}

		// send out available users' name to everyone
		io.emit('available partners', getUserValues());
  	});
});