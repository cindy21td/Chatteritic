import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class ChatEntry extends React.Component {

	static propTypes = {
    	onEnter: React.PropTypes.func,
    	nameIsTaken: React.PropTypes.bool,
  	};
	
	constructor(props) {
		super(props);
		this.state = {
			username: ''
		}

		this.onEnter = this.onEnter.bind(this);

		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.onUsernameEnter = this.onUsernameEnter.bind(this);
	}

	onEnter(e) {
		e.preventDefault();
		this.onUsernameEnter();
	}

	onUsernameChange(e) {
		this.setState({
			username: e.target.value
		});
	}

	onUsernameEnter() {
		if (this.state.username.trim() != "") {
			this.props.onEnter(this.state.username.trim());
		}
	}


	render() {
		return (
			<form onSubmit={this.onEnter}>
			<h1>Welcome</h1>
			<p>Please enter your "chatter-name"</p>
				<TextField 
					name="username" 
					floatingLabelText="Chatter-Name" 
					value={this.state.username} 
					onChange={this.onUsernameChange} 
					errorText={this.props.nameIsTaken ? "Username is already taken." : ''}
				/>
				<FlatButton 
					onTouchTap={this.onUsernameEnter} 
					onClick={this.onUsernameEnter} 
					label="Enter Lobby" 
				/>
			</form>
		)
	}
}