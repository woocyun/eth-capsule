import React, { Component } from 'react'

import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentBlock: 0,
      inputValue: 0,
      depositedValue: 0,
      web3: null,
      account: null,
      simpleStorageInstance: null
    };

    this.getWeb3 = this.getWeb3.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.instantiateContract = this.instantiateContract.bind(this);
    this.getDepositedValue = this.getDepositedValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.runBlockChecker = this.runBlockChecker.bind(this);
  }

  componentWillMount() {
    this.getWeb3()
      .then(this.runBlockChecker)
      .then(this.getAccounts)
      .then(accounts => {
        this.setState({ account: accounts[0] });
      })
      .then(this.getBalance)
      .then(balance => {
        this.setState({ balance });
      })
      .then(this.instantiateContract)
      .then(this.getDepositedValue);
  }

  getWeb3() {
    return getWeb3
      .then(({ web3 }) => {
        window.web3 = web3;
        this.setState({ web3 });
      })
      .catch(err => {
        console.log('Error finding web3.');
        throw err;
      });
  }

  getAccounts() {
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getAccounts((err, accounts) => {
        if (!err) {
          resolve(accounts);
        } else {
          reject(err);
        }
      });
    });
  }

  getBalance() {
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getBalance(this.state.account, undefined, (err, balance) => {
        if (!err) {
          resolve(balance);
        } else {
          reject(err);
        }
      });
    });
  }

  getBlockNumber() {
    return new Promise((resolve, reject) => {
      this.state.web3.eth.getBlockNumber((err, number) => {
        if (!err) {
          resolve(number);
        } else {
          reject(err);
        }
      });
    });
  }

  getDepositedValue() {
    return this.state.simpleStorageContractInstance.getDepositorInfo.call()
      .then(response => {
        this.setState({ depositedValue: response.toNumber() });
      });
  }

  handleChange(evt, newVal) {
    this.setState({ inputValue: newVal });
  }

  handleSubmit() {
    this.state.simpleStorageContractInstance.deposit({ from: this.state.account, value: this.state.inputValue })
      .then(response => {
        this.getBalance()
          .then(balance => {
            this.setState({ balance });
          });
        
        this.getDepositedValue();
      });
  }

  instantiateContract() {
    const simpleStorageContract = contract(SimpleStorageContract);

    simpleStorageContract.setProvider(this.state.web3.currentProvider);

    return simpleStorageContract.deployed()
      .then((instance) => {
        this.setState({ simpleStorageContractInstance: instance });
      });
  }

  runBlockChecker() {
    setInterval(() => {
      this.getBlockNumber()
        .then(number => {
          this.setState({ currentBlock: number });
        });
    }, 5000);
  }

  render() {
    const {
      account,
      balance,
      currentBlock,
      inputValue,
      depositedValue,
      web3
    } = this.state;

    return (
        <MuiThemeProvider>
          <div className="App">
            <AppBar
              title="Eth Capsule"
              titleStyle={{ fontWeight: 100 }}
              iconStyleLeft={{ display: 'none' }}
            />
            <p>
              Your MetaMask account: {account}
            </p>
            <p>
              Your MetaMask balance: {web3 ? web3.fromWei(balance, 'ether').toString() : 0}
            </p>
            <p>
              Your Deposited Value: {depositedValue} Wei / {web3 ? web3.fromWei(depositedValue, 'ether').toString() : 0} Ether
            </p>
            <p>
              Current Block: {currentBlock}
            </p>
            <Paper
              style={{ maxWidth: 800, margin: 'auto', textAlign: 'center', padding: 20 }}
            >
              <div>
                <TextField
                  floatingLabelText="Amount to Deposit"
                  type="number"
                  value={inputValue}
                  onChange={this.handleChange}
                />
              </div>
              <br />
              <div>
                <RaisedButton
                  label="Deposit"
                  primary={true}
                  onClick={this.handleSubmit}
                />
              </div>
            </Paper>
          </div>
        </MuiThemeProvider>
    );
  }
}

export default App
