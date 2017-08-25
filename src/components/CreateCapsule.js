import React, { Component } from 'react';
import moment from 'moment';

import Sheet from './Sheet';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class CreateCapsule extends Component {
  constructor(props){
    super(props);

    this.state = {
      depositValue: 0,
      dateValue: null,
      timeValue: null
    };

    this.handleDepositChange = this.handleDepositChange.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleTimeSelect = this.handleTimeSelect.bind(this);
    this.handleDeposit = this.handleDeposit.bind(this);
  }

  handleDepositChange(evt, depositValue) {
    this.setState({ depositValue });
  }

  handleDateSelect(ignore, dateValue) {
    this.setState({ dateValue });
  }

  handleTimeSelect(ignore, timeValue) {
    this.setState({ timeValue });
  }

  handleDeposit() {
    this.props.contractInstance.bury(
      new Date(new Date(moment(this.state.dateValue).format('ddd MMM DD YYYY') + ' ' + moment(this.state.timeValue).format('HH:mm:ss')) - new Date()) / 1000,
      {
        from: this.props.account,
        value: this.props.web3.toWei(this.state.depositValue, 'ether'),
        gas: 3000000,
        gasPrice: 1000
      }
    )
      .then(() => {
        console.log('ok');
      });
  }

  render() {
    const {
      handleDepositChange,
      handleDateSelect,
      handleTimeSelect,
      handleDeposit
    } = this;

    const {
      dateValue,
      timeValue,
      depositValue
    } = this.state;
  
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <Sheet>
          <div>
            <DatePicker
              hintText="Date"
              value={dateValue}
              onChange={handleDateSelect}
            />
          </div>
          <br />
          <div>
            <TimePicker
              format="ampm"
              hintText="Time"
              value={timeValue}
              onChange={handleTimeSelect}
            />
          </div>
          <br />
          <div>
            <TextField
              floatingLabelText="Amount to Deposit"
              type="number"
              value={depositValue}
              onChange={handleDepositChange}
            />
          </div>
          <br />
          <div>
            <RaisedButton
              label="Bury"
              primary={true}
              onClick={handleDeposit}
            />
          </div>
        </Sheet>
      </div>
    );
  }
}

export default CreateCapsule;