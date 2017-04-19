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

		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.onUsernameEnter = this.onUsernameEnter.bind(this);
	}

	onUsernameChange(e) {
		this.setState({
			username: e.target.value
		});
	}

	onUsernameEnter() {
		this.props.onEnter(this.state.username);
	}


	render() {
		return (
			<div>
				<TextField name="username" floatingLabelText="Username" value={this.state.username} onChange={this.onUsernameChange} errorText={this.props.nameIsTaken ? "Username is already taken." : ''}/>
				<FlatButton onClick={this.onUsernameEnter} label="Enter chat room" />
			</div>
		)
	}
}