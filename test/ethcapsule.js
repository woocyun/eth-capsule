const assertJump = require('./helpers/assertJump');

const EthCapsule = artifacts.require("./EthCapsule.sol");

contract('EthCapsule', accounts => {
  let ethcapsule;

  beforeEach(function () {
    return EthCapsule.new()
      .then(instance => {
        ethcapsule = instance;
      })
  });

  it('should allow owner to set minimum deposit', function (done) {
    const MIN_DEPOSIT = 2000000000000000;

    ethcapsule.setMinDeposit(MIN_DEPOSIT, {
      from: accounts[0]
    })
      .then(() => {
        return ethcapsule.minDeposit()
          .then(minDeposit => {
            assert.equal(MIN_DEPOSIT, minDeposit.toNumber());
            done();
          });
      });
  });

  it('should prevent non-owners from setting minimum deposit', function (done) {
    const MIN_DEPOSIT = 2000000000000000;
    
    ethcapsule.setMinDeposit(MIN_DEPOSIT, {
      from: accounts[1]
    })
      .then(() => {
        assert.fail('should have thrown before');
      }, error => {
        assertJump(error);
        done();
      });
  });
});
