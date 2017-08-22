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
      storageValue: 0,
      web3: null,
      account: null,
      simpleStorageInstance: null
    };

    this.getWeb3 = this.getWeb3.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.instantiateContract = this.instantiateContract.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.getWeb3()
      .then(web3 => {
        this.setState({ web3 });
        this.runBlockChecker();
      })
      .then(this.getAccounts)
      .then(accounts => {
        this.setState({ account: accounts[0] });
      })
      .then(this.getBalance)
      .then(balance => {
        this.setState({ balance });
      })
      .then(this.instantiateContract);
  }

  getWeb3() {
    return getWeb3
      .then(({ web3 }) => {
        window.web3 = web3;
        this.setState({ web3 });
        return web3;
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

  handleChange(evt, newVal) {
    this.setState({ inputValue: newVal });
  }

  handleSubmit() {
    this.state.simpleStorageContractInstance.set(this.state.inputValue, { from: this.state.account })
      .then(response => {
        console.log(response);

        this.state.simpleStorageContractInstance.get.call()
          .then(result => {
            const storageValue = result.toNumber();
            this.setState({ storageValue });
          });
        
        this.getBalance()
          .then(balance => {
            this.setState({ balance });
          });
      });
  }

  instantiateContract() {
    const simpleStorageContract = contract(SimpleStorageContract);

    simpleStorageContract.setProvider(this.state.web3.currentProvider);

    return simpleStorageContract.deployed()
      .then((instance) => {
        this.setState({ simpleStorageContractInstance: instance });
      })
      .then(() => {
        this.state.simpleStorageContractInstance.get.call()
          .then(result => {
            const storageValue = result.toNumber();
            this.setState({ storageValue, inputValue: storageValue  });
          });
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
      storageValue,
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
              Storage Value: {storageValue}
            </p>
            <p>
              Current Block: {currentBlock}
            </p>
            <Paper
              style={{ maxWidth: 800, margin: 'auto', textAlign: 'center', padding: 20 }}
            >
              <div>
                <TextField
                  floatingLabelText="Number to Store"
                  type="number"
                  value={inputValue}
                  onChange={this.handleChange}
                />
              </div>
              <br />
              <div>
                <RaisedButton
                  label="Change"
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
