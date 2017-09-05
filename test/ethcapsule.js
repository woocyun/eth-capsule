const assertJump = require('./helpers/assertJump');
const ether = require('./helpers/ether');
const increaseTime = require('./helpers/increaseTime');
const latestTime = require('./helpers/latestTime');

const increaseTimeTo = increaseTime.increaseTimeTo;
const duration = increaseTime.duration;

const EthCapsule = artifacts.require("./EthCapsule.sol");

contract('EthCapsule', accounts => {
  const DEFAULT_MIN_DEPOSIT = ether(0.001);
  const DEFAULT_MIN_DURATION = 0;
  const DEFAULT_MAX_DURATION = duration.years(5);

  beforeEach(function () {
    return EthCapsule.new()
      .then(instance => {
        this.ethcapsule = instance;
      })
  });

  it('should allow user to bury a capsule', function (done) {
    const account = accounts[1];
    const msgValue = ether(1.123);
    const unlockDuration = duration.seconds(60);

    this.ethcapsule.bury(unlockDuration, {
      from: account,
      value: msgValue
    })
      .then(() => {
        this.ethcapsule.getCapsuleInfo(1, {
          from: account
        })
          .then(response => {
            assert.equal(response[0].toNumber(), msgValue);
            done();
          });;
      });
  });

  it('should allow user to dig up a capsule if duration has passed', function (done) {
    const account = accounts[1];
    const startTime = latestTime();
    const unlockDuration = duration.years(1);
    const unlockTime = startTime + unlockDuration + duration.minutes(1);
    const msgValue = ether(1.123);

    this.ethcapsule.bury(unlockDuration, {
      from: account,
      value: msgValue
    })
      .then(() => increaseTimeTo(unlockTime))
      .then(() => this.ethcapsule.dig(1, { from: account }))
      .then(() => this.ethcapsule.getCapsuleInfo(1, { from: account }))
      .then(([value, id, lockTime, unlockTime, withdrawnTime]) => {
        assert.isAbove(withdrawnTime.toNumber(), 0);
        done();
      });
  });

  it('should prevent user from digging up a capsule if duration has not passed', function (done) {
    const account = accounts[1];
    const startTime = latestTime();
    const unlockDuration = duration.years(1);
    const unlockTime = startTime + unlockDuration - duration.minutes(1);
    const msgValue = ether(1.123);

    this.ethcapsule.bury(unlockDuration, {
      from: account,
      value: msgValue
    })
      .then(() => increaseTimeTo(unlockTime))
      .then(() => this.ethcapsule.dig(1, { from: account }))
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });

  it('should prevent users from burying with a duration over the max duration', function (done) {
    const account = accounts[1];
    const msgValue = ether(1.123);
    const unlockDuration = DEFAULT_MAX_DURATION + 1;

    this.ethcapsule.bury(unlockDuration, {
      from: account,
      value: msgValue
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });

  it('should prevent users from burying with a duration below the min duration', function (done) {
    const account = accounts[1];
    const msgValue = ether(1.123);
    const unlockDuration = DEFAULT_MIN_DURATION - 1;

    this.ethcapsule.bury(unlockDuration, {
      from: account,
      value: msgValue
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });

  it('should prevent users from burying less than the minimum deposit', function (done) {
    const account = accounts[1];
    const msgValue = DEFAULT_MIN_DEPOSIT - ether(0.00001);
    const unlockDuration = duration.seconds(60);

    this.ethcapsule.bury(unlockDuration, {
      from: account,
      value: msgValue
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });

  it('should allow owner to set minimum deposit', function (done) {
    const owner = accounts[0];
    const minDepositToSet = ether(0.002);

    this.ethcapsule.setMinDeposit(minDepositToSet, {
      from: owner
    })
      .then(() => {
        return this.ethcapsule.minDeposit()
          .then(minDeposit => {
            assert.deepEqual(minDepositToSet, minDeposit.toNumber());
            done();
          });
      });
  });

  it('should prevent non-owners from setting minimum deposit', function (done) {
    const account = accounts[1];
    const minDepositToSet = ether(0.002);
    
    this.ethcapsule.setMinDeposit(minDepositToSet, {
      from: account
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });

  it('should allow owner to set min duration', function (done) {
    const owner = accounts[0];
    const minDurationToSet = duration.minutes(5);

    this.ethcapsule.setMinDuration(minDurationToSet, {
      from: owner
    })
      .then(() => {
        return this.ethcapsule.minDuration()
          .then(minDuration => {
            assert.equal(minDurationToSet, minDuration.toNumber());
            done();
          });
      });
  });

  it('should prevent non-owners from setting min duration', function (done) {
    const account = accounts[1];
    const minDurationToSet = duration.minutes(5);
    
    this.ethcapsule.setMinDuration(minDurationToSet, {
      from: account
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });

  it('should allow owner to set max duration', function (done) {
    const owner = accounts[0];
    const maxDurationToSet = duration.years(1);

    this.ethcapsule.setMaxDuration(maxDurationToSet, {
      from: owner
    })
      .then(() => {
        return this.ethcapsule.maxDuration()
          .then(maxDuration => {
            assert.equal(maxDurationToSet, maxDuration.toNumber());
            done();
          });
      });
  });

  it('should prevent non-owners from setting max duration', function (done) {
    const account = accounts[1];
    const maxDurationToSet = duration.years(1);
    
    this.ethcapsule.setMaxDuration(maxDurationToSet, {
      from: account
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });
});
