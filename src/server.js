//import express from 'express';    
//import path from 'path';  
//import open from 'open';  

const express = require('express');
const path = require('path');
const open = require('open');

/* eslint-disable no-console */

const port = 4000;  
const app = express();  

// User details
const userToUser = {};
const userList = {};
const userToId = {};

app.get('*', function(req, res) {  
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

const server = app.listen(port, function(err) {  
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {  
	console.log('connected! => ' + socket.id);
	socket.on('new user', function(username) {
		console.log('Welcome, ' + username);
		userList[socket.id] = username;
	});

	socket.on('choose partner', function(name)) {
		const partnerId = userToId[name];
		
	}

	socket.on('send message', function(msg) {
		const partnerId = userList[userToUser[socket.id]];
		console.log(userList[socket.id] + ' sent a message... to ' + partnerId);
		io.to(partnerId).emit('receive message', msg);
	});

  	socket.on('disconnect', () => {
		console.log('User ' + userList[socket.id] + ' disconnected');
		delete userList[socket.id];
  	});
});