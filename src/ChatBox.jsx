import React from 'react';
import ChatRoom from './ChatRoom.jsx';
import ChatEntry from './ChatEntry.jsx';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import io from 'socket.io-client';

const socket = io();

export default class ChatBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			isInit: false,
			nameIsTaken: false
		}

		socket.on('user entry', (name) => this.setState({
			username: name,
			isInit: true,
			nameIsTaken: false
		}));

		socket.on('username taken', () => this.setState({
			nameIsTaken: true
		}));

		this.onUsernameEnter = this.onUsernameEnter.bind(this);
	}

	onUsernameEnter(val) {
		socket.emit('new user', val);
	}

	render() {
		return (
			<div>
			  	<AppBar 
			  		title={<span>Chatteritic</span>} 
			  		showMenuIconButton={false} 
			  	/>
			  	<Paper style={{padding:20,textAllign:"center"}}>
				{this.state.isInit ? 
					<ChatRoom 
						socket={socket} 
						username={this.state.username} 
					/>
					:
					<ChatEntry 
						onEnter={this.onUsernameEnter} 
						nameIsTaken={this.state.nameIsTaken} 
					/>
				}
				</Paper>
			</div>
		)
	}

}