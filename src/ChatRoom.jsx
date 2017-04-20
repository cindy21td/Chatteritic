import React from 'react';

import Avatar from 'material-ui/Avatar';
import ImageLens from 'material-ui/svg-icons/image/lens';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import {red500, green500} from 'material-ui/styles/colors';

import RoomExitAlert from './RoomExitAlert.jsx';

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
		this.props.socket.on('partner exit', () => this.setState({
			msgList: [],
			partnerIsChosen: false,
			partner: ''
		}));

		this.props.socket.on('partner disconnect', () => this.exitRoom());

		this.renderMsgList = this.renderMsgList.bind(this);
		this.renderPartnerList = this.renderPartnerList.bind(this);

		this.onMsgChange = this.onMsgChange.bind(this);
		this.submitMsg = this.submitMsg.bind(this);
		this.choosePartner = this.choosePartner.bind(this);
		this.exitRoom = this.exitRoom.bind(this);
	}

	exitRoom() {
		this.props.socket.emit('exit room', this.state.partner);

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
		if (this.state.currMsg.trim() == '') {
			return;
		}
		// emit to socket
		this.props.socket.emit('send message', this.state.currMsg);

		this.setState({
			currMsg: ''
		});
	}

	renderPartnerList() {
		const users = [];
		for (var item of this.state.partnersList) {
			if (item.name === this.props.username) {
				continue;
			}
			
			let avatar;
			if (item.isFree) {
				// user is available
				avatar = (<Avatar icon={<ImageLens />} color={green500} />);
			} else {
				avatar = (<Avatar icon={<ImageLens />} color={red500} />);
			}

			users.push(<ListItem 
							key={item.name}
							rightAvatar={avatar} 
							onTouchTap={this.choosePartner.bind(null, item.name)} 
							onClick={this.choosePartner.bind(null, item.name)} 
							disabled={item.isFree === "false"} 
							primaryText={item.name} 
						/>
			);
			users.push(<Divider key={"div-" + item.name}/>)
		}
		return users;
	}

	renderMsgList() {
		const msgs = [];
		let idx = 0;
		for (var msg of this.state.msgList) {
			const className = msg[0] === 0 ? "mine" : "partners";
			const speaker = msg[0] === 0 ? this.props.username : this.state.partner;

			msgs.push(<ListItem key={'msg-' + idx} secondaryText={speaker} primaryText={msg[1]} />);
			idx += 1;
		}
		return msgs;
	}

	render() {
		return (
			<div>
				{this.state.partnerIsChosen ? 
					<Paper zDepth={1} >
						<RoomExitAlert onConfirm={this.exitRoom}/>
						<List>
							{this.renderMsgList()}
						</List>
						<form onSubmit={(e) => {
								e.preventDefault();
								this.submitMsg();
							}}
						>
							<TextField 
								name="message" 
								onChange={this.onMsgChange} 
								value={this.state.currMsg} 
							/>
							<FlatButton 
								onTouchTap={this.submitMsg} 
								onClick={this.submitMsg} 
								label="Send" 
							/>
						</form>
					</Paper>					
					:
					<List style={{maxWidth: 350}}>
						<Subheader>Chatters</Subheader>
						{this.renderPartnerList()}
					</List>
				}
			</div>
		)
	}

}