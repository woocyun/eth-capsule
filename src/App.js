import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import moment from 'moment';
import EthCapsuleContract from '../build/contracts/EthCapsule.json'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract';

import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import HeadToolbar from './components/HeadToolbar';
import CapsuleList from './components/CapsuleList';
import CreateCapsule from './components/CreateCapsule';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contractValue: 0,
      currentBlock: 0,
      depositValue: 0,
      dateValue: null,
      timeValue: null,
      depositedValue: 0,
      web3: null,
      account: null,
      contractInstance: null,
      capsules: [],
      capsulesLoading: false
    };

    this.getWeb3 = this.getWeb3.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.setBalance = this.setBalance.bind(this);
    this.instantiateContract = this.instantiateContract.bind(this);
    this.handleDepositChange = this.handleDepositChange.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleTimeSelect = this.handleTimeSelect.bind(this);
    this.handleDeposit = this.handleDeposit.bind(this);
    this.getNumberOfCapsules = this.getNumberOfCapsules.bind(this);
    this.getCapsuleInfo = this.getCapsuleInfo.bind(this);
    this.getCapsules = this.getCapsules.bind(this);
    this.getContractValue = this.getContractValue.bind(this);
    this.setContractValue = this.setContractValue.bind(this);
  }

  componentWillMount() {
    this.getWeb3()
      .then(this.runBlockChecker)
      .then(this.getAccounts)
      .then(accounts => {
        this.setState({ account: accounts[0] });
      })
      .then(this.getBalance)
      .then(this.setBalance)
      .then(this.instantiateContract)
      .then((contractInstance) => {
;        this.setState({ contractInstance });
      })
      .then(this.getNumberOfCapsules)
      .then(this.getCapsules)
      .then(this.setCapsules)
      .then(this.getContractValue)
      .then(this.setContractValue);
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

  setBalance(balance) {
    this.setState({ balance });
  }

  getContractValue() {
    return this.state.contractInstance.getContractValue()
      .then(response => response.toNumber());
  }

  setContractValue(contractValue) {
    this.setState({
      contractValue
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

  handleDepositChange(evt, newVal) {
    this.setState({ depositValue: newVal });
  }

  handleDateSelect(ignore, dateValue) {
    this.setState({
      dateValue
    });
  }

  handleTimeSelect(ignore, timeValue) {
    this.setState({
      timeValue
    });
  }

  handleDeposit() {
    this.state.contractInstance.bury(
      new Date(new Date(moment(this.state.dateValue).format('ddd MMM DD YYYY') + ' ' + moment(this.state.timeValue).format('HH:mm:ss')) - new Date()) / 1000,
      {
        from: this.state.account,
        value: this.state.web3.toWei(this.state.depositValue, 'ether'),
        gas: 3000000,
        gasPrice: 1000
      })
      .then(response => {
        console.log(response);
        this.getBalance()
          .then(this.setBalance);

        this.getContractValue()
          .then(this.setContractValue);

        this.getNumberOfCapsules()
          .then(numberOfCapsules => {
            this.getCapsules(numberOfCapsules);
          });
      });
  }

  instantiateContract() {
    const ethCapsuleContract = contract(EthCapsuleContract);
    ethCapsuleContract.setProvider(this.state.web3.currentProvider);
    return ethCapsuleContract.deployed();
  }

  getNumberOfCapsules() {
    return this.state.contractInstance.getNumberOfCapsules()
      .then(capsules => {
        return capsules.toNumber();
      });
  }

  getCapsuleInfo(capsuleNumber) {
    return this.state.contractInstance.getCapsuleInfo(capsuleNumber)
      .then(response => {
        return {
          value: response[0].toNumber(),
          lockTime: response[1].toNumber(),
          duration: response[2].toNumber(),
          unlockTime: response[3].toNumber()
        };
      });
  }

  getCapsules(numberOfCapsules) {
    this.setState({
      capsulesLoading: true
    });

    const capsulesPromises = [];

    for (let i = 0; i < numberOfCapsules; i++) {
      capsulesPromises.push(this.getCapsuleInfo(i + 1));
    }

    return Promise.all(capsulesPromises)
      .then(capsules => {
        this.setState({
          capsules,
          capsulesLoading: false
        });
      });
  }

  render() {
    const {
      account,
      balance,
      capsules,
      capsulesLoading,
      contractValue,
      currentBlock,
      dateValue,
      timeValue,
      depositValue,
      web3
    } = this.state;

    const capsuleListComponent = () => {
      return (
        <CapsuleList
          capsules={capsules}
          capsulesLoading={capsulesLoading}
          web3={web3}
        />
      );
    };

    const createComponent = () => {
      return (
        <CreateCapsule
          dateValue={dateValue}
          timeValue={timeValue}
          depositValue={depositValue}
          onDateSelect={this.handleDateSelect}
          onTimeSelect={this.handleTimeSelect}
          onDeposit={this.handleDeposit}
          onDepositChange={this.handleDepositChange}
        />
      )
    };

    return (
        <MuiThemeProvider>
          <div className="App">
            <AppBar
              title="Eth Capsule"
              titleStyle={{ fontWeight: 100 }}
              iconStyleLeft={{ display: 'none' }}
            />
            <Paper
              style={{ maxWidth: 1000, margin: '40px auto' }}
            >
              <HeadToolbar
              />
              <Route exact path="/" component={capsuleListComponent} />
              <Route path="/create" component={createComponent} />
            </Paper>
            <p>
              Your MetaMask account: {account}
            </p>
            <p>
              Your MetaMask balance: {web3 ? web3.fromWei(balance, 'ether').toString() : 0}
            </p>
            <p>
              Contract Value: {contractValue}
            </p>
            <p>
              Current Block: {currentBlock}
            </p>
          </div>
        </MuiThemeProvider>
    );
  }
}

export default App
