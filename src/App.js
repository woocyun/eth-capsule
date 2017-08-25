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
      .then(this.getContractValue);
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

  instantiateContract() {
    const ethCapsuleContract = contract(EthCapsuleContract);

    ethCapsuleContract.setProvider(this.state.web3.currentProvider);

    return ethCapsuleContract.deployed()
      .then((contractInstance) => {
        this.setState({ contractInstance });
      });
  }

  getNumberOfCapsules() {
    return this.state.contractInstance.getNumberOfCapsules()
      .then(capsules => {
        return capsules.toNumber();
      });
  }

  getCapsules(numberOfCapsules) {
    this.setState({
      capsulesLoading: true
    });

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

  getContractValue() {
    return this.state.contractInstance.getContractValue()
      .then(response => response.toNumber())
      .then(contractValue => {
        this.setState({
          contractValue
        });
      });
  }

  handleCapsuleRedirect(id) {
    // const capsules = this.state.capsules;

    return () => {
      // let match;
      
      // capsules.forEach((_capsule, idx) => {
      //   if (_capsule === capsule) match = idx + 1;
      // });

      this.props.history.push(`/${id}`);

      // console.log(capsuleIndex, this.props.history);
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
          console.log(response);
        });
    };
  }

  render() {
    const {
      account,
      balance,
      capsules,
      capsulesLoading,
      contractInstance,
      contractValue,
      web3
    } = this.state;

    const {
      getCapsules,
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
        getCapsules={getCapsules}
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
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App
