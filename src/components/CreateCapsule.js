import React, { Component } from 'react';

import Sheet from './Sheet';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class CreateCapsule extends Component {
  constructor(props){
    super(props);

    this.state = {
      formValues: {
        depositValue: 0,
        dateValue: null,
        timeValue: null
      }
    };

    this.handleDepositChange = this.handleDepositChange.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleTimeSelect = this.handleTimeSelect.bind(this);
  }

  handleDepositChange(evt, depositValue) {
    this.setState(prevState => {
      return {
        formValues: Object.assign({}, prevState.formValues, {
          depositValue
        })
      };
    });
  }

  handleDateSelect(ignore, dateValue) {
    this.setState(prevState => {
      return {
        formValues: Object.assign({}, prevState.formValues, {
          dateValue
        })
      };
    });
  }

  handleTimeSelect(ignore, timeValue) {
    this.setState(prevState => {
      return {
        formValues: Object.assign({}, prevState.formValues, {
          timeValue
        })
      };
    });
  }

  render() {
    const {
      handleDepositChange,
      handleDateSelect,
      handleTimeSelect
    } = this;

    const {
      dateValue,
      timeValue,
      depositValue
    } = this.state.formValues;
  
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
              min={0.001}
              value={depositValue}
              onChange={handleDepositChange}
            />
          </div>
          <br />
          <div>
            <RaisedButton
              label="Bury"
              primary={true}
              onClick={this.props.onDeposit(this.state.formValues)}
            />
          </div>
        </Sheet>
      </div>
    );
  }
}

export default CreateCapsule;