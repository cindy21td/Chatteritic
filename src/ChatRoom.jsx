import React from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export default class ChatBox extends React.Component {

	static propTypes = {
    	username: React.PropTypes.string,
  	};

	constructor(props) {
		super(props);
		this.state = {
			msgList: [],
			currMsg: '',
			partnerIsChosen: false
		}

		// socket listener
		socket.on('receive message', (msg) => this.updateMsgList(msg));

		this.renderMsgList = this.renderMsgList.bind(this);

		this.onMsgChange = this.onMsgChange.bind(this);
		this.submitMsg = this.submitMsg.bind(this);
	}

	componentDidMount() {
		socket.emit('new user', this.props.username);
	}

	updateMsgList(msg) {
		const msgList = this.state.msgList;
		msgList.push(msg);
		this.setState({
			msgList: msgList
		});
	}

	onMsgChange(e) {
		this.setState({
			currMsg: e.target.value
		});
	}

	submitMsg() {
		// emit to socket
		socket.emit('send message', this.state.currMsg);

		this.setState({
			currMsg: ''
		});
	}

	renderMsgList() {
		const msgs = [];
		for (var msg of this.state.msgList) {
			msgs.push(<p>{msg}</p>);
		}
		return msgs;
	}

	render() {
		return (
			<div>
				<input type="text" onChange={this.onMsgChange} value={this.state.currMsg} />
				<button onClick={this.submitMsg}> Send </button>

				<div>
					{this.renderMsgList()}
				</div>
			</div>
		)
	}

}