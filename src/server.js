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

function getUserValues() {
	const lst = [];
	for (var item of Object.keys(userList)) {
		lst.push(userList[item]);
	}
	return lst;
}

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

		// id ==> (name, isFree)
		userList[socket.id] = {name: username, isFree: true};

		// TODO: handle conflicting names
		// name ==> id
		userToId[username] = socket.id; 

		// send out available users' name to everyone
		io.emit('available partners', getUserValues());
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
		const partnerName = userList[partnerId];
		console.log(userList[socket.id] + ' sent a message... to ' + partnerName);

		// send to partner
		io.to(partnerId).emit('receive message', [1, msg]);
		// send to self
		io.to(socket.id).emit('receive message', [0, msg]);
	});

  	socket.on('disconnect', () => {
		console.log('User ' + userList[socket.id] + ' disconnected');

		// no need to tell self

		// tell partner (if any)
		const partnerId = userToUser[socket.id];
		if (partnerId) {
			// delete partner mappings
			delete userToUser[partnerId];
			delete userToUser[socket.id];

			// set partner to free
			userList[partnerId].isFree = true;
			io.to(partnerId).emit('partner disconnect', {});
		}

		delete userList[socket.id];

		// send out available users' name to everyone
		io.emit('available partners', getUserValues());
  	});
});