const Funding = artifacts.require("Funding");
const utils = require("./utils.js");
const FINNEY = 10 ** 15;
const DAY = 3600 * 24;

contract("Funding", async accounts => {
    let firstAccount = accounts[0];
    let secondAccount = accounts[1];
    let thirdAccount = accounts[2];
    let funding;

    beforeEach(async () => {
        //funding = await Funding.new(DAY);
        // workaround for https://github.com/ethereum/web3.js/issues/2077
        // You can remove toString after issue is fixed.
        let goal = (100*FINNEY).toString();
        funding = await Funding.new(DAY,goal);
    });

    it("javascript test allows to withdraw funds after time is up and goal is not reached", async () => {
        await funding.donate({from: secondAccount, value: 50*FINNEY});

        const initBalance = await web3.eth.getBalance(secondAccount);
        assert.equal(await funding.balances.call(secondAccount), 50*FINNEY);

        await utils.timeTravel(web3, DAY);
        await funding.refund({from: secondAccount});
        const finalBalance = await web3.eth.getBalance(secondAccount);
        assert.isTrue(parseInt(finalBalance, 10) > parseInt(initBalance, 10));
    });

    it("javascript test does not allow to withdraw funds after time is up and goal is reached", async () => {
        await funding.donate({from: secondAccount, value: 100*FINNEY});
        assert.equal(await funding.balances.call(secondAccount, 50*FINNEY));
        
        await utils.timeTravel(web3, DAY);
        try{
            await funding.refund({from: secondAccount});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
    });

    it("java script test does not allow to withdraw funds before time is up and goal is not reached", async () => {
        await funding.donate({from: secondAccount, value: 50*FINNEY});
        assert.equal(await funding.balances.call(secondAccount), 50*FINNEY);
        try {
            await funding.refund({from: secondAccount});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
    });

    it("javascript test allows owner to withdraw funds when goal is reached", async () => {
        await funding.donate({from: secondAccount, value: 30*FINNEY});
        await funding.donate({from: thirdAccount, value: 70*FINNEY});

        const initBalance = await web3.eth.getBalance(firstAccount);
        await funding.withdraw();
        const finalBalance = await web3.eth.getBalance(firstAccount);
        assert.isTrue(parseInt(finalBalance,10) > parseInt(initBalance, 10));
    });

    it("javascript test does not allow non-owners to withdraw funds", async () => {
        // workaround for https://github.com/ethereum/web3.js/issues/2077
        // You can remove toString after issue is fixed.
        funding = await Funding.new(DAY,(100*FINNEY).toString(),{from: secondAccount});
        await funding.donate({from: firstAccount, value: 100*FINNEY});
        try{
            await funding.withdraw();
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
    });

    it("javascript test does not allow for donations when time is up", async () => {
        await funding.donate({from: firstAccount, value: 10*FINNEY});
        await utils.timeTravel(web3, DAY);
        try{
            await funding.donate({from: firstAccount, value: 10*FINNEY});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
    });

    it("javascript test keeps track of donator balance", async () => {
        //let funding = await Funding.new();
        await funding.donate({ from: firstAccount, value: 5 * FINNEY });
        await funding.donate({ from: secondAccount, value: 15 * FINNEY });
        await funding.donate({ from: secondAccount, value: 3 * FINNEY });
        assert.equal(await funding.balances.call(firstAccount), 5 * FINNEY);
        assert.equal(await funding.balances.call(secondAccount), 18 * FINNEY);
    });

    it("javascript test accepts donations", async () => {
        //let funding = await Funding.deployed();
        await funding.donate({ from: firstAccount, value: 10 * FINNEY });
        await funding.donate({ from: secondAccount, value: 20 * FINNEY });
        assert.equal(await funding.raised.call(), 30 * FINNEY);
    });

    it("javascript test sets an owner", async () => {
        //let funding = await Funding.deployed();
        assert.equal(await funding.owner.call(), firstAccount);
    });

    it("javascript test finishes fundraising when time is up", async () => {
        assert.equal(await funding.isFinished.call(), false);
        await utils.timeTravel(web3, DAY);
        assert.equal(await funding.isFinished.call(), true);
    });
});