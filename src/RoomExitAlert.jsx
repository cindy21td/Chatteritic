import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class RoomExitAlert extends React.Component {

    static propTypes = {
      onConfirm: React.PropTypes.func
    };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.handleDiscard = this.handleDiscard.bind(this);
  }

  handleOpen() {
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  handleDiscard() {
    this.setState({
      open: false
    });

    this.props.onConfirm();
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Discard"
        primary={true}
        onTouchTap={this.handleDiscard}
        onClick={this.handleDiscard}
      />,
    ];

    return (
      <div>
        <RaisedButton 
          primary={true}
          label="Return to Lobby" 
          onClick={this.handleOpen} 
          onClick={this.handleOpen} 
        />
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Discard this chattering? (Messages will not be saved)
        </Dialog>
      </div>
    );
  }
}