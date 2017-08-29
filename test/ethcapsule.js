const assertJump = require('./helpers/assertJump');
const ether = require('./helpers/ether');
const increaseTime = require('./helpers/increaseTime');

const increaseTimeTo = increaseTime.increaseTimeTo;
const duration = increaseTime.duration;

const EthCapsule = artifacts.require("./EthCapsule.sol");

contract('EthCapsule', accounts => {
  const DEFAULT_MIN_DEPOSIT = ether(0.001);
  const DEFAULT_MAX_DURATION = duration.years(5);

  beforeEach(function () {
    return EthCapsule.new()
      .then(instance => {
        this.ethcapsule = instance;
      })
  });

  it('should allow owner to set minimum deposit', function (done) {
    const MIN_DEPOSIT_TO_SET = ether(0.002);

    this.ethcapsule.setMinDeposit(MIN_DEPOSIT_TO_SET, {
      from: accounts[0]
    })
      .then(() => {
        return this.ethcapsule.minDeposit()
          .then(minDeposit => {
            assert.deepEqual(MIN_DEPOSIT_TO_SET, minDeposit.toNumber());
            done();
          });
      });
  });

  it('should prevent non-owners from setting minimum deposit', function (done) {
    const MIN_DEPOSIT_TO_SET = ether(0.002);
    
    this.ethcapsule.setMinDeposit(MIN_DEPOSIT_TO_SET, {
      from: accounts[1]
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });

  it('should allow owner to set max duration', function (done) {
    const MAX_DURATION_TO_SET = duration.years(1);

    this.ethcapsule.setMaxDuration(MAX_DURATION_TO_SET, {
      from: accounts[0]
    })
      .then(() => {
        return this.ethcapsule.maxDuration()
          .then(maxDuration => {
            assert.equal(MAX_DURATION_TO_SET, maxDuration.toNumber());
            done();
          });
      });
  });

  it('should prevent non-owners from setting max duration', function (done) {
    const MAX_DURATION_TO_SET = duration.years(1);
    
    this.ethcapsule.setMaxDuration(MAX_DURATION_TO_SET, {
      from: accounts[1]
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });

  it('should prevent users from burying less than the minimum deposit', function (done) {
    const MSG_VALUE = DEFAULT_MIN_DEPOSIT - ether(0.00001);
    const DURATION = duration.seconds(60);

    this.ethcapsule.bury(DURATION, {
      from: accounts[1],
      value: MSG_VALUE
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });

  it('should allow user to bury a capsule', function (done) {
    const MSG_VALUE = ether(1.123);
    const DURATION = duration.seconds(60);

    this.ethcapsule.bury(DURATION, {
      from: accounts[1],
      value: MSG_VALUE
    })
      .then(() => {
        return this.ethcapsule.getCapsuleInfo(1, {
          from: accounts[1]
        });
      })
      .then(response => {
        assert.equal(response[0].toNumber(), MSG_VALUE);
        done();
      });
  });
});
