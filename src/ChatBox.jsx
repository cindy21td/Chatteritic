import React from 'react';
import ChatRoom from './ChatRoom.jsx';
import ChatEntry from './ChatEntry.jsx';

export default class ChatBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			isInit: false
		}

		this.onUsernameEnter = this.onUsernameEnter.bind(this);
	}

	onUsernameEnter(val) {
		this.setState({
			username: val,
			isInit: true
		});
	}

	render() {
		return (
			<div>
				{this.state.isInit ? 
					<ChatRoom username={this.state.username} />
					:
					<ChatEntry onEnter={this.onUsernameEnter} />
				}
			</div>
		)
	}

}