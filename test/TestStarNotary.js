const StarNotary = artifacts.require("StarNotary");
const debug = require('debug');

var accounts;
var owner;
let tokenIds = [];

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
    let instance;
    let symbol;
    let name;

    beforeEach('instantiate contract instance', async () => {
        instance = await StarNotary.deployed();
        name = await instance.name.call();
        symbol = await instance.symbol.call();
    });

    it('can add the star name and star symbol properly', async() => {
        assert.equal(name, "CryptoStar");
        assert.equal(symbol, "STAR");
    });

    it('can Create a Star', async () => {
        let tokenId = tokenIds.length + 1;
        tokenIds.push(tokenId);
        console.log(name, symbol);
        await instance.createStar(`${name} ${tokenId}!`, `${symbol}`, tokenId, {from: accounts[0]});
        let starInfo = await instance.tokenIdToStarInfo.call(tokenId);
        console.log(starInfo['name']);
        assert.equal(starInfo['name'], 'CryptoStar 1!')
        assert.equal(starInfo['symbol'], 'STAR');
    });

    it('lets user1 put up their star for sale', async () => {

        let tokenId = tokenIds.length + 1;
        tokenIds.push(tokenId);

        let starPrice = web3.utils.toWei(".01", "ether");
        await instance.createStar(`${name} ${tokenId}!`, `${symbol}`, tokenId, {from: accounts[1]});
        await instance.putStarUpForSale(tokenId, starPrice, {from: accounts[1]});
        assert.equal(await instance.starsForSale.call(tokenId), starPrice);
    });

    it('lets user1 get the funds after the sale', async () => {

        let tokenId = tokenIds.length + 1;
        tokenIds.push(tokenId);
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar(`${name} ${tokenId}!`, `${symbol}`, tokenId, {from: accounts[1]});
        await instance.putStarUpForSale(tokenId, starPrice, {from: accounts[1]});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(accounts[1]);
        await instance.buyStar(tokenId, {from: accounts[2], value: balance});
        let balanceOfUser1AfterTransaction = await web3.eth.getBalance(accounts[1]);
        let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
        let value2 = Number(balanceOfUser1AfterTransaction);
        assert.equal(value1, value2);
    });

    it('lets user2 buy a star, if it is put up for sale', async () => {

        let tokenId = tokenIds.length + 1;
        tokenIds.push(tokenId);

        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar(`${name} ${tokenId}!`, `${symbol}`, tokenId, {from: accounts[1]});
        await instance.putStarUpForSale(tokenId, starPrice, {from: accounts[1]});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(accounts[2]);
        await instance.buyStar(tokenId, {from: accounts[2], value: balance});
        assert.equal(await instance.ownerOf.call(tokenId), accounts[2]);
    });

    it('lets user2 buy a star and decreases its balance in ether', async () => {

        let user1 = accounts[1];
        let user2 = accounts[2];
        let tokenId = tokenIds.length + 1;
        tokenIds.push(tokenId);
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar(`${name} ${tokenId}!`, `${symbol}`, tokenId, {from: user1});
        await instance.putStarUpForSale(tokenId, starPrice, {from: user1});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
        const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
        await instance.buyStar(tokenId, {from: user2, value: balance, gasPrice: 0});
        const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
        let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
        assert.equal(value, starPrice);
    });

// Implement Task 2 Add supporting unit tests

    it('can add the star name and star symbol properly', async () => {
        let tokenId = tokenIds.length + 1;
        tokenIds.push(tokenId);
        await instance.createStar(`${name} ${tokenId}!`, `${symbol}`, tokenId, {from: accounts[0]});
        let starInfo = await instance.tokenIdToStarInfo.call(tokenId);
        console.log(starInfo['name']);
        assert.equal(await starInfo.name, `${name} ${tokenId}!`);
        assert.equal(await starInfo.symbol, `${symbol}`);
    });

    it('lets 2 users exchange stars', async () => {

        // 1. create 2 Stars with different tokenId
        let tokenIdStar1 = tokenIds.length + 1;
        tokenIds.push(tokenIdStar1);
        let tokenIdStar2 = tokenIds.length + 1;
        tokenIds.push(tokenIdStar2);

        await instance.createStar(`${name} ${tokenIdStar1}!`, `${symbol}`, tokenIdStar1, {from: accounts[0]});
        await instance.createStar(`${name} ${tokenIdStar1}!`, `${symbol}`, tokenIdStar2, {from: accounts[1]});

        let ownerStar1_before = await instance.ownerOf(tokenIdStar1);
        let ownerStar2_before = await instance.ownerOf(tokenIdStar2);

        console.log("Owner Star One - Before: ", ownerStar1_before);
        console.log("Owner Star Two - Before: ", ownerStar2_before);

        // 2. Call the exchangeStars functions implemented in the Smart Contract
        await instance.exchangeStars(tokenIdStar1, tokenIdStar2);

        // 3. Verify that the owners changed
        let ownerStar1_after = await instance.ownerOf(tokenIdStar1);
        let ownerStar2_after = await instance.ownerOf(tokenIdStar2);
        console.log("Owner Star One - After: ", ownerStar1_after);
        console.log("Owner Star Two - After: ", ownerStar2_after);

        assert.equal(accounts[0], await instance.ownerOf(tokenIdStar2));
        assert.equal(accounts[1], await instance.ownerOf(tokenIdStar1));
    });

    it('lets a user transfer a star', async () => {

        // 1. create 2 Stars with different tokenId
        let tokenId = tokenIds.length + 1;
        tokenIds.push(tokenId);

        // 1. create a Star with different tokenId
        await instance.createStar(`${name} ${tokenId}!`, `${symbol}`, tokenId, {from: accounts[0]});

        // 2. use the transferStar function implemented in the Smart Contract
        await instance.transferStar(accounts[1], tokenId);
        // 3. Verify the star owner changed.
        console.log(`Account ${accounts[0]}: sent Star ${tokenId} to ${await instance.ownerOf(tokenId)}.`);
        assert.equal(accounts[1], await instance.ownerOf(tokenId));
    });

    it('lookUptokenIdToStarInfo test', async () => {

        let tokenId = tokenIds.length + 1;
        tokenIds.push(tokenId);

        // 1. create a Star with different tokenId
        await instance.createStar(`${name} ${tokenId}!`, `${symbol}`, tokenId, {from: accounts[0]});

        // 2. Call your method lookUptokenIdToStarInfo
        let starinfo = await instance.lookUptokenIdToStarInfo(tokenId);
        console.log("Name: ", starinfo[0]);
        console.log("Symbol: ", starinfo[1]);

        // 3. Verify if you Star name is the same
        assert.equal(starinfo[0], `${name} ${tokenId}!`);
        assert.equal(starinfo[1], 'STAR');
    });

});