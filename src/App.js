import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import EthCapsuleContract from '../build/contracts/EthCapsule.json';
import getWeb3 from './utils/getWeb3';
import contract from 'truffle-contract';

import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import HeadToolbar from './components/HeadToolbar';
import Capsules from './components/Capsules.js';
import CapsuleItem from './components/CapsuleItem.js';
import CreateCapsule from './components/CreateCapsule';
import CommunityStats from './components/CommunityStats';
import FAQ from './components/FAQ';
import Loading from './components/Loading';
import Snackbar from 'material-ui/Snackbar';

const VIEW_PATH = '/view/';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: null,
      capsule: null,
      capsules: [],
      capsulesLoading: true,
      contractInstance: null,
      contractValue: 0,
      depositedValue: 0,
      depositing: false,
      initialFormValues: {
        date: null,
        time: null,
        value: 0
      },
      networkValid: true,
      snackbarMessage: 'OK',
      snackbarOpen: false,
      totalCapsules: 0,
      totalValue: 0,
      totalBuriedCapsules: 0,
      getTotalBuriedValue: 0,
      valueWhenBuried: 0,
      valueWhenUnlocked: 0,
      web3: null,
      withdrawing: false
    };

    this.getWeb3 = this.getWeb3.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.instantiateContract = this.instantiateContract.bind(this);
    this.getNumberOfCapsules = this.getNumberOfCapsules.bind(this);
    this.getCapsules = this.getCapsules.bind(this);
    this.getCapsuleInfo = this.getCapsuleInfo.bind(this);
    this.getTotalCapsules = this.getTotalCapsules.bind(this);
    this.getTotalValue = this.getTotalValue.bind(this);
    this.getTotalBuriedCapsules = this.getTotalBuriedCapsules.bind(this);
    this.getTotalBuriedValue = this.getTotalBuriedValue.bind(this);
    this.handleCapsuleSelect = this.handleCapsuleSelect.bind(this);
    this.handleDeposit = this.handleDeposit.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleSnackbarOpen = this.handleSnackbarOpen.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.ifOnViewPage = this.ifOnViewPage.bind(this);
    this.ifReloadedOnViewPage = this.ifReloadedOnViewPage.bind(this);
    this.checkNetwork = this.checkNetwork.bind(this);
  }

  componentDidMount() {
    this.getWeb3()
      .then(this.checkNetwork)
      .then(this.getAccounts)
      .then(this.instantiateContract)
      .then(this.getNumberOfCapsules)
      .then(this.getCapsules)
      .then(this.ifReloadedOnViewPage)
      .then(this.getTotalCapsules)
      .then(this.getTotalValue)
      .then(this.getTotalBuriedCapsules)
      .then(this.getTotalBuriedValue);
    
    this.props.history.listen((location) => {
      if (location.pathname === '/') {
        this.getNumberOfCapsules()
          .then(this.getCapsules);
        
        this.getAccounts()
          .then(this.getTotalCapsules)
          .then(this.getTotalValue)
          .then(this.getTotalBuriedCapsules)
          .then(this.getTotalBuriedValue);
      } else if (this.ifOnViewPage(location.pathname)) {
        setTimeout(() => {
          // Works, but don't include until I figure out caching issue
          // this.getPriceData(this.state.capsule.lockTime, this.state.capsule.unlockTime);
        });
      }
    });
  }

  checkNetwork() {
    return new Promise((resolve, reject) => {
      this.state.web3.version.getNetwork((err, networkId) => {
        if (err) {
          reject(err);
        } else {
          if (networkId !== '42' && networkId !== '1') {
            this.setState({ networkValid: false });
          }

          resolve(networkId);
        }
      });
    });
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
    })
      .then(accounts => {
        this.setState({ account: accounts[0] });
      });
  }

  getNumberOfCapsules() {
    this.setState({
      capsulesLoading: true
    });

    return this.state.contractInstance.getNumberOfCapsules({
      from: this.state.account
    })
      .then(capsules => {
        return capsules.toNumber();
      });
  }

  getCapsuleInfo(id) {
    return this.state.contractInstance.getCapsuleInfo(id, {
      from: this.state.account
    })
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

  getPriceData(buriedTS, unlockTS) {
    const URL = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=';

    console.log(buriedTS, unlockTS);

    return Promise.all([
      axios.get(URL + buriedTS),
      axios.get(URL + unlockTS)
    ])
      .then(response => {
        this.setState({
          valueWhenBuried: response[0].data.ETH.USD,
          valueWhenUnlocked: response[1].data.ETH.USD
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

  handleCapsuleSelect(id, redirect) {
    return () => {
      this.setState((prevState) => ({ capsule: prevState.capsules.find(capsule => capsule.id === id) }));

      if (redirect) {
        this.props.history.push(`/view/${id}`);
      }
    };
  }

  handleDeposit({ dateValue, timeValue, depositValue }) {
    return () => {
      this.setState(prevState => ({
        depositing: true,
        initialFormValues: Object.assign({}, prevState.initialFormValues, {
          date: dateValue,
          time: timeValue,
          value: depositValue
        })
      }));
  
      const {
        account,
        contractInstance,
        web3
      } = this.state;
  
      const selectedDateTime = new Date(moment(dateValue).format('ddd MMM DD YYYY') + ' ' + moment(timeValue).format('HH:mm'));
      const unlockTimeInSeconds = selectedDateTime.valueOf() / 1000;
  
      return contractInstance.bury(
        unlockTimeInSeconds,
        {
          from: account,
          value: web3.toWei(depositValue, 'ether')
        }
      )
        .then(response => {
          this.setState(prevState => ({
            depositing: false,
            initialFormValues: Object.assign({}, prevState.initialFormValues, {
              date: null,
              time: null,
              value: 0
            })
          }));

          this.props.history.push('/');
          this.handleSnackbarOpen(`Successfully buried ${depositValue} ethers until ` + (timeValue ? moment(timeValue).format('hh:mm A') : '') + ' on ' + (dateValue ? moment(dateValue).format('MMMM Do, YYYY') : ''));
        })
        .catch(error => {
          this.setState(prevState => ({
            depositing: false
          }));

          this.handleSnackbarOpen('' + error);
        });
    };
  }
  
  handleSnackbarClose() {
    this.setState({
      snackbarOpen: false
    });
  }

  handleSnackbarOpen(message) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message
    });
  }

  handleWithdraw(id) {
    const {
      account,
      contractInstance,
      capsules,
      web3
    } = this.state;

    const capsule = capsules.find(capsule => capsule.id === id);

    return () => {
      this.setState({ withdrawing: true });

      return contractInstance.dig(id, {
        from: account
      })
        .then(response => {
          this.setState({ withdrawing: false });
          this.props.history.push('/');
          this.handleSnackbarOpen(`Successfully withdrew ${web3.fromWei(capsule.value, 'ether').toString()} ethers from Capsule ${capsule.id}`);
        })
        .catch(error => {
          this.setState({ withdrawing: false });
          this.handleSnackbarOpen('' + error);
        });
    };
  }

  ifOnViewPage(_pathname) {
    const pathname = _pathname || this.props.location.pathname;
    if (pathname.indexOf(VIEW_PATH) >= 0) {
      return Number(pathname.slice(VIEW_PATH.length))
    }
    
    return false;
  }

  ifReloadedOnViewPage() {
    const viewPageParam = this.ifOnViewPage();

    if (!this.state.capsule && viewPageParam) {
      this.handleCapsuleSelect(viewPageParam)();
      // this.getPriceData(this.state.capsule.lockTime, this.state.capsule.unlockTime);
    }
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
      capsule,
      capsules,
      capsulesLoading,
      depositing,
      initialFormValues,
      networkValid,
      snackbarMessage,
      snackbarOpen,
      totalCapsules,
      totalValue,
      totalBuriedCapsules,
      totalBuriedValue,
      valueWhenBuried,
      valueWhenUnlocked,
      web3,
      withdrawing
    } = this.state;

    const {
      handleCapsuleSelect,
      handleDeposit,
      handleSnackbarClose,
      handleWithdraw
    } = this;

    const capsulesComponent = (props) => (
      <Capsules
        capsules={capsules}
        capsulesLoading={capsulesLoading}
        history={props.history}
        onCapsuleSelect={handleCapsuleSelect}
        web3={web3}
      />
    );

    const capsuleItemComponent = (props) => (
      <CapsuleItem
        capsule={capsule}
        onWithdraw={handleWithdraw}
        paramId={props.match.params.id}
        selectCapsule={handleCapsuleSelect}
        valueWhenBuried={valueWhenBuried}
        valueWhenUnlocked={valueWhenUnlocked}
        web3={web3}
      />
    );

    const createComponent = (props) => (
      <CreateCapsule
        onDeposit={handleDeposit}
        initialFormValues={initialFormValues}
      />
    );

    const faqComponent = (props) => (
      <FAQ
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
          <Paper className="main-paper" style={{ maxWidth: 1000, margin: '40px auto', position: 'relative' }}>
            <HeadToolbar />
            <Route exact path="/" component={capsulesComponent} />
            <Route path="/view/:id" component={capsuleItemComponent} />
            <Route path="/create" component={createComponent} />
            <Route path="/faq" component={faqComponent} />
            {(depositing || withdrawing) &&
              <Loading />
            }
          </Paper>
          <Paper className="secondary-paper" style={{ maxWidth: 1000, margin: '40px auto' }}>
            <CommunityStats
              totalCapsules={totalCapsules}
              totalValue={totalValue}
              totalBuriedCapsules={totalBuriedCapsules}
              totalBuriedValue={totalBuriedValue}
              web3={web3}
            />
          </Paper>
          <Snackbar
            open={snackbarOpen}
            message={snackbarMessage}
            autoHideDuration={4000}
            onRequestClose={handleSnackbarClose}
          />
          {networkValid ||
            <div
              style={{
                position: 'fixed',
                top: 64,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                padding: '10%',
                textAlign: 'center',
                zIndex: 100
              }}
            >
              <h2>
                Eth Capsule is deployed on the main Ethereum network and the Kovan test network.
              </h2>
              <h2>
                Please configure your Dapp browser to connect to one of these networks in order to use Eth Capsule.
              </h2>
            </div>
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App
