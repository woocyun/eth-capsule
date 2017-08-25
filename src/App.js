import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import EthCapsuleContract from '../build/contracts/EthCapsule.json'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract';

import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import HeadToolbar from './components/HeadToolbar';
import Capsules from './components/Capsules.js';
import CapsuleItem from './components/CapsuleItem.js';
import CreateCapsule from './components/CreateCapsule';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: null,
      capsules: [],
      capsulesLoading: true,
      contractInstance: null,
      contractValue: 0,
      depositedValue: 0,
      totalCapsules: 0,
      totalValue: 0,
      totalBuriedCapsules: 0,
      getTotalBuriedValue: 0,
      web3: null
    };

    this.getWeb3 = this.getWeb3.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.instantiateContract = this.instantiateContract.bind(this);
    this.getContractValue = this.getContractValue.bind(this);
    this.getNumberOfCapsules = this.getNumberOfCapsules.bind(this);
    this.getCapsules = this.getCapsules.bind(this);
    this.getCapsuleInfo = this.getCapsuleInfo.bind(this);
    this.getTotalCapsules = this.getTotalCapsules.bind(this);
    this.getTotalValue = this.getTotalValue.bind(this);
    this.getTotalBuriedCapsules = this.getTotalBuriedCapsules.bind(this);
    this.getTotalBuriedValue = this.getTotalBuriedValue.bind(this);
    this.handleCapsuleRedirect = this.handleCapsuleRedirect.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
  }

  componentDidMount() {
    this.getWeb3()
      .then(this.getAccounts)
      .then(this.getBalance)
      .then(this.instantiateContract)
      .then(this.getNumberOfCapsules)
      .then(this.getCapsules)
      .then(this.getContractValue)
      .then(this.getTotalCapsules)
      .then(this.getTotalValue)
      .then(this.getTotalBuriedCapsules)
      .then(this.getTotalBuriedValue);
    
    this.props.history.listen((location) => {
      if (location.pathname === '/') {
        this.getNumberOfCapsules()
          .then(this.getCapsules);
        
        this.getAccounts()
          .then(this.getBalance)
          .then(this.getContractValue)
          .then(this.getTotalCapsules)
          .then(this.getTotalValue)
          .then(this.getTotalBuriedCapsules)
          .then(this.getTotalBuriedValue);
      }
    });
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
    })
      .then(accounts => {
        this.setState({ account: accounts[0] });
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
    })
      .then(balance => {
        this.setState({ balance });
      });
  }

  getNumberOfCapsules() {
    this.setState({
      capsulesLoading: true
    });

    return this.state.contractInstance.getNumberOfCapsules()
      .then(capsules => {
        return capsules.toNumber();
      });
  }

  getCapsuleInfo(id) {
    return this.state.contractInstance.getCapsuleInfo(id)
      .then(response => {
        return {
          value: response[0].toNumber(),
          id: response[1].toNumber(),
          lockTime: response[2].toNumber(),
          unlockTime: response[3].toNumber(),
          withdrawnTime: response[4].toNumber()
        };
      });
  }

  getCapsules(numberOfCapsules) {
    const capsulesPromises = Array
      .from(new Array(numberOfCapsules), (val, index) => index + 1)
      .map(num => this.getCapsuleInfo(num));

    return Promise.all(capsulesPromises)
      .then(capsules => {
        this.setState({
          capsules: capsules.sort((prevCap, nextCap) => prevCap.unlockTime < nextCap.unlockTime),
          capsulesLoading: false
        });
      });
  }

  getContractValue() {
    return this.state.contractInstance.getContractValue()
      .then(response => response.toNumber())
      .then(contractValue => {
        this.setState({
          contractValue
        });
      });
  }

  getTotalCapsules() {
    return this.state.contractInstance.totalCapsules()
      .then(response => {
        this.setState({ totalCapsules: response.toNumber() });
      });
  }

  getTotalValue() {
    return this.state.contractInstance.totalValue()
      .then(response => {
        this.setState({ totalValue: response.toNumber() });
      });
  }

  getTotalBuriedCapsules() {
    return this.state.contractInstance.totalBuriedCapsules()
      .then(response => {
        this.setState({ totalBuriedCapsules: response.toNumber() });
      });
  }

  getTotalBuriedValue() {
    return this.state.contractInstance.totalBuriedValue()
      .then(response => {
        this.setState({ totalBuriedValue: response.toNumber() });
      });
  }

  handleCapsuleRedirect(id) {
    return () => {
      this.props.history.push(`/${id}`);
    };
  }

  handleWithdraw(id) {
    const {
      account,
      contractInstance
    } = this.state;

    return () => {
      return contractInstance.dig(id, {
        from: account,
        gas: 3000000,
        gasPrice: 1000
      })
        .then(response => {
          this.props.history.push('/');
        });
    };
  }

  instantiateContract() {
    const ethCapsuleContract = contract(EthCapsuleContract);

    ethCapsuleContract.setProvider(this.state.web3.currentProvider);

    return ethCapsuleContract.deployed()
      .then((contractInstance) => {
        this.setState({ contractInstance });
      });
  }

  render() {
    const {
      account,
      balance,
      capsules,
      capsulesLoading,
      contractInstance,
      contractValue,
      totalCapsules,
      totalValue,
      totalBuriedCapsules,
      totalBuriedValue,
      web3
    } = this.state;

    const {
      handleCapsuleRedirect,
      handleWithdraw
    } = this;

    const capsulesComponent = () => (
      <Capsules
        capsules={capsules}
        capsulesLoading={capsulesLoading}
        onCapsuleRedirect={handleCapsuleRedirect}
        web3={web3}
      />
    );

    const capsuleItemComponent = (props) => (
      <CapsuleItem
        capsules={capsules}
        capsuleId={props.match.params.id}
        onWithdraw={handleWithdraw}
        web3={web3}
      />
    );

    const createComponent = (props) => (
      <CreateCapsule
        account={account}
        contractInstance={contractInstance}
        web3={web3}
        history={props.history}
      />
    );

    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            title="Eth Capsule"
            titleStyle={{ fontWeight: 100 }}
            iconStyleLeft={{ display: 'none' }}
          />
          <Paper style={{ maxWidth: 1000, margin: '40px auto' }}>
            <HeadToolbar
            />
            <Route exact path="/" component={capsulesComponent} />
            <Route path="/:id" component={capsuleItemComponent} />
            <Route path="/create" component={createComponent} />
          </Paper>
          <p onClick={this.incrementFoo}>
            Your MetaMask account: {account}
          </p>
          <p>
            Your MetaMask balance: {web3 ? web3.fromWei(balance, 'ether').toString() : 0} Ether
          </p>
          <p>
            Contract Value: {web3 ? web3.fromWei(contractValue, 'ether').toString() : 0} Ether
          </p>
          <p>
            Total capsules created: {totalCapsules}
          </p>
          <p>
            Total value: {web3 ? web3.fromWei(totalValue, 'ether').toString() : 0} Ether
          </p>
          <p>
            Total buried capsules: {totalBuriedCapsules}
          </p>
          <p>
            Total buried value: {web3 ? web3.fromWei(totalBuriedValue, 'ether').toString() : 0} Ether
          </p>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App
