import React from 'react';

export default class ChatEntry extends React.Component {

	static propTypes = {
    	onEnter: React.PropTypes.func,
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
				<label>User name:</label>
				<input type="text" value={this.state.username} onChange={this.onUsernameChange}/>
				<button onClick={this.onUsernameEnter}> Enter chat room </button>
			</div>
		)
	}
}