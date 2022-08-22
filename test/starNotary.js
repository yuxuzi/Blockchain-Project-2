const StarNotary = artifacts.require("StarNotary");
const starName ='Awesome Star'
var accounts;
var owner;
let starnotary
contract('StarNotary', async(accs) => {
    accounts = accs;
    owner = accounts[0];
    starnotary = await StarNotary.deployed();

});


it('can Create a Star', async() => {
    let tokenId = 1;
    await starnotary.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await starnotary.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {

    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await starnotary.createStar('awesome star', starId, {from: user1});
    await starnotary.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await starnotary.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {

    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await starnotary.createStar('awesome star', starId, {from: user1});
    await starnotary.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await starnotary.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {

    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await starnotary.createStar('awesome star', starId, {from: user1});
    await starnotary.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await starnotary.buyStar(starId, {from: user2, value: balance});
    assert.equal(await starnotary.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {

    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await starnotary.createStar('awesome star', starId, {from: user1});
    await starnotary.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await starnotary.buyStar(starId, {from: user2, value: balance, gasPrice:220300});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    expect(value).to.be.greaterThan(Number(starPrice))
    //assert.toBeGreaterThan(value, starPrice);
  });

  // Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    // 1. create a Star with different tokenId
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    assert.equal(await starnotary.name(), 'Star Notary');
    assert.equal(await starnotary.symbol(), 'STAR');
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // 3. Verify that the owners changed
    let starId1 = 6, starId2 = 7
    let user1 = accounts[1];
    let user2 = accounts[2];
    await starnotary.createStar(starName, starId1, { from: user1 });
    await starnotary.createStar('Beautiful star', starId2, { from: user2 });
    await starnotary.exchangeStars(starId1, starId2, { from: user1 })
    assert.equal(await starnotary.ownerOf(starId2), user1);
    assert.equal(await starnotary.ownerOf(starId1), user2);


});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
    let starId = 8
    let user1 = accounts[1];
    let user2 = accounts[2];
    await starnotary.createStar(starName, starId, { from: user1 });
    await starnotary.transferStar(user2, starId, { from: user1 });
    assert.equal(await starnotary.ownerOf(starId), user2);
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
    let starId = 9
    let user1 = accounts[1];
    await starnotary.createStar(starName, starId, { from: user1 });
    let createdStarName = await starnotary.lookUptokenIdToStarInfo(starId, { from: user1 });
    assert.equal(starName, createdStarName);
});


