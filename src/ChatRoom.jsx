import React from 'react';

export default class ChatBox extends React.Component {

	static propTypes = {
    	username: React.PropTypes.string,
    	socket: React.PropTypes.object
  	};

	constructor(props) {
		super(props);
		this.state = {
			msgList: [],
			currMsg: '',
			partnerIsChosen: false,
			partnersList: [],
			partner: ''
		}

		// socket listener
		this.props.socket.on('receive message', (msg) => this.updateMsgList(msg));
		this.props.socket.on('available partners', (users) => this.updatePartnerList(users));
		this.props.socket.on('assign partner', (name) => this.setState({
			partnerIsChosen: true,
			partner: name
		}));
		this.props.socket.on('partner disconnect', () => this.exitRoom());

		this.renderMsgList = this.renderMsgList.bind(this);
		this.renderPartnerList = this.renderPartnerList.bind(this);

		this.onMsgChange = this.onMsgChange.bind(this);
		this.submitMsg = this.submitMsg.bind(this);
		this.choosePartner = this.choosePartner.bind(this);
	}

	exitRoom() {
		this.setState({
			msgList: [],
			partnerIsChosen: false,
			partner: ''
		});
	}

	updatePartnerList(users) {
		this.setState({
			partnersList: users
		});
	}

	updateMsgList(msg) {
		const msgList = this.state.msgList;
		msgList.push(msg);
		this.setState({
			msgList: msgList
		});
	}

	choosePartner(name) {
		this.props.socket.emit('choose partner', name);
	}

	onMsgChange(e) {
		this.setState({
			currMsg: e.target.value
		});
	}

	submitMsg() {
		// emit to socket
		this.props.socket.emit('send message', this.state.currMsg);

		this.setState({
			currMsg: ''
		});
	}

	renderPartnerList() {
		const users = [];
		for (var item of this.state.partnersList) {
			users.push(<div><button onClick={this.choosePartner.bind(null, item.name)} disabled={!item.isFree || item.name === this.props.username}>{item.name}</button></div>);
		}
		return users
	}

	renderMsgList() {
		const msgs = [];
		for (var msg of this.state.msgList) {
			const className = msg[0] === 0 ? "mine" : "partners";
			const speaker = msg[0] === 0 ? this.props.username : this.state.partner;

			msgs.push(<p className={className}><label>{speaker}</label><span>{msg[1]}</span></p>);
		}
		return msgs;
	}

	render() {
		return (
			<div>
				{this.state.partnerIsChosen ? 
					<div>
						<input type="text" onChange={this.onMsgChange} value={this.state.currMsg} />
						<button className="button" onClick={this.submitMsg}> Send </button>
						<div>
							{this.renderMsgList()}
						</div>
					</div>					
					:
					<div>
						<h1>User list:</h1>
						{this.renderPartnerList()}
					</div>
				}
			</div>
		)
	}

}