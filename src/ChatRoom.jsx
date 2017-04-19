import React from 'react';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

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
			users.push(<ListItem onClick={this.choosePartner.bind(null, item.name)} disabled={!item.isFree || item.name === this.props.username} primaryText={item.name} />);
			users.push(<Divider />)
		}
		return users
	}

	renderMsgList() {
		const msgs = [];
		for (var msg of this.state.msgList) {
			const className = msg[0] === 0 ? "mine" : "partners";
			const speaker = msg[0] === 0 ? this.props.username : this.state.partner;

			msgs.push(<ListItem secondaryText={speaker} primaryText={msg[1]} />);
		}
		return msgs;
	}

	render() {
		return (
			<div>
				{this.state.partnerIsChosen ? 
					<Paper zDepth={1} >
						<TextField name="message" onChange={this.onMsgChange} value={this.state.currMsg} />
						<FlatButton onClick={this.submitMsg} label="Send" />
						<List>
							{this.renderMsgList()}
						</List>
					</Paper>					
					:
					<List>
						<ListItem primaryText={"User list"} disabled={true}/>
						<Divider />
						{this.renderPartnerList()}
					</List>
				}
			</div>
		)
	}

}