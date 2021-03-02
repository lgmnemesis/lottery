const Lottery = artifacts.require('./Lottery.sol');

contract('Lottery', (accounts) => {

  let lottery;
  const [manager, user1, user2, user3] = accounts;

  beforeEach(async () => {
    lottery = await Lottery.deployed();
  })

  describe('Deployment', () => {
    it('deploys successfully', () => {
      assert.ok(lottery.address);
    });
  })

  describe('Flow', () => {
    it('allow player to enter lottery', async () => {
      await lottery.enter({from: user1, value: web3.utils.toWei('1', 'ether')});
      const players = await lottery.getPlayers();
      assert.equal(players[0].toString(), user1.toString());
    });

  })
})

contract('Lottery', (accounts) => {

  let lottery;
  const [manager, user1, user2, user3] = accounts;
  let contractAccount;

  beforeEach(async () => {
    lottery = await Lottery.deployed();
  })

  describe('Flow', () => {
    it('allow multiple players to enter lottery', async () => {
      await lottery.enter({from: user1, value: web3.utils.toWei('1', 'ether')});
      await lottery.enter({from: user2, value: web3.utils.toWei('1', 'ether')});
      await lottery.enter({from: user3, value: web3.utils.toWei('1', 'ether')});

      const players = await lottery.getPlayers();
      assert.equal(players[0].toString(), user1.toString());
      assert.equal(players[1].toString(), user2.toString());
      assert.equal(players[2].toString(), user3.toString());
    });

    describe('pickWinner', () => {

      it('user can not call pickWinner', async () => {
        try {
          await lottery.pickWinner({from: user1});
          assert(false);
        } catch (error) {
          assert(error);
        }
      })

      it('manager can call pickWinner', async () => {
        contractAccount = await web3.eth.getBalance(lottery.address);
        try {
          await lottery.pickWinner({from: manager});
          assert(true);
        } catch (error) {
          assert(false);
        }
      })

      it('pickWinner flow', async () => {
        contractAccountAfterWinner = await web3.eth.getBalance(lottery.address);
        assert(contractAccount > contractAccountAfterWinner && contractAccountAfterWinner == 0);
      })
    })
  })

})