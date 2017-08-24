import React from 'react';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const CreateCapsule = (props) => {
  const {
    dateValue,
    timeValue,
    depositValue,
    onDateSelect,
    onTimeSelect,
    onDepositChange,
    onDeposit
  } = props;

  return (
    <div>
      <div>
        <DatePicker
          hintText="Date to bury ether until"
          value={dateValue}
          onChange={onDateSelect}
        />
      </div>
      <br />
      <div>
        <TimePicker
          format="ampm"
          hintText="Time of day to bury ether until"
          value={timeValue}
          onChange={onTimeSelect}
        />
      </div>
      <br />
      <div>
        <TextField
          floatingLabelText="Amount to Deposit"
          type="number"
          value={depositValue}
          onChange={onDepositChange}
        />
      </div>
      <br />
      <div>
        <RaisedButton
          label="Bury"
          primary={true}
          onClick={onDeposit}
        />
      </div>
    </div>
  );
};

export default CreateCapsule;