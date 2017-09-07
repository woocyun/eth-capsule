import React, { Component } from 'react';

import Sheet from './Sheet';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

class CreateCapsule extends Component {
  constructor(props){
    super(props);

    this.state = {
      formValues: {
        depositValue: 0,
        dateValue: null,
        timeValue: null
      },
      dateError: '',
      timeError: '',
      valueError: ''
    };

    this.handleDepositChange = this.handleDepositChange.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleTimeSelect = this.handleTimeSelect.bind(this);
    this.verifyAndSubmit = this.verifyAndSubmit.bind(this);
  }

  handleDepositChange(evt, depositValue) {
    this.setState(prevState => {
      return {
        valueError: '',
        formValues: Object.assign({}, prevState.formValues, {
          depositValue
        })
      };
    });
  }

  handleDateSelect(ignore, dateValue) {
    this.setState(prevState => {
      return {
        dateError: '',
        formValues: Object.assign({}, prevState.formValues, {
          dateValue
        })
      };
    });
  }

  handleTimeSelect(ignore, timeValue) {
    this.setState(prevState => {
      return {
        timeError: '',
        formValues: Object.assign({}, prevState.formValues, {
          timeValue
        })
      };
    });
  }

  verifyAndSubmit() {
    const {
      formValues,
      formValues: {
        dateValue,
        timeValue,
        depositValue
      }
    } = this.state;

    const dateRequired = !dateValue;
    const timeRequired = !timeValue;
    const valueRequired = depositValue === '';
    const valueTooLow = depositValue <= 0;

    if (dateRequired) {
      this.setState({
        dateError: 'Date is required.'
      });
    }

    if (timeRequired) {
      this.setState({
        timeError: 'Time is required.'
      });
    }

    if (valueRequired) {
      this.setState({
        valueError: 'Amount is required.'
      });
    } else if (valueTooLow) {
      this.setState({
        valueError: 'Please input a value greater than 0.'
      });
    }

    if (dateRequired || timeRequired || valueRequired || valueTooLow) return;
    this.props.onDeposit(formValues);
  }

  render() {
    const {
      handleDepositChange,
      handleDateSelect,
      handleTimeSelect
    } = this;

    const {
      dateError,
      timeError,
      valueError,
      formValues: {
        dateValue,
        timeValue,
        depositValue
      }
    } = this.state;
  
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <Sheet>
          <div>
            <DatePicker
              errorText={dateError}
              hintText="Date"
              value={dateValue}
              onChange={handleDateSelect}
            />
          </div>
          <br />
          <div>
            <TimePicker
              errorText={timeError}
              format="ampm"
              hintText="Time"
              value={timeValue}
              onChange={handleTimeSelect}
            />
          </div>
          <br />
          <div>
            <TextField
              errorText={valueError}
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
              onClick={this.verifyAndSubmit}
            />
          </div>
          <div style={{ fontSize: 11, textAlign: 'left', padding: 30, marginTop: 75 }}>
            <p>* Current max lock duration is 5 years. Setting the date past 5 years from now will result in a failed transaction.</p>
            <Divider />
            <p>* Current min lock duration is 0. Setting the date before the current time will automatically default to a 0 duration, which means your capsule will be immediately available to dig up.</p>
          </div>
        </Sheet>
      </div>
    );
  }
}

export default CreateCapsule;